import { useEffect, useRef } from 'react';
import { useAnnotationsConfig } from '~/hooks/useConfig';
import { Button } from '~/ui/Button';
import { Input } from '~/ui/Input';
import { Select } from '~/ui/Select';

import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { AnnotationsList } from './AnnotationsList';

import type { LoaderData } from "~/routes/index.types";
export const ConfigAnnotations = () => {
  const formData = useActionData();
  const { labels } = useLoaderData<LoaderData>();
  const { annotations, setAnnotations } = useAnnotationsConfig();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof formData === "undefined" || formData.form !== "annotations")
      return;

    const annotationsForDate = annotations[formData.date] ?? [];

    setAnnotations({
      ...annotations,
      [formData.date]: [...annotationsForDate, formData.annotation],
    });

    formRef.current?.reset();
  }, [formData]);

  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">🖋️ Annotations</h2>
        <p className="mt-2 text-gray-700">
          Annotations can help identify consequences of a key event.
        </p>
      </section>
      <div className="mb-8">
        <AnnotationsList />
      </div>
      <Form method="post" className="flex row gap-4" ref={formRef}>
        <input type="hidden" name="form" value="annotations" />
        <Select label="Date" id="date">
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
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </>
  );
};
