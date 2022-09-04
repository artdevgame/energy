import { Switch as HeadlessSwitch } from '@headlessui/react';

import type { ReactNode } from "react";

interface SwitchProps {
  children: ReactNode;
  enabled: boolean;
  onChange(enabled: boolean): void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Switch = ({ children, enabled, onChange }: SwitchProps) => {
  return (
    <HeadlessSwitch.Group as="div" className="flex items-center">
      <HeadlessSwitch
        checked={enabled}
        onChange={onChange}
        className={classNames(
          enabled ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </HeadlessSwitch>
      <HeadlessSwitch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">{children}</span>
      </HeadlessSwitch.Label>
    </HeadlessSwitch.Group>
  );
};
