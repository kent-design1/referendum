import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";
import Badge from "@/components/UI_Primitives/Badge";

interface FactsCardProps {
  facts: string[];
}

export default function FactsCard({ facts }: FactsCardProps) {
  return (
    <Card>
      <CardHeader
        title="Facts"
        subtitle="Neutral, verifiable points"
        action={<Badge label="Sources" value="3" />}
      />
      <CardBody>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {facts.map((fact, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "0.82rem",
                color: "var(--foreground-2)",
                lineHeight: 1.65,
              }}
            >
              {/* Yellow bullet */}
              <span style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--yellow-light)",
                border: "1.5px solid var(--yellow-mid)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                marginTop: "1px",
              }}>
                <span style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--yellow)",
                  display: "block",
                }} />
              </span>
              {fact}
            </li>
          ))}
        </ul>

        {/* Footer row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid var(--border)",
        }}>
          <Badge label="Uncertainty" value="Medium" variant="yellow" />
          <button
            style={{
              fontSize: "0.72rem",
              color: "var(--foreground-4)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--yellow-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-4)")}
          >
            View sources →
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
