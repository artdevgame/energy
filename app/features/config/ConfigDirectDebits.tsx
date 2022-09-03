import dd from '~/services/octopus-energy/direct-debits.json';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useLoaderData } from '@remix-run/react';

import type { LoaderData } from "~/routes/index.types";

export const ConfigDirectDebits = () => {
  const { labels } = useLoaderData<LoaderData>();
  return (
    <Form method="post">
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          💰 Direct Debits
        </h2>
        <p className="mt-2 text-gray-700">
          Manage direct debit rates as they change amount.
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
          {Object.entries(dd).map(([date, amount]) => (
            <li key={date} className="py-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{date}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    &pound;{amount}
                  </p>
                </div>
                <div>
                  <Button variant="outline">Remove</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex row gap-4">
        <Select label="Date">
          {[...labels].reverse().map((label, idx) => (
            <option key={`label-${idx}`} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          id="amount"
          label="Amount (&pound;)"
          placeholder="300.00"
          type="number"
        />
        <div className="self-end">
          <Button>Add</Button>
        </div>
      </div>
    </Form>
  );
};
