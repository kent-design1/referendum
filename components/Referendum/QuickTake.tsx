import type { Argument } from "@/lib/types";

interface QuickTakeProps {
  arguments_: Argument[];
}

export default function QuickTake({ arguments_ }: QuickTakeProps) {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 4px" }}>
          Quick take
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--foreground-3)", margin: 0, lineHeight: 1.6 }}>
          Based on your priorities, trade-offs around{" "}
          <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>cost risk</strong> and{" "}
          <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>implementation safeguards</strong>{" "}
          will be highlighted.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Pro / Con cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {arguments_.map((arg) => {
          const isPro = arg.type === "pro";
          return (
            <div
              key={arg.title}
              style={{
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
                background: isPro ? "var(--yellow-light)" : "var(--background-muted)",
                borderLeft: `3px solid ${isPro ? "var(--yellow)" : "var(--border-strong)"}`,
              }}
            >
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: isPro ? "var(--yellow)" : "var(--border-strong)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    color: isPro ? "var(--yellow-ink)" : "var(--foreground-3)",
                    lineHeight: 1,
                  }}>
                    {isPro ? "↑" : "↓"}
                  </span>
                </span>
                <p style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: isPro ? "var(--yellow-ink)" : "var(--foreground-4)",
                  margin: 0,
                }}>
                  {arg.title}
                </p>
              </div>
              <p style={{
                fontSize: "0.82rem",
                color: isPro ? "var(--yellow-ink)" : "var(--foreground-2)",
                margin: 0,
                lineHeight: 1.55,
                opacity: isPro ? 0.9 : 1,
              }}>
                {arg.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
