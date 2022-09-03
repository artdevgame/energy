interface InputProps extends Partial<HTMLInputElement> {
  id: string;
  label: string;
}

export const Input = ({
  className,
  id,
  label,
  placeholder,
  type = "text",
}: InputProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={id}
          id={id}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
