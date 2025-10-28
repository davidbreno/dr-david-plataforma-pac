import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-surface px-3 text-sm text-[var(--foreground)] shadow-inner shadow-black/5 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
