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
                <ul className="facts-list">
                    {facts.map((fact, i) => (
                        <li key={i} className="facts-item">
                            {/* Index pill */}
                            <span className="facts-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

                            {/* Fact text */}
                            <span className="facts-text">{fact}</span>

                            {/* Yellow bullet dot — far right */}
                            <span className="facts-dot" aria-hidden="true" />
                        </li>
                    ))}
                </ul>

                {/* Footer row */}
                <div className="facts-footer">
                    <Badge label="Uncertainty" value="Medium" variant="yellow" />

                    <button className="facts-source-btn">
                        View sources
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                            className="facts-source-arrow"
                        >
                            <path
                                d="M2 6h8M7 3l3 3-3 3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </CardBody>

            {/* Scoped styles */}
            <style>{`
        /* ── List shell ───────────────────────────────────────────── */
        .facts-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* ── Each row ─────────────────────────────────────────────── */
        .facts-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 10px 10px 0;
          border-radius: var(--radius-md);
          border-bottom: 1px solid var(--color-border-subtle);
          transition: background-color 0.15s ease;
          cursor: default;
        }

        .facts-item:last-child {
          border-bottom: none;
        }

        .facts-item:hover {
          background-color: var(--yellow-light);
          padding-left: 10px;
          margin: 0 -10px;
          width: calc(100% + 20px);
        }

        /* ── Index counter ────────────────────────────────────────── */
        .facts-index {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          background-color: var(--background-muted);
          border: 1px solid var(--color-border);
          display: grid;
          place-items: center;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--foreground-3);
          margin-top: 1px;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .facts-item:hover .facts-index {
          background-color: var(--yellow-light);
          border-color: var(--yellow-mid);
          color: var(--yellow-ink);
        }

        /* ── Fact body ────────────────────────────────────────────── */
        .facts-text {
          flex: 1;
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
        }

        .facts-item:hover .facts-text {
          color: var(--yellow-ink);
        }

        /* ── Bullet dot ───────────────────────────────────────────── */
        .facts-dot {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--color-border);
          margin-top: 8px;
          transition: background-color 0.15s ease;
        }

        .facts-item:hover .facts-dot {
          background-color: var(--yellow);
        }

        /* ── Footer ───────────────────────────────────────────────── */
        .facts-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-subtle);
        }

        /* ── "View sources" button ────────────────────────────────── */
        .facts-source-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--foreground-4);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.15s ease;
          letter-spacing: 0.01em;
        }

        .facts-source-btn:hover {
          color: var(--yellow-dark);
        }

        .facts-source-arrow {
          transition: transform 0.2s ease;
        }

        .facts-source-btn:hover .facts-source-arrow {
          transform: translateX(3px);
        }
      `}</style>
        </Card>
    );
}