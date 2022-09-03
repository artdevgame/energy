import type { ReactElement } from "react";

interface SelectProps {
  children: ReactElement<HTMLOptionElement> | ReactElement<HTMLOptionElement>[];
  id: string;
  label: string;
}

export const Select = ({ children, id, label }: SelectProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        defaultValue="Canada"
      >
        {children}
      </select>
    </div>
  );
};
