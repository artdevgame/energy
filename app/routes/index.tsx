import type { LoaderFunction } from "@remix-run/node";
import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Switch } from '~/components/Switch';
import {
    getDirectDebitAmountForDate, getRatesForDate, makeRequest
} from '~/services/octopus-energy/client';

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

interface OctopusConsumptionResult {
  consumption: number;
  interval_start: string;
  interval_end: string;
}

interface OctopusResponse {
  count: number;
  next: string;
  previous: string;
  results: OctopusConsumptionResult[];
}

interface LoaderData {
  dd: number[];
  electric: OctopusResponse;
  gas: OctopusResponse;
  labels: string[];
  totals: Record<string, ReportTotal>;
}

interface ReportTotal {
  electric: number;
  gas: number;
  combined: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export const loader: LoaderFunction = async () => {
  const dd: number[] = [];
  const totals: Record<string, ReportTotal> = {};

  const queryParams = new URLSearchParams({
    group_by: "month",
    order_by: "period",
  }).toString();

  const electric = await makeRequest<OctopusResponse>(
    `/v1/electricity-meter-points/1419831212009/meters/19L3872886/consumption/?${queryParams}`
  );

  const gas = await makeRequest<OctopusResponse>(
    `/v1/gas-meter-points/2446149707/meters/E6S11948722061/consumption/?${queryParams}`
  );

  const dates = electric.results.map((reading) =>
    DateTime.fromISO(reading.interval_end).minus({ days: 1 })
  );

  const labels = dates.map((date) => date.toISODate());

  for (const dateIndex in dates) {
    const date = dates[dateIndex];

    dd.push(getDirectDebitAmountForDate(date.toISODate()));

    const electricTotal = getItemTotal({
      consumed: electric.results[dateIndex].consumption,
      energyType: "electric",
      date: dates[dateIndex],
    });

    const gasTotal = getItemTotal({
      consumed: electric.results[dateIndex].consumption,
      energyType: "electric",
      date,
    });

    const combinedTotal = Number((electricTotal + gasTotal).toFixed(2));

    totals[date.toISODate()] = {
      combined: combinedTotal,
      electric: electricTotal,
      gas: gasTotal,
    };
  }

  return json({ dd, electric, gas, labels, totals });
};

export default function Index() {
  const [showAnnotations, setAnnotationsVisible] = useState(false);
  const apiData = useLoaderData<LoaderData>();
  const { dd, electric, gas, labels, totals } = apiData;

  const billedAmounts = Object.values(totals).map((total) => total.combined);

  const data = {
    labels,
    datasets: [
      {
        label: "Electric",
        data: electric.results.map((reading) => reading.consumption),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ${config.formattedValue} kWh`,
            afterLabel: (config: any) =>
              `Total: ~£${totals[config.label].electric}`,
          },
        },
      },
      {
        label: "Gas",
        data: gas.results.map((reading) => reading.consumption),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ${config.formattedValue} m3`,
            afterLabel: (config: any) => `Total: ~£${totals[config.label].gas}`,
          },
        },
      },
      {
        label: "Combined",
        data: billedAmounts,
        tension: 0.4,
        borderColor: "rgb(163, 230, 53)",
        backgroundColor: "rgba(163, 230, 53, 0.5)",
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: ~£${config.raw.toFixed(2)}`,
          },
        },
      },
      {
        label: "Direct Debit",
        data: dd,
        borderColor: "rgb(255,215,0)",
        backgroundColor: "rgba(255,215,0, 0.5)",
        tooltip: {
          callbacks: {
            label: (config: any) =>
              `${config.dataset.label}: £${config.raw.toFixed(2)}`,
          },
        },
      },
    ],
  };

  const options = useMemo(
    () => ({
      plugins: {
        ...(showAnnotations && { annotation: { annotations } }),
      },
      scales: {
        x: {
          grid: {
            borderDash: [2],
            color: "rgb(0, 0, 0, 0.08)",
          },
        },
        y: {
          display: false,
        },
      },
    }),
    [showAnnotations]
  );

  return (
    <div className="p-8">
      <section className="mb-4">
        <Switch enabled={showAnnotations} onChange={setAnnotationsVisible}>
          Show Annotations
        </Switch>
      </section>
      <Line data={data} options={options} />
    </div>
  );
}

const getItemTotal = ({
  consumed,
  date,
  energyType,
}: {
  consumed: number;
  date: DateTime;
  energyType: "electric" | "gas";
}) => {
  const rates = getRatesForDate(date.toISODate());
  const supply = rates[energyType];

  const conversionRate = energyType === "gas" ? 11.1868 : 1;

  const energyCharge = Number(
    ((supply.unit_cost / 100) * (consumed * conversionRate)).toFixed(2)
  );

  const standingCharge = Number(
    ((supply.standing_charge / 100) * date.daysInMonth).toFixed(2)
  );

  const subTotal = energyCharge + standingCharge;
  const vat = Number((subTotal * 0.05).toFixed(2));
  const total = Number((subTotal + vat).toFixed(2));

  return total;
};

const annotations = {
  boiler: {
    borderWidth: 2,
    label: {
      content: (ctx: any) => "2020-05-11: Boiler Installed",
      display: true,
      position: "end",
    },
    scaleID: "x",
    type: "line",
    value: "2020-07-31",
  },
  smartMeter: {
    borderWidth: 2,
    label: {
      content: (ctx: any) => "2020-07-09: Smart Meter Installed",
      display: true,
      position: "start",
    },
    scaleID: "x",
    type: "line",
    value: "2020-07-31",
  },
};
