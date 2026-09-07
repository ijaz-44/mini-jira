import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select = ({ value, onValueChange, onChange, children, className = "", ...props }: SelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      className={`h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {children}
  </option>
);