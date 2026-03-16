import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";

const changes = [
  {
    icon: "→",
    label: "Funding mechanism",
    body: "Creates a dedicated fund separate from the general federal budget.",
  },
  {
    icon: "→",
    label: "Decision authority",
    body: "Shifts certain project approvals from parliament to a new oversight body.",
  },
  {
    icon: "→",
    label: "Timeline",
    body: "Faster financing cycles for qualifying environmental projects.",
  },
];

export default function WhatChangesCard() {
  return (
    <Card>
      <CardHeader
        title="What changes?"
        subtitle="Plain language summary"
      />
      <CardBody className="flex flex-col gap-4">

        {/* Change list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {changes.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: "10px",
                padding: "10px 12px",
                background: "var(--background-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{
                fontSize: "0.8rem",
                color: "var(--yellow-dark)",
                fontWeight: 700,
                flexShrink: 0,
                marginTop: "1px",
              }}>
                {item.icon}
              </span>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 2px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--foreground-3)", margin: 0, lineHeight: 1.55 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge limits callout */}
        <div
          className="surface-yellow"
          style={{ padding: "10px 12px" }}
        >
          <p style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--yellow-ink)",
            margin: "0 0 4px",
          }}>
            Model knowledge limits
          </p>
          <p style={{
            fontSize: "0.78rem",
            color: "var(--yellow-ink)",
            margin: 0,
            lineHeight: 1.55,
            opacity: 0.85,
          }}>
            Long-term fiscal impacts depend on implementation. The assistant will cite official sources for factual claims.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
