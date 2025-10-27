import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-[var(--primary-foreground)] shadow-lg shadow-black/40 hover:bg-[#404040] focus-visible:ring-[#5a5a5a] focus-visible:ring-offset-transparent",
        secondary:
          "bg-surface-muted text-white border border-white/10 hover:border-white/20 hover:bg-surface",
        ghost:
          "bg-transparent text-[#7fb3c9] hover:bg-white/10 hover:text-white",
        destructive:
          "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:ring-danger/40",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10",
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
