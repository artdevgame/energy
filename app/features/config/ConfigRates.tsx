import rates from '~/services/octopus-energy/rates.json';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useLoaderData } from '@remix-run/react';

import type { LoaderData } from "~/routes/index.types";

export const ConfigRates = () => {
  const { labels } = useLoaderData<LoaderData>();
  return (
    <Form method="post">
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">🙈 Rates</h2>
        <p className="mt-2 text-gray-700">
          Manage utility rates associated to your account.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Find this information by viewing your{" "}
          <a
            href="https://octopus.energy/dashboard/new"
            className="font-semibold"
          >
            billing history
          </a>
          . You only need to add an entry for each month that followed the
          change in rate.
        </p>
      </section>
      <div className="mb-8 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {Object.entries(rates).map(([date, rate]) => (
            <li key={date} className="py-4">
              <div className="flex items-start space-x-4">
                <span className="text-sm text-gray-500">{date}</span>
                <div className="min-w-0 flex grow flex-col gap-4 md:gap-20 md:flex-row">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Electricity
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal">Standing Charge:</span>{" "}
                      {rate.electric.standing_charge}p/day
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal">Unit Rate:</span>{" "}
                      {rate.electric.unit_cost}p/kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gas</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal">Standing Charge:</span>{" "}
                      {rate.gas.standing_charge}p/day
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-normal">Unit Rate:</span>{" "}
                      {rate.gas.unit_cost}p/kWh
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="outline">Remove</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <Select label="Date">
          {[...labels].reverse().map((label, idx) => (
            <option key={`label-${idx}`} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          id="electric-standing-charge"
          label="E. Standing Charge (p/day)"
          placeholder="25.00"
          type="number"
        />
        <Input
          id="electric-unit-rate"
          label="E. Unit Rate (p/kWh)"
          placeholder="50.00"
          type="number"
        />
        <Input
          id="gas-standing-charge"
          label="G. Standing Charge (p/day)"
          placeholder="25.00"
          type="number"
        />
        <Input
          id="gas-unit-rate"
          label="G. Unit Rate (p/kWh)"
          placeholder="15.00"
          type="number"
        />
        <div className="self-end">
          <Button>Add</Button>
        </div>
      </div>
    </Form>
  );
};
