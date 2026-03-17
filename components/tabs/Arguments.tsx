/* ─────────────────────────────────────────────────────────────
   ArgumentsPanel — replace MOCK_ARGUMENTS with API data later
   ───────────────────────────────────────────────────────────── */

export type ArgumentSide      = "pro" | "con";
export type ArgumentStrength  = "strong" | "moderate" | "weak";
export type ArgumentCategory  = "Economic" | "Environmental" | "Social" | "Legal" | "Governance";

export interface Argument {
    id:         string;
    side:       ArgumentSide;
    title:      string;
    body:       string;
    category:   ArgumentCategory;
    strength:   ArgumentStrength;
    sourceId?:  string;          // e.g. "S1"
    sourceLabel?: string;
    upvotes:    number;
    contested?: boolean;         // flagged as disputed
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
   ───────────────────────────────────────────────────────────── */
const MOCK_ARGUMENTS: Argument[] = [
    /* ── PRO ─────────────────────────────────────────────── */
    {
        id: "pro-1",
        side: "pro",
        title: "Provides long-term planning security",
        body: "A dedicated fund removes year-by-year budget uncertainty, allowing cantons and municipalities to commission multi-year decarbonisation projects with confidence.",
        category: "Governance",
        strength: "strong",
        sourceId: "S1",
        sourceLabel: "Federal Voting Booklet",
        upvotes: 84,
    },
    {
        id: "pro-2",
        side: "pro",
        title: "Accelerates renewable energy deployment",
        body: "Modelling by EPFL estimates the fund would bring forward solar and wind capacity additions by 3–5 years compared to the current subsidy regime.",
        category: "Environmental",
        strength: "strong",
        sourceId: "S3",
        sourceLabel: "EPFL Energy Study, 2024",
        upvotes: 71,
    },
    {
        id: "pro-3",
        side: "pro",
        title: "Creates 15,000 green-sector jobs",
        body: "Seco projections suggest the investment programme would support up to 15,000 full-time-equivalent positions in construction, engineering, and facility management.",
        category: "Economic",
        strength: "moderate",
        sourceId: "S4",
        sourceLabel: "Seco Impact Assessment",
        upvotes: 56,
        contested: true,
    },
    {
        id: "pro-4",
        side: "pro",
        title: "Strengthens Switzerland's Paris Agreement compliance",
        body: "Current projections put Switzerland 18% short of its 2030 NDC target. The fund directly addresses the investment gap identified by BAFU.",
        category: "Legal",
        strength: "strong",
        sourceId: "S2",
        sourceLabel: "BAFU Climate Report",
        upvotes: 63,
    },
    {
        id: "pro-5",
        side: "pro",
        title: "Reduces long-run healthcare costs",
        body: "Air quality improvements driven by fossil fuel phase-out are projected to save CHF 400M annually in respiratory and cardiovascular healthcare expenditures by 2035.",
        category: "Social",
        strength: "moderate",
        sourceId: "S5",
        sourceLabel: "BAG Health-Climate Brief",
        upvotes: 39,
    },

    /* ── CON ──────────────────────────────────────────────── */
    {
        id: "con-1",
        side: "con",
        title: "CHF 2B annual cost lacks firm fiscal offset",
        body: "The Federal Finance Administration notes that no explicit revenue source has been earmarked. Critics argue this creates structural budget pressure or requires a payroll levy.",
        category: "Economic",
        strength: "strong",
        sourceId: "S1",
        sourceLabel: "Federal Voting Booklet",
        upvotes: 78,
    },
    {
        id: "con-2",
        side: "con",
        title: "Bypasses established cantonal environmental competencies",
        body: "The Conference of Cantonal Governments argues the fund centralises decisions that the Constitution currently assigns to cantons, undermining federalism.",
        category: "Legal",
        strength: "strong",
        sourceId: "S6",
        sourceLabel: "Conference of Cantonal Governments",
        upvotes: 65,
    },
    {
        id: "con-3",
        side: "con",
        title: "Technology lock-in risk",
        body: "Locking in specific technologies via a dedicated fund may disadvantage superior solutions that emerge in the 2030s, reducing flexibility.",
        category: "Governance",
        strength: "moderate",
        sourceId: "S3",
        sourceLabel: "EPFL Energy Study, 2024",
        upvotes: 42,
        contested: true,
    },
    {
        id: "con-4",
        side: "con",
        title: "Implementation safeguards are undefined",
        body: "The initiative text does not specify an independent oversight body or audit mechanism, leaving allocation criteria to future Federal Council ordinances.",
        category: "Governance",
        strength: "strong",
        sourceId: "S2",
        sourceLabel: "BAFU Climate Report",
        upvotes: 59,
    },
    {
        id: "con-5",
        side: "con",
        title: "Higher electricity prices for households",
        body: "Rapid grid expansion required to support new capacity is estimated to add CHF 120–180 per year to the average household electricity bill.",
        category: "Social",
        strength: "moderate",
        sourceId: "S4",
        sourceLabel: "Seco Impact Assessment",
        upvotes: 34,
        contested: true,
    },
];

const CATEGORY_ICONS: Record<ArgumentCategory, string> = {
    Economic:      "📊",
    Environmental: "🌱",
    Social:        "🤝",
    Legal:         "⚖️",
    Governance:    "🏛️",
};

const STRENGTH_CONFIG: Record<ArgumentStrength, { label: string; color: string; bg: string }> = {
    strong:   { label: "Strong",   color: "var(--color-text-primary)", bg: "var(--background-muted)" },
    moderate: { label: "Moderate", color: "var(--color-text-muted)",   bg: "var(--background-muted)" },
    weak:     { label: "Weak",     color: "var(--color-text-tertiary)", bg: "var(--background-muted)" },
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function ArgumentsPanel() {
    const pros = MOCK_ARGUMENTS.filter((a) => a.side === "pro");
    const cons = MOCK_ARGUMENTS.filter((a) => a.side === "con");

    const totalUpvotesPro = pros.reduce((s, a) => s + a.upvotes, 0);
    const totalUpvotesCon = cons.reduce((s, a) => s + a.upvotes, 0);
    const totalUpvotes    = totalUpvotesPro + totalUpvotesCon;
    const proWeight       = Math.round((totalUpvotesPro / totalUpvotes) * 100);

    return (
        <div className="ap-shell">

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="ap-header">
                <div className="ap-header-left">
                    <p className="ap-eyebrow">Arguments</p>
                    <h2 className="ap-title">Initiative for a Climate Fund</h2>
                    <p className="ap-subtitle">
                        {MOCK_ARGUMENTS.length} curated arguments from verified sources ·{" "}
                        <span className="ap-subtitle-note">Replace with API data</span>
                    </p>
                </div>
                <div className="ap-header-badges">
                    <span className="ap-badge-pro">{pros.length} For</span>
                    <span className="ap-badge-con">{cons.length} Against</span>
                </div>
            </div>

            {/* ── Weight bar ──────────────────────────────────────── */}
            <div className="ap-weight">
                <div className="ap-weight-labels">
                    <span className="ap-weight-pro">Community weight: For {proWeight}%</span>
                    <span className="ap-weight-con">Against {100 - proWeight}%</span>
                </div>
                <div className="ap-weight-track">
                    <div className="ap-weight-fill" style={{ width: `${proWeight}%` }} />
                    <div className="ap-weight-midline" />
                </div>
                <p className="ap-weight-note">Based on {totalUpvotes} community upvotes on sourced arguments</p>
            </div>

            {/* ── Columns ─────────────────────────────────────────── */}
            <div className="ap-columns">

                {/* PRO */}
                <div className="ap-col">
                    <div className="ap-col-header ap-col-header-pro">
                        <span className="ap-col-icon ap-col-icon-pro">↑</span>
                        <span className="ap-col-label">Arguments For</span>
                        <span className="ap-col-count">{pros.length}</span>
                    </div>
                    <div className="ap-col-list">
                        {pros.map((arg) => <ArgumentCard key={arg.id} arg={arg} />)}
                    </div>
                </div>

                {/* CON */}
                <div className="ap-col">
                    <div className="ap-col-header ap-col-header-con">
                        <span className="ap-col-icon ap-col-icon-con">↓</span>
                        <span className="ap-col-label">Arguments Against</span>
                        <span className="ap-col-count">{cons.length}</span>
                    </div>
                    <div className="ap-col-list">
                        {cons.map((arg) => <ArgumentCard key={arg.id} arg={arg} />)}
                    </div>
                </div>
            </div>

            {/* ── Disclaimer ──────────────────────────────────────── */}
            <div className="ap-disclaimer">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6.5 5.5v4M6.5 4v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Arguments are curated from the official Federal Voting Booklet and cited third-party analyses.
                They represent positions held by stakeholders, not the platform's stance.
                Contested arguments are flagged.
            </div>

            {/* ── Scoped styles ───────────────────────────────────── */}
            <style>{`

        /* Shell */
        .ap-shell {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        /* Header */
        .ap-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1rem 0.875rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .ap-header-left { display: flex; flex-direction: column; gap: 3px; }

        .ap-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          margin: 0;
        }

        .ap-title {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .ap-subtitle {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .ap-subtitle-note {
          color: var(--yellow-dark);
          font-weight: 600;
        }

        .ap-header-badges {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
          align-items: flex-start;
        }

        .ap-badge-pro, .ap-badge-con {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
        }

        .ap-badge-pro {
          background: var(--color-pro-bg);
          color: var(--color-pro);
          border-color: var(--color-pro-border);
        }

        .ap-badge-con {
          background: var(--color-con-bg);
          color: var(--color-con);
          border-color: var(--color-con-border);
        }

        /* Weight bar */
        .ap-weight {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0.75rem 1rem;
          background: var(--color-surface-raised);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .ap-weight-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          font-weight: 600;
        }

        .ap-weight-pro { color: var(--color-pro); }
        .ap-weight-con { color: var(--color-con); }

        .ap-weight-track {
          position: relative;
          height: 7px;
          border-radius: var(--radius-full);
          background: var(--color-con-bg);
          overflow: hidden;
        }

        .ap-weight-fill {
          position: absolute;
          inset: 0 auto 0 0;
          background: linear-gradient(90deg, var(--color-pro), color-mix(in srgb, var(--color-pro) 65%, var(--yellow)));
          border-radius: var(--radius-full);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ap-weight-midline {
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          width: 1.5px;
          background: var(--color-surface);
          z-index: 1;
        }

        .ap-weight-note {
          font-size: 0.62rem;
          color: var(--color-text-tertiary);
          margin: 0;
        }

        /* Two-column grid */
        .ap-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .ap-col {
          display: flex;
          flex-direction: column;
        }

        .ap-col:first-child {
          border-right: 1px solid var(--color-border-subtle);
        }

        /* Column header */
        .ap-col-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.625rem 0.875rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .ap-col-header-pro { background: var(--color-pro-bg); }
        .ap-col-header-con { background: var(--color-con-bg); }

        .ap-col-icon {
          width: 18px; height: 18px;
          border-radius: 50%;
          display: grid; place-items: center;
          font-size: 0.65rem; font-weight: 800;
          flex-shrink: 0;
        }

        .ap-col-icon-pro { background: var(--color-pro); color: #fff; }
        .ap-col-icon-con { background: var(--color-con); color: #fff; }

        .ap-col-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          flex: 1;
        }

        .ap-col-header-pro .ap-col-label { color: var(--color-pro); }
        .ap-col-header-con .ap-col-label { color: var(--color-con); }

        .ap-col-count {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          border: 1px solid;
        }

        .ap-col-header-pro .ap-col-count {
          background: var(--color-pro-bg);
          color: var(--color-pro);
          border-color: var(--color-pro-border);
        }

        .ap-col-header-con .ap-col-count {
          background: var(--color-con-bg);
          color: var(--color-con);
          border-color: var(--color-con-border);
        }

        /* List */
        .ap-col-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0.625rem;
        }

        /* ── Argument card ───────────────────────────────── */
        .ap-arg {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          cursor: default;
          transition: background-color 0.14s ease, border-color 0.14s ease;
        }

        .ap-arg-pro:hover {
          background: var(--color-pro-bg);
          border-color: var(--color-pro-border);
        }

        .ap-arg-con:hover {
          background: var(--color-con-bg);
          border-color: var(--color-con-border);
        }

        .ap-arg-top {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .ap-arg-category {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          font-size: 0.58rem;
          font-weight: 600;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .ap-arg-strength {
          font-size: 0.58rem;
          font-weight: 600;
          color: var(--color-text-tertiary);
        }

        .ap-arg-contested {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          font-size: 0.58rem;
          font-weight: 600;
          background: var(--yellow-light);
          color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .ap-arg-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .ap-arg-body {
          font-size: 0.74rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .ap-arg-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding-top: 4px;
          border-top: 1px solid var(--color-border-subtle);
          margin-top: 2px;
        }

        .ap-arg-source {
          font-size: 0.62rem;
          color: var(--color-text-tertiary);
          display: flex;
          align-items: center;
          gap: 3px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ap-arg-source-id {
          font-weight: 700;
          color: var(--color-text-secondary);
          flex-shrink: 0;
        }

        .ap-arg-upvotes {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          font-weight: 600;
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        /* Disclaimer */
        .ap-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          font-size: 0.68rem;
          color: var(--color-text-muted);
          line-height: 1.55;
        }

        .ap-disclaimer svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Responsive: stack columns on mobile */
        @media (max-width: 600px) {
          .ap-columns { grid-template-columns: 1fr; }
          .ap-col:first-child { border-right: none; border-bottom: 1px solid var(--color-border-subtle); }
        }
      `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ARGUMENT CARD  (sub-component)
   ───────────────────────────────────────────────────────────── */
function ArgumentCard({ arg }: { arg: Argument }) {
    const isPro     = arg.side === "pro";
    const strength  = STRENGTH_CONFIG[arg.strength];

    return (
        <div className={`ap-arg ${isPro ? "ap-arg-pro" : "ap-arg-con"}`}>

            {/* Top tags */}
            <div className="ap-arg-top">
        <span className="ap-arg-category">
          {CATEGORY_ICONS[arg.category]} {arg.category}
        </span>
                <span className="ap-arg-strength">{strength.label}</span>
                {arg.contested && (
                    <span className="ap-arg-contested">⚠ Contested</span>
                )}
            </div>

            {/* Title + body */}
            <p className="ap-arg-title">{arg.title}</p>
            <p className="ap-arg-body">{arg.body}</p>

            {/* Footer: source + upvotes */}
            {(arg.sourceId || arg.upvotes > 0) && (
                <div className="ap-arg-footer">
                    {arg.sourceId && (
                        <span className="ap-arg-source">
              <span className="ap-arg-source-id">{arg.sourceId}</span>
                            {arg.sourceLabel}
            </span>
                    )}
                    {arg.upvotes > 0 && (
                        <span className="ap-arg-upvotes">
              ↑ {arg.upvotes}
            </span>
                    )}
                </div>
            )}
        </div>
    );
}


// const data: Argument[] = await fetch(`/api/votes/${voteId}/arguments`).then(r => r.json());