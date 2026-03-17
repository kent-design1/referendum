import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";
import Badge from "@/components/UI_Primitives/Badge";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
type FactConfidence = "verified" | "estimated" | "contested";
type FactCategory   = "Financial" | "Environmental" | "Social" | "Legal" | "Timeline";

interface Fact {
    id:          string;
    text:        string;
    category:    FactCategory;
    confidence:  FactConfidence;
    sourceId:    string;
    sourceLabel: string;
}

interface FactsMeta {
    totalSources:    number;
    overallUncertain: "Low" | "Medium" | "High";
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace with API fetch later
   ───────────────────────────────────────────────────────────── */
const MOCK_META: FactsMeta = {
    totalSources:    5,
    overallUncertain: "Medium",
};

const MOCK_FACTS: Fact[] = [
    {
        id: "f1",
        text:        "Switzerland is currently 18% below its 2030 Paris Agreement emission reduction target, per the latest BAFU monitoring report.",
        category:    "Environmental",
        confidence:  "verified",
        sourceId:    "S2",
        sourceLabel: "BAFU Climate Report 2024",
    },
    {
        id: "f2",
        text:        "The proposed fund would disburse CHF 2 billion annually — roughly 2.3% of the current federal budget.",
        category:    "Financial",
        confidence:  "verified",
        sourceId:    "S1",
        sourceLabel: "Federal Voting Booklet",
    },
    {
        id: "f3",
        text:        "Average subsidy processing time under the current regime is 14 months, vs the fund's projected 6-month target cycle.",
        category:    "Timeline",
        confidence:  "estimated",
        sourceId:    "S4",
        sourceLabel: "Seco Impact Assessment",
    },
    {
        id: "f4",
        text:        "Seco projects up to 15,000 FTE jobs in green sectors over the first decade — though net gains may be lower due to substitution effects.",
        category:    "Social",
        confidence:  "contested",
        sourceId:    "S4",
        sourceLabel: "Seco Impact Assessment",
    },
    {
        id: "f5",
        text:        "The Federal Constitution assigns core energy and environmental competencies to cantons under Articles 74 and 89.",
        category:    "Legal",
        confidence:  "verified",
        sourceId:    "S6",
        sourceLabel: "Federal Constitution",
    },
    {
        id: "f6",
        text:        "EPFL modelling estimates the fund would accelerate solar and wind capacity additions by 3–5 years versus the baseline trajectory.",
        category:    "Environmental",
        confidence:  "estimated",
        sourceId:    "S3",
        sourceLabel: "EPFL Energy Study 2024",
    },
];

/* ─────────────────────────────────────────────────────────────
   CONFIG
   ───────────────────────────────────────────────────────────── */
const CONFIDENCE_CONFIG: Record<FactConfidence, {
    label: string; bg: string; text: string; border: string; dot: string;
}> = {
    verified:  { label: "Verified",  bg: "var(--color-pro-bg)",  text: "var(--color-pro)",   border: "var(--color-pro-border)", dot: "var(--color-pro)"  },
    estimated: { label: "Estimated", bg: "var(--yellow-light)",  text: "var(--yellow-dark)", border: "var(--yellow-mid)",       dot: "var(--yellow)"    },
    contested: { label: "Contested", bg: "var(--color-con-bg)",  text: "var(--color-con)",   border: "var(--color-con-border)", dot: "var(--color-con)"  },
};

const CATEGORY_ICONS: Record<FactCategory, string> = {
    Financial:     "💰",
    Environmental: "🌱",
    Social:        "🤝",
    Legal:         "⚖️",
    Timeline:      "⏱",
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function FactsCard() {
    const verifiedCount  = MOCK_FACTS.filter((f) => f.confidence === "verified").length;
    const contestedCount = MOCK_FACTS.filter((f) => f.confidence === "contested").length;

    return (
        <Card>
            <CardHeader
                title="Facts"
                subtitle="Neutral, verifiable points from official sources"
                action={
                    <div className="fc-header-badges">
            <span className="fc-verified-badge">
              <span className="fc-verified-dot" />
                {verifiedCount} verified
            </span>
                        <Badge label="Sources" value={String(MOCK_META.totalSources)} />
                    </div>
                }
            />

            <CardBody>
                <div className="fc-body">

                    {/* ── Confidence legend ──────────────────────────── */}
                    <div className="fc-legend">
                        {(["verified", "estimated", "contested"] as FactConfidence[]).map((c) => {
                            const cfg = CONFIDENCE_CONFIG[c];
                            return (
                                <span key={c} className="fc-legend-item">
                  <span className="fc-legend-dot" style={{ background: cfg.dot }} />
                                    {cfg.label}
                </span>
                            );
                        })}
                    </div>

                    {/* ── Facts list ─────────────────────────────────── */}
                    <ul className="fc-list">
                        {MOCK_FACTS.map((fact, i) => {
                            const cfg = CONFIDENCE_CONFIG[fact.confidence];
                            return (
                                <li key={fact.id} className="fc-item">
                                    {/* Index */}
                                    <span className="fc-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                                    {/* Content */}
                                    <div className="fc-content">
                                        <div className="fc-meta-row">
                      <span className="fc-category">
                        {CATEGORY_ICONS[fact.category]} {fact.category}
                      </span>
                                            <span
                                                className="fc-confidence"
                                                style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                                            >
                        <span className="fc-conf-dot" style={{ background: cfg.dot }} />
                                                {cfg.label}
                      </span>
                                        </div>

                                        <p className="fc-text">{fact.text}</p>

                                        <span className="fc-source">
                      <span className="fc-source-id">{fact.sourceId}</span>
                                            {fact.sourceLabel}
                    </span>
                                    </div>

                                    {/* Trailing dot */}
                                    <span className="fc-dot" aria-hidden="true" />
                                </li>
                            );
                        })}
                    </ul>

                    {/* ── Footer ─────────────────────────────────────── */}
                    <div className="fc-footer">
                        <div className="fc-footer-left">
                            <Badge label="Uncertainty" value={MOCK_META.overallUncertain} variant="yellow" />
                            {contestedCount > 0 && (
                                <span className="fc-contested-note">
                  ⚠ {contestedCount} disputed
                </span>
                            )}
                        </div>
                        <button className="fc-source-btn">
                            View sources
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="fc-arrow">
                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                </div>
            </CardBody>

            {/* ── Scoped styles ─────────────────────────────────────── */}
            <style>{`

        .fc-body { display: flex; flex-direction: column; gap: 12px; }

        /* Header badges */
        .fc-header-badges { display: flex; align-items: center; gap: 5px; }

        .fc-verified-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: var(--radius-full);
          font-size: 0.62rem; font-weight: 700;
          background: var(--color-pro-bg); color: var(--color-pro);
          border: 1px solid var(--color-pro-border); white-space: nowrap;
        }

        .fc-verified-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--color-pro); flex-shrink: 0;
        }

        /* Legend */
        .fc-legend {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 10px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
        }

        .fc-legend-item {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.62rem; font-weight: 600; color: var(--color-text-muted);
        }

        .fc-legend-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* List */
        .fc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

        /* Item */
        .fc-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 10px 10px 0;
          border-radius: var(--radius-md);
          border-bottom: 1px solid var(--color-border-subtle);
          transition: background-color 0.14s ease, padding-left 0.14s ease;
          cursor: default;
        }

        .fc-item:last-child { border-bottom: none; }

        .fc-item:hover {
          background: var(--yellow-light);
          padding-left: 10px;
          margin: 0 -10px;
          width: calc(100% + 20px);
        }

        /* Index */
        .fc-index {
          flex-shrink: 0; width: 24px; height: 24px;
          border-radius: var(--radius-sm);
          background: var(--background-muted);
          border: 1px solid var(--color-border);
          display: grid; place-items: center;
          font-size: 0.58rem; font-weight: 800; letter-spacing: 0.04em;
          color: var(--color-text-muted); margin-top: 2px;
          transition: all 0.14s ease;
        }

        .fc-item:hover .fc-index {
          background: var(--yellow-light);
          border-color: var(--yellow-mid);
          color: var(--yellow-ink);
        }

        /* Content */
        .fc-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }

        .fc-meta-row { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

        .fc-category {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 600;
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .fc-confidence {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 700; border: 1px solid;
        }

        .fc-conf-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }

        .fc-item:hover .fc-category,
        .fc-item:hover .fc-confidence { opacity: 0.75; }

        .fc-text {
          font-size: 0.8rem; color: var(--color-text-secondary);
          line-height: 1.65; margin: 0;
        }

        .fc-item:hover .fc-text { color: var(--yellow-ink); }

        .fc-source {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.62rem; color: var(--color-text-tertiary);
        }

        .fc-source-id { font-weight: 800; color: var(--color-text-secondary); }

        .fc-item:hover .fc-source     { color: var(--yellow-dark); opacity: 0.8; }
        .fc-item:hover .fc-source-id  { color: var(--yellow-ink); }

        /* Trailing dot */
        .fc-dot {
          flex-shrink: 0; width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-border); margin-top: 9px;
          transition: background 0.14s ease;
        }

        .fc-item:hover .fc-dot { background: var(--yellow); }

        /* Footer */
        .fc-footer {
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.5rem; padding-top: 10px;
          border-top: 1px solid var(--color-border-subtle);
        }

        .fc-footer-left { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

        .fc-contested-note {
          display: inline-flex; align-items: center;
          font-size: 0.62rem; font-weight: 600;
          color: var(--color-con);
          background: var(--color-con-bg);
          border: 1px solid var(--color-con-border);
          padding: 2px 7px; border-radius: var(--radius-full);
        }

        .fc-source-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted);
          background: none; border: none; padding: 0;
          cursor: pointer; transition: color 0.14s ease; white-space: nowrap;
        }

        .fc-source-btn:hover { color: var(--yellow-dark); }
        .fc-arrow { transition: transform 0.18s ease; }
        .fc-source-btn:hover .fc-arrow { transform: translateX(3px); }
      `}</style>
        </Card>
    );
}
//
// const { facts, meta } = await fetch(`/api/votes/${voteId}/facts`).then(r => r.json());