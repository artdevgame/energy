import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { DateTime } from 'luxon';
import { ConfigAnnotations } from '~/features/config/ConfigAnnotations';
import { ConfigDirectDebits } from '~/features/config/ConfigDirectDebits';
import { ConfigOctopus } from '~/features/config/ConfigOctopus';
import { ConfigRates } from '~/features/config/ConfigRates/ConfigRates';
import { ExportConfigButton } from '~/features/config/ExportConfigButton';
import { UsageChart } from '~/features/UsageChart';
import {
    getDirectDebitAmountForDate, getRatesForDate, makeRequest
} from '~/services/octopus-energy/client';
import { Divider } from '~/ui/Divider';

import { json } from '@remix-run/node';

import type { OctopusResponse, ReportTotal } from "./index.types";
export default function Index() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-16">
        <h1 className="text-2xl font-semibold">
          💡 Energy Use (via Octopus Energy 🐙)
        </h1>
        <ExportConfigButton />
      </div>
      <section className="mt-8 mb-16">
        <UsageChart />
      </section>
      <div className="max-w-screen-lg">
        <section>
          <ConfigAnnotations />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section>
          <ConfigDirectDebits />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section>
          <ConfigRates />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section className="mb-16">
          <ConfigOctopus />
        </section>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return Object.fromEntries(formData);
};

export const loader: LoaderFunction = async () => {
  const dd: number[] = [];
  const totals: Record<string, ReportTotal> = {};

  const queryParams = new URLSearchParams({
    group_by: "month",
    order_by: "period",
  }).toString();

  const electric = await makeRequest<OctopusResponse>(
    `/v1/electricity-meter-points/${process.env.ELECTRIC_MPAN}/meters/${process.env.ELECTRIC_SERIAL}/consumption/?${queryParams}`
  );

  const gas = await makeRequest<OctopusResponse>(
    `/v1/gas-meter-points/${process.env.GAS_MPRN}/meters/${process.env.GAS_SERIAL}/consumption/?${queryParams}`
  );

  const dates = electric.results.map((reading) =>
    DateTime.fromISO(reading.interval_end).toUTC()
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
      energyType: "gas",
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

  const energyCharge = Number(((supply.unit_cost / 100) * consumed).toFixed(2));

  const standingCharge = Number(
    ((supply.standing_charge / 100) * date.daysInMonth).toFixed(2)
  );

  const subTotal = energyCharge + standingCharge;
  const vat = Number((subTotal * 0.05).toFixed(2));
  const total = Number((subTotal + vat).toFixed(2));

  return total;
};
