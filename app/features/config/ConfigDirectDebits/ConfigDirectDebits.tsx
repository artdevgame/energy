import { useEffect } from 'react';
import { useDirectDebitConfig } from '~/hooks/useConfig';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { DirectDebitList } from './DirectDebitList';

import type { LoaderData } from "~/routes/index.types";
export const ConfigDirectDebits = () => {
  const formData = useActionData();
  const { labels } = useLoaderData<LoaderData>();
  const { directDebits, setDirectDebits } = useDirectDebitConfig();

  useEffect(() => {
    if (typeof formData === "undefined" || formData.form !== "direct-debits")
      return;

    setDirectDebits({ ...directDebits, [formData.date]: formData.amount });
  }, [formData]);

  return (
    <>
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
      {directDebits && (
        <div className="mb-8 flow-root">
          <DirectDebitList />
        </div>
      )}
      <Form method="post" className="flex row gap-4">
        <input type="hidden" name="form" value="direct-debits" />

        <Select label="Date" id="date">
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
          step=".01"
          min="0"
        />
        <div className="self-end">
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </>
  );
};
