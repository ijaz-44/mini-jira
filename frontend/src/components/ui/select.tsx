"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
      className={cn(
        "h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value} className="bg-popover text-popover-foreground">
    {children}
  </option>
);