import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide";
  const variants: Record<Required<BadgeProps>["variant"], string> = {
    default: "bg-primary/20 text-white",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-danger/20 text-danger",
    outline: "border border-white/20 text-white",
  };

  return <span className={cn(base, variants[variant], className)} {...props} />;
}
