import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-[var(--primary-foreground)] shadow-md hover:bg-primary/90 focus-visible:ring-primary/40",
        secondary:
          "border border-[var(--border)] bg-surface text-[var(--foreground)] shadow-sm hover:bg-surface-muted focus-visible:ring-primary/35",
        ghost:
          "bg-transparent text-[color:rgb(var(--foreground-rgb)/0.7)] hover:bg-[color:rgb(var(--foreground-rgb)/0.08)] hover:text-[var(--foreground)] focus-visible:ring-primary/35",
        destructive:
          "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:ring-danger/40",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-surface-muted focus-visible:ring-primary/35",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
      rounded: {
        default: "",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";


