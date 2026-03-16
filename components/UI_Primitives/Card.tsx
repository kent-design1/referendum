import { cn } from "@/lib/utils";

/* ── Card shell ─────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "subtle";
  className?: string;
}

export function Card({ children, variant = "default", className }: CardProps) {
  return (
    <div className={cn(variant === "subtle" ? "card-subtle" : "card", className)}>
      {children}
    </div>
  );
}

/* ── Card header ────────────────────────────────────────── */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("card-header flex items-start justify-between gap-4", className)}>
      <div>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ marginTop: "0.2rem", fontSize: "0.75rem" }} className="text-muted">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Card body ──────────────────────────────────────────── */
export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("card-body", className)}>{children}</div>;
}
