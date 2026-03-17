import { cn } from "@/lib/utils";

/* ── Card shell ─────────────────────────────────────────── */
interface CardProps {
    children: React.ReactNode;
    variant?: "default" | "subtle" | "inset";
    className?: string;
}

export function Card({ children, variant = "default", className }: CardProps) {
    const base =
        variant === "subtle" ? "card-subtle"
            : variant === "inset" ? "card-inset"
                : "card";

    return (
        <div className={cn(base, "card-shell", className)}>
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
        <div className={cn("card-header", className)}>
            <div className="card-header-text">
                <h3 className="card-title">{title}</h3>
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="card-header-action">{action}</div>}
        </div>
    );
}

/* ── Card body ──────────────────────────────────────────── */
interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
    return <div className={cn("card-body", className)}>{children}</div>;
}

/* ── Card footer ────────────────────────────────────────── */
interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return <div className={cn("card-footer", className)}>{children}</div>;
}