import { useEffect, useRef } from 'react';
import { useRatesConfig } from '~/hooks/useConfig';
import { useGraphData } from '~/hooks/useGraphData';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useActionData } from '@remix-run/react';

import { RatesList } from './RatesList';

interface FormData {
  form: string;
  date: string;
  electricStandingCharge: number;
  electricUnitRate: number;
  gasStandingCharge: number;
  gasUnitRate: number;
}

export const ConfigRatesForm = () => {
  const formData = useActionData<FormData>();
  const { labels } = useGraphData();
  const { rates, setRates } = useRatesConfig();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof formData === "undefined" || formData.form !== "rates") return;

    setRates({
      ...rates,
      [formData.date]: {
        electric: {
          standingCharge: formData.electricStandingCharge,
          unitRate: formData.electricUnitRate,
        },
        gas: {
          standingCharge: formData.gasStandingCharge,
          unitRate: formData.gasUnitRate,
        },
      },
    });

    formRef.current?.reset();
  }, [formData]);

  return (
    <>
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
        <RatesList />
      </div>
      <Form
        method="post"
        className="flex flex-col md:flex-row gap-4 md:items-end"
        ref={formRef}
      >
        <input type="hidden" name="form" value="rates" />
        <Select id="date" label="Date">
          {[...labels].reverse().map((label, idx) => (
            <option key={`label-${idx}`} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          id="electricStandingCharge"
          label="E. Standing Charge (p/day)"
          placeholder="25.00"
          type="number"
          step=".01"
          min="0"
        />
        <Input
          id="electricUnitRate"
          label="E. Unit Rate (p/kWh)"
          placeholder="50.00"
          type="number"
          step=".01"
          min="0"
        />
        <Input
          id="gasStandingCharge"
          label="G. Standing Charge (p/day)"
          placeholder="25.00"
          type="number"
          step=".01"
          min="0"
        />
        <Input
          id="gasUnitRate"
          label="G. Unit Rate (p/kWh)"
          placeholder="15.00"
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
