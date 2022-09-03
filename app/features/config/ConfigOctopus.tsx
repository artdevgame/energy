import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';

import { Form } from '@remix-run/react';

export const ConfigOctopus = () => {
  return (
    <Form method="post">
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
          id="api-key"
          label="API Key"
          placeholder="sk_live_abcdefghijklmop1234"
        />
        <h3>Electric Meter</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex flex-grow flex-col"
            id="electric-mpan"
            label="MPAN"
            placeholder="1234567890"
          />
          <Input
            className="flex flex-grow flex-col"
            id="electric-serial"
            label="Serial Number"
            placeholder="19L123456"
          />
        </div>
        <h3>Gas Meter</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex flex-grow flex-col"
            id="gas-mprn"
            label="MPRN"
            placeholder="0987654321"
          />
          <Input
            className="flex flex-grow flex-col"
            id="gas-serial"
            label="Serial Number"
            placeholder="E6S123456"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button">Save</Button>
      </div>
    </Form>
  );
};
