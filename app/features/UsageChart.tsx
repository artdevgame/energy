import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Switch } from '~/ui/Switch';

import { useLoaderData } from '@remix-run/react';

import type { LoaderData } from "~/routes/index.types";

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

export const UsageChart = () => {
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
    <div>
      <section className="mb-4">
        <Switch enabled={showAnnotations} onChange={setAnnotationsVisible}>
          Show Annotations
        </Switch>
      </section>
      <Line data={data} options={options} />
    </div>
  );
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
