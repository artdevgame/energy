import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: "default" | "outline";
}

const variants = {
  default:
    "inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  outline:
    "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
};

export const Button = ({
  children,
  type = "button",
  variant = "default",
}: ButtonProps) => {
  return (
    <button type={type} className={variants[variant]}>
      {children}
    </button>
  );
};
