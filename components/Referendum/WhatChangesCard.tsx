import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace with API fetch later
   ───────────────────────────────────────────────────────────── */
type ChangeImpact = "high" | "medium" | "low";
type ChangeArea   = "Finance" | "Governance" | "Timeline" | "Environment" | "Legal";

interface WhatChange {
    id:       string;
    area:     ChangeArea;
    icon:     string;
    label:    string;
    body:     string;
    impact:   ChangeImpact;
    isNew?:   boolean;
}

interface KnowledgeLimit {
    id:   string;
    text: string;
}

const MOCK_CHANGES: WhatChange[] = [
    {
        id: "c1",
        area: "Finance",
        icon: "💰",
        label: "Dedicated investment fund",
        body: "Creates a CHF 2B annual fund ring-fenced from the general federal budget, insulating climate investment from annual parliamentary appropriation cycles.",
        impact: "high",
        isNew: false,
    },
    {
        id: "c2",
        area: "Governance",
        icon: "🏛️",
        label: "New project approval authority",
        body: "Shifts certain project approvals from the Federal Council to a new independent oversight body whose composition and mandate will be defined in a future ordinance.",
        impact: "high",
        isNew: true,
    },
    {
        id: "c3",
        area: "Timeline",
        icon: "⚡",
        label: "Faster financing cycles",
        body: "Qualifying environmental projects would access funding within 6 months of application — compared to the current 14-month average under the existing subsidy regime.",
        impact: "medium",
    },
    {
        id: "c4",
        area: "Environment",
        icon: "🌱",
        label: "Mandatory cantonal climate plans",
        body: "Each canton must submit a 10-year decarbonisation roadmap to access fund allocations, creating a de facto national planning framework for the first time.",
        impact: "medium",
        isNew: true,
    },
    {
        id: "c5",
        area: "Legal",
        icon: "⚖️",
        label: "Federal override on energy permits",
        body: "In cases of national strategic interest, the federal fund authority gains power to accelerate cantonal permitting — a significant shift in the federal–cantonal balance.",
        impact: "high",
    },
];

const MOCK_LIMITS: KnowledgeLimit[] = [
    { id: "l1", text: "Long-term fiscal impacts depend on implementation details not yet legislated." },
    { id: "l2", text: "The oversight body's composition is undefined — effectiveness is speculative." },
    { id: "l3", text: "Factual claims will be cited from the official Federal Voting Booklet in production." },
];

/* ─────────────────────────────────────────────────────────────
   CONFIG
   ───────────────────────────────────────────────────────────── */
const IMPACT_CONFIG: Record<ChangeImpact, { label: string; dot: string; text: string; bg: string; border: string }> = {
    high:   { label: "High impact",   dot: "var(--color-con)",  text: "var(--color-con)",  bg: "var(--color-con-bg)",  border: "var(--color-con-border)"  },
    medium: { label: "Medium impact", dot: "var(--yellow-dark)", text: "var(--yellow-dark)", bg: "var(--yellow-light)", border: "var(--yellow-mid)"        },
    low:    { label: "Low impact",    dot: "var(--color-pro)",   text: "var(--color-pro)",   bg: "var(--color-pro-bg)", border: "var(--color-pro-border)"  },
};

