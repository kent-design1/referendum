import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;       // 0–100
  variant?: "default" | "yellow";
  showValue?: boolean;
  className?: string;
}

export default function ProgressBar({
  label,
  value,
  variant = "default",
  showValue = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.78rem", color: "var(--foreground-3)" }}>{label}</span>
        {showValue && (
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: variant === "yellow" ? "var(--yellow-dark)" : "var(--foreground-2)",
            }}
          >
            {clamped}
          </span>
        )}
      </div>
      <div className="progress-track">
        <div
          className={cn("progress-fill", variant === "yellow" && "progress-fill-yellow")}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
