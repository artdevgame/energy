import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useLoaderData } from '@remix-run/react';

import type { LoaderData } from "~/routes/index.types";

const annotations = {
  "2020-11-30": "Installed Boiler",
  "2020-07-09": "Installed Smart Meter",
};

export const ConfigAnnotations = () => {
  const { labels } = useLoaderData<LoaderData>();
  return (
    <Form method="post">
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">🖋️ Annotations</h2>
        <p className="mt-2 text-gray-700">
          Annotations can help identify consequences of a key event.
        </p>
      </section>
      <div className="mb-8 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {Object.entries(annotations).map(([date, annotation]) => (
            <li key={date} className="py-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{date}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {annotation}
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
          className="grow"
          id="annotation"
          label="Annotation"
          placeholder="Installed a boiler"
        />
        <div className="self-end">
          <Button>Add</Button>
        </div>
      </div>
    </Form>
  );
};
