import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-surface px-3 text-sm text-[var(--foreground)] shadow-inner shadow-black/5 transition placeholder:text-[color:rgb(var(--foreground-rgb)/0.45)] focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