const AREA_COLORS: Record<ChangeArea, string> = {
    Finance:     "var(--yellow-light)",
    Governance:  "var(--background-muted)",
    Timeline:    "var(--color-pro-bg)",
    Environment: "var(--color-pro-bg)",
    Legal:       "var(--color-con-bg)",
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function WhatChangesCard() {
    const highCount = MOCK_CHANGES.filter((c) => c.impact === "high").length;

    return (
        <Card>
            <CardHeader
                title="What changes?"
                subtitle="Plain language summary of key legal and structural shifts"
                action={
                    <span className="wc-high-badge">
            <span className="wc-high-dot" />
                        {highCount} high impact
          </span>
                }
            />

            <CardBody>
                <div className="wc-body">

                    {/* ── Change list ─────────────────────────────────── */}
                    <div className="wc-list">
                        {MOCK_CHANGES.map((item, i) => {
                            const impactCfg = IMPACT_CONFIG[item.impact];
                            return (
                                <div key={item.id} className="wc-item">

                                    {/* Timeline connector */}
                                    <div className="wc-timeline">
                                        <div className="wc-timeline-icon" style={{ background: AREA_COLORS[item.area] }}>
                                            <span className="wc-icon-emoji">{item.icon}</span>
                                        </div>
                                        {i < MOCK_CHANGES.length - 1 && <div className="wc-timeline-line" />}
                                    </div>

                                    {/* Content */}
                                    <div className="wc-content">
                                        <div className="wc-content-top">
                                            <div className="wc-labels">
                                                <p className="wc-label">{item.label}</p>
                                                <div className="wc-tags">
                                                    <span className="wc-area-tag">{item.area}</span>
                                                    {item.isNew && <span className="wc-new-tag">New</span>}
                                                </div>
                                            </div>
                                            <span
                                                className="wc-impact-pill"
                                                style={{ background: impactCfg.bg, color: impactCfg.text, borderColor: impactCfg.border }}
                                            >
                        <span className="wc-impact-dot" style={{ background: impactCfg.dot }} />
                                                {impactCfg.label}
                      </span>
                                        </div>
                                        <p className="wc-body-text">{item.body}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Knowledge limits callout ─────────────────────── */}
                    <div className="wc-limits">
                        <div className="wc-limits-header">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <circle cx="6" cy="6" r="5" stroke="var(--yellow-dark)" strokeWidth="1.2" />
                                <path d="M6 5v3.5M6 3.5v.4" stroke="var(--yellow-dark)" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            <span className="wc-limits-title">Model knowledge limits</span>
                        </div>
                        <ul className="wc-limits-list">
                            {MOCK_LIMITS.map((l) => (
                                <li key={l.id} className="wc-limit-item">
                                    <span className="wc-limit-dot" />
                                    {l.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Footer meta ─────────────────────────────────── */}
                    <div className="wc-footer">
                        <span className="wc-footer-source">📄 Federal Voting Booklet · S1</span>
                        <span className="wc-footer-note">Mock data — replace with API</span>
                    </div>

                </div>
            </CardBody>

            {/* ── Scoped styles ─────────────────────────────────────── */}
            <style>{`

        /* Body wrapper */
        .wc-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* High-impact badge in header action */
        .wc-high-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.62rem;
          font-weight: 700;
          background: var(--color-con-bg);
          color: var(--color-con);
          border: 1px solid var(--color-con-border);
          white-space: nowrap;
        }

        .wc-high-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--color-con);
          flex-shrink: 0;
          animation: wc-pulse 2s ease-in-out infinite;
        }

        @keyframes wc-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* ── Timeline list ─────────────────────────────── */
        .wc-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .wc-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        /* Left timeline column */
        .wc-timeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 32px;
        }

        .wc-timeline-icon {
          width: 32px; height: 32px;
          border-radius: var(--radius-md);
          display: grid; place-items: center;
          border: 1px solid var(--color-border-subtle);
          flex-shrink: 0;
          z-index: 1;
        }

        .wc-icon-emoji { font-size: 0.875rem; line-height: 1; }

        .wc-timeline-line {
          width: 1.5px;
          flex: 1;
          min-height: 16px;
          background: linear-gradient(to bottom, var(--color-border-subtle), transparent);
          margin: 4px 0 4px;
        }

        /* Right content */
        .wc-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 14px;
        }

        .wc-list .wc-item:last-child .wc-content {
          padding-bottom: 0;
        }

        .wc-content-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }

        .wc-labels { display: flex; flex-direction: column; gap: 3px; }

        .wc-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.2;
        }

        .wc-tags {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .wc-area-tag {
          display: inline-flex;
          align-items: center;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          font-size: 0.58rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .wc-new-tag {
          display: inline-flex;
          align-items: center;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          font-size: 0.58rem;
          font-weight: 700;
          background: var(--yellow-light);
          color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .wc-impact-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.6rem;
          font-weight: 700;
          border: 1px solid;
          flex-shrink: 0;
          align-self: flex-start;
        }

        .wc-impact-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wc-body-text {
          font-size: 0.77rem;
          color: var(--color-text-muted);
          line-height: 1.62;
          margin: 0;
        }

        /* ── Knowledge limits ──────────────────────────── */
        .wc-limits {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 12px;
          background: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          border-left: 3px solid var(--yellow);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .wc-limits-header {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .wc-limits-title {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--yellow-ink);
        }

        .wc-limits-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .wc-limit-item {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 0.74rem;
          color: var(--yellow-dark);
          line-height: 1.55;
        }

        .wc-limit-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--yellow);
          flex-shrink: 0;
          margin-top: 7px;
        }

        /* ── Footer ────────────────────────────────────── */
        .wc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .wc-footer-source {
          font-size: 0.62rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .wc-footer-note {
          font-size: 0.6rem;
          color: var(--color-text-tertiary);
          font-style: italic;
        }
      `}</style>
        </Card>
    );
}
//
// const { changes, limits } = await fetch(`/api/votes/${voteId}/what-changes`).then(r => r.json());