import { useEffect } from 'react';
import { useOctopusConfig } from '~/hooks/useConfig';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';

import { Form, useActionData } from '@remix-run/react';

export const ConfigOctopus = () => {
  const formData = useActionData();
  const { octopus, setOctopus } = useOctopusConfig();
  useEffect(() => {
    if (typeof formData === "undefined" || formData.form !== "octopus") return;

    setOctopus({
      apiKey: formData.apiKey,
      electric: {
        mpan: formData.electricMpan,
        serial: formData.electricSerial,
      },
      gas: {
        mprn: formData.gasMprn,
        serial: formData.gasMprn,
      },
    });
  }, [formData]);

  return (
    <Form method="post">
      <input type="hidden" name="form" value="octopus" />
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          🐙 Octopus Energy
        </h2>
        <p className="mt-2 text-gray-700">
          Provide meter related information to connect to the Octopus API
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Find this information on the{" "}
          <a
            href="https://octopus.energy/dashboard/developer/"
            className="font-semibold"
          >
            developer dashboard
          </a>
          .
        </p>
      </section>
      <div className="flex flex-col gap-4 mb-4">
        <Input
          id="apiKey"
          label="API Key"
          placeholder="sk_live_abcdefghijklmop1234"
          defaultValue={octopus.apiKey}
        />
        <h3>Electric Meter</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex flex-grow flex-col"
            id="electricMpan"
            label="MPAN"
            placeholder="1234567890"
            defaultValue={octopus.electric.mpan}
          />
          <Input
            className="flex flex-grow flex-col"
            id="electricSerial"
            label="Serial Number"
            placeholder="19L123456"
            defaultValue={octopus.electric.serial}
          />
        </div>
        <h3>Gas Meter</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex flex-grow flex-col"
            id="gasMprn"
            label="MPRN"
            placeholder="0987654321"
            defaultValue={octopus.gas.mprn}
          />
          <Input
            className="flex flex-grow flex-col"
            id="gasSerial"
            label="Serial Number"
            placeholder="E6S123456"
            defaultValue={octopus.gas.serial}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
};
