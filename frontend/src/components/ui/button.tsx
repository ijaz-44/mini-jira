'use client';

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
    // Base styling using strict design system tokens (No hardcoded colors)
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer";

    // Variant mappings strictly using theme.css tokens
    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90 shadow-xs",
      outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
      danger: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-xs",
    };

    // Size mappings
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";