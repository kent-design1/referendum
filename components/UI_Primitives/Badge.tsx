import { cn } from "@/lib/utils";

type Variant = "default" | "yellow" | "success" | "error";

interface BadgeProps {
  label?: string;
  value: string;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: "badge",
  yellow:  "badge badge-yellow",
  success: "badge badge-success",
  error:   "badge badge-error",
};

export default function Badge({
  label,
  value,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span className={cn(variants[variant], className)}>
      {label && <span style={{ opacity: 0.65 }}>{label}</span>}
      <span>{value}</span>
    </span>
  );
}
