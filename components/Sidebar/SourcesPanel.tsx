import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";
import Badge from "@/components/UI_Primitives/Badge";
import { sources } from "@/constants";

const TRUST_TIERS: Record<string, { label: string; variant: "success" | "yellow" | "default" }> = {
  S1: { label: "Official",  variant: "success" },
  S2: { label: "Official",  variant: "success" },
  S3: { label: "Verified",  variant: "yellow"  },
};

export default function SourcesPanel() {
  return (
    <Card>
      <CardHeader
        title="Sources"
        subtitle="Example registry (mock)"
        action={
          <span style={{ fontSize: "0.72rem", color: "var(--foreground-4)" }}>
            {sources.length} cited
          </span>
        }
      />
      <CardBody className="flex flex-col gap-4" >
        {sources.map((source, i) => {
          const tier = TRUST_TIERS[source.id] ?? { label: "Unverified", variant: "default" as const };
          return (
            <div
              key={source.id}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "11px 12px",
                background: "var(--background-subtle)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "border-color 0.12s ease, background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--yellow-mid)";
                e.currentTarget.style.background = "var(--yellow-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--background-subtle)";
              }}
            >
              {/* Source ID badge */}
              <span style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-md)",
                background: "var(--yellow-light)",
                color: "var(--yellow-ink)",
                fontSize: "0.65rem",
                fontWeight: 800,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                border: "1px solid color-mix(in srgb, var(--yellow) 40%, transparent)",
                letterSpacing: "0.02em",
              }}>
                {source.id}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                  <p style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {source.title}
                  </p>
                  <Badge value={tier.label} variant={tier.variant} />
                </div>
                <p style={{
                  fontSize: "0.73rem",
                  color: "var(--foreground-3)",
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {source.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Footer note */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 2px 0",
        }}>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--success)",
            flexShrink: 0,
          }} />
          <p style={{ fontSize: "0.7rem", color: "var(--foreground-4)", margin: 0 }}>
            Official sources are cited directly from federal documentation.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
