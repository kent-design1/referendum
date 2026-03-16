import Badge from "@/components/UI_Primitives/Badge";
import type { Referendum } from "@/lib/types";

export default function VoteBanner({ referendum }: { referendum: Referendum }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--foreground-4)", margin: "0 0 4px" }}>
          Current Referendum
        </p>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", margin: 0, letterSpacing: "-0.01em" }}>
          {referendum.title}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--foreground-3)", margin: "3px 0 0" }}>
          {referendum.description}
        </p>
      </div>
      <Badge label="Vote date" value={referendum.voteDate} variant="yellow" />
    </div>
  );
}
