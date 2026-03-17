import type { Metadata } from "next";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace with backend fetch when ready
   ───────────────────────────────────────────────────────────── */
export type VoteStatus = "upcoming" | "open" | "closed";
export type VoteCategory =
    | "Environment"
    | "Economy"
    | "Social"
    | "Infrastructure"
    | "Health"
    | "Security";

export interface ReferendumVote {
    id: string;
    title: string;
    shortTitle: string;
    description: string;
    category: VoteCategory;
    voteDate: string;          // ISO date string
    canton?: string;           // undefined = federal
    status: VoteStatus;
    articleCount: number;      // # debate articles / sources
    participationEstimate?: number; // % turnout forecast
    proEstimate?: number;      // % pro polling
    conEstimate?: number;      // % con polling
    isNew?: boolean;
    isHighProfile?: boolean;
}

const MOCK_VOTES: ReferendumVote[] = [
    {
        id: "fed-2025-06-01",
        title: "Initiative for a Federal Climate Investment Fund",
        shortTitle: "Climate Fund",
        description:
            "Would create a CHF 2 billion annual fund for climate mitigation and renewable infrastructure projects across all cantons.",
        category: "Environment",
        voteDate: "2025-06-08",
        status: "open",
        articleCount: 24,
        participationEstimate: 54,
        proEstimate: 51,
        conEstimate: 49,
        isNew: false,
        isHighProfile: true,
    },
    {
        id: "fed-2025-06-02",
        title: "Counter-proposal: Voluntary Corporate Emission Targets",
        shortTitle: "Corporate Emissions",
        description:
            "A parliamentary counter-proposal favouring voluntary emission targets for businesses instead of a mandatory fund.",
        category: "Economy",
        voteDate: "2025-06-08",
        status: "open",
        articleCount: 18,
        proEstimate: 44,
        conEstimate: 56,
        isHighProfile: false,
    },
    {
        id: "fed-2025-09-01",
        title: "Expanding Residential Rental Protections",
        shortTitle: "Tenancy Reform",
        description:
            "Would amend the Code of Obligations to cap annual rent increases and extend tenant notice protections.",
        category: "Social",
        voteDate: "2025-09-21",
        status: "upcoming",
        articleCount: 11,
        participationEstimate: 48,
        isNew: true,
        isHighProfile: false,
    },
    {
        id: "fed-2025-09-02",
        title: "Highway Network Expansion — National Roads Act Amendment",
        shortTitle: "Highway Expansion",
        description:
            "Proposes six new motorway segments and capacity expansions on existing routes, funded through the National Road Fund.",
        category: "Infrastructure",
        voteDate: "2025-09-21",
        status: "upcoming",
        articleCount: 16,
        participationEstimate: 51,
        proEstimate: 38,
        conEstimate: 62,
        isNew: false,
        isHighProfile: true,
    },
    {
        id: "fed-2025-11-01",
        title: "Universal Dental Care Insurance Initiative",
        shortTitle: "Dental Insurance",
        description:
            "Would add mandatory basic dental care to the national health insurance scheme (LAMal/KVG) with a phased premium increase.",
        category: "Health",
        voteDate: "2025-11-23",
        status: "upcoming",
        articleCount: 9,
        isNew: true,
    },
    {
        id: "fed-2025-11-02",
        title: "Cybersecurity National Strategy Referendum",
        shortTitle: "Cyber Strategy",
        description:
            "Optional referendum against the Federal Council's approved national cybersecurity strategy, which mandates incident reporting for critical infrastructure.",
        category: "Security",
        voteDate: "2025-11-23",
        status: "upcoming",
        articleCount: 7,
        isNew: true,
    },
    {
        id: "be-2025-09-01",
        title: "Canton Bern: School Hours Flexibility Pilot",
        shortTitle: "School Hours",
        description:
            "Pilot programme allowing Bernese communes to shift mandatory school start times from 08:00 to 08:30 or 09:00.",
        category: "Social",
        voteDate: "2025-09-21",
        canton: "Bern",
        status: "upcoming",
        articleCount: 5,
        isNew: false,
    },
    {
        id: "zh-2025-11-01",
        title: "Canton Zürich: Tram Network Extension — Affoltern Line",
        shortTitle: "Tram Affoltern",
        description:
            "Would fund a 3.4km extension of the Zürich tram network into Affoltern, connecting the district to the main rail corridor.",
        category: "Infrastructure",
        voteDate: "2025-11-23",
        canton: "Zürich",
        status: "upcoming",
        articleCount: 6,
        proEstimate: 62,
        conEstimate: 38,
        isNew: false,
    },
];

/* ─────────────────────────────────────────────────────────────
   METADATA
   ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Upcoming Votes — Swiss Referendum Info",
    description: "Browse all upcoming federal and cantonal referendums.",
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<VoteCategory, string> = {
    Environment:    "🌱",
    Economy:        "📊",
    Social:         "🤝",
    Infrastructure: "🏗️",
    Health:         "❤️",
    Security:       "🔒",
};

const STATUS_CONFIG: Record<VoteStatus, { label: string; cls: string }> = {
    open:     { label: "Voting open",  cls: "status-open"     },
    upcoming: { label: "Upcoming",     cls: "status-upcoming" },
    closed:   { label: "Closed",       cls: "status-closed"   },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function daysUntil(iso: string) {
    const diff = new Date(iso).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86_400_000));
}

function groupByDate(votes: ReferendumVote[]) {
    const map = new Map<string, ReferendumVote[]>();
    for (const v of votes) {
        const key = v.voteDate;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(v);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function UpcomingVotesPage() {
    const allVotes   = MOCK_VOTES;
    const openVotes  = allVotes.filter((v) => v.status === "open");
    const grouped    = groupByDate(allVotes.filter((v) => v.status !== "closed"));

    return (
        <main className="uv-page">

            {/* ── Page hero ─────────────────────────────────────────── */}
            <section className="uv-hero">
                <div className="uv-hero-inner">
                    <div className="uv-hero-text">
                        <div className="uv-eyebrow">
                            <span className="uv-eyebrow-dot" />
                            Swiss Referendum Tracker
                        </div>
                        <h1 className="uv-title">Upcoming Votes</h1>
                        <p className="uv-subtitle">
                            Federal and cantonal referendums — with neutral AI-assisted summaries,
                            argument breakdowns, and source citations.
                        </p>
                    </div>

                    {/* Stat pills */}
                    <div className="uv-stats">
                        <div className="uv-stat">
                            <span className="uv-stat-value">{allVotes.length}</span>
                            <span className="uv-stat-label">Total votes</span>
                        </div>
                        <div className="uv-stat-divider" />
                        <div className="uv-stat">
                            <span className="uv-stat-value uv-stat-open">{openVotes.length}</span>
                            <span className="uv-stat-label">Open now</span>
                        </div>
                        <div className="uv-stat-divider" />
                        <div className="uv-stat">
                            <span className="uv-stat-value">{grouped.length}</span>
                            <span className="uv-stat-label">Vote dates</span>
                        </div>
                    </div>
                </div>

                {/* If any are open right now, show a CTA banner */}
                {openVotes.length > 0 && (
                    <div className="uv-open-banner">
                        <div className="uv-open-banner-dot" />
                        <p className="uv-open-banner-text">
                            <strong>{openVotes.length} referendum{openVotes.length > 1 ? "s are" : " is"} open for voting</strong>{" "}
                            — voting closes {formatDate(openVotes[0].voteDate)}.
                        </p>
                        <span className="uv-open-banner-cta">View →</span>
                    </div>
                )}
            </section>

            {/* ── Vote groups ───────────────────────────────────────── */}
            <div className="uv-groups">
                {grouped.map(([date, votes]) => {
                    const days = daysUntil(date);
                    const isOpen = votes.some((v) => v.status === "open");

                    return (
                        <section key={date} className="uv-group">
                            {/* Date header */}
                            <div className="uv-group-header">
                                <div className="uv-group-header-left">
                                    <h2 className="uv-group-date">{formatDate(date)}</h2>
                                    <span className={`uv-days-badge ${isOpen ? "uv-days-open" : ""}`}>
                    {isOpen ? "Voting open" : `${days}d away`}
                  </span>
                                </div>
                                <span className="uv-group-count">
                  {votes.length} vote{votes.length > 1 ? "s" : ""}
                </span>
                            </div>

                            {/* Cards grid */}
                            <div className="uv-cards">
                                {votes.map((vote) => (
                                    <VoteCard key={vote.id} vote={vote} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* ── Footer note ───────────────────────────────────────── */}
            <p className="uv-footnote">
                Mock data · Dates are illustrative · Not official Swiss government information
            </p>

            {/* ── All styles ────────────────────────────────────────── */}
            <style>{`

        /* ── Page shell ──────────────────────────────────────── */
        .uv-page {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* ── Hero ────────────────────────────────────────────── */
        .uv-hero {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .uv-hero-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .uv-hero-text {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .uv-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .uv-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--yellow);
          flex-shrink: 0;
        }

        .uv-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          line-height: 1.1;
          margin: 0;
        }

        .uv-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          line-height: 1.65;
          max-width: 480px;
          margin: 0;
        }

        /* Stat row */
        .uv-stats {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.75rem 1.25rem;
          box-shadow: var(--shadow-card);
          flex-shrink: 0;
        }

        .uv-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 0 1rem;
        }

        .uv-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          line-height: 1;
        }

        .uv-stat-open { color: var(--yellow-dark); }

        .uv-stat-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text-muted);
        }

        .uv-stat-divider {
          width: 1px;
          height: 32px;
          background-color: var(--color-border-subtle);
        }

        /* Open banner */
        .uv-open-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.75rem 1rem;
          background-color: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          border-radius: var(--radius-md);
        }

        .uv-open-banner-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background-color: var(--yellow-dark);
          flex-shrink: 0;
          animation: uv-pulse 2s ease-in-out infinite;
        }

        @keyframes uv-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .uv-open-banner-text {
          flex: 1;
          font-size: 0.8rem;
          color: var(--yellow-ink);
          margin: 0;
          line-height: 1.45;
        }

        .uv-open-banner-cta {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--yellow-dark);
          white-space: nowrap;
          cursor: pointer;
        }

        /* ── Groups ──────────────────────────────────────────── */
        .uv-groups {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .uv-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.875rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-border-subtle);
        }

        .uv-group-header-left {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .uv-group-date {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          margin: 0;
        }

        .uv-days-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
        }

        .uv-days-open {
          background: var(--yellow-light);
          color: var(--yellow-dark);
          border-color: var(--yellow-mid);
        }

        .uv-group-count {
          font-size: 0.72rem;
          color: var(--color-text-tertiary);
          font-weight: 500;
        }

        /* ── Cards grid ──────────────────────────────────────── */
        .uv-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0.75rem;
        }

        /* ── Vote card ───────────────────────────────────────── */
        .uv-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
          text-decoration: none;
          color: inherit;
        }

        .uv-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px 0 color-mix(in srgb, var(--color-accent) 10%, transparent);
          border-color: var(--color-accent);
        }

        .uv-card-high-profile {
          border-color: color-mix(in srgb, var(--yellow) 50%, var(--color-border));
        }

        .uv-card-high-profile:hover {
          border-color: var(--yellow);
          box-shadow: 0 6px 24px 0 color-mix(in srgb, var(--yellow) 18%, transparent);
        }

        /* Top accent stripe for open votes */
        .uv-card-stripe {
          height: 3px;
          background: linear-gradient(90deg, var(--yellow-dark), var(--yellow));
        }

        /* Card header */
        .uv-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.875rem 0.875rem 0.5rem;
        }

        .uv-card-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .uv-card-category {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          background: var(--background-muted);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border-subtle);
        }

        .uv-card-canton {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .uv-card-badge-new {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--yellow-light);
          color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        /* Status badge */
        .uv-card-status { flex-shrink: 0; }

        .status-open {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--yellow-light);
          color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .status-upcoming {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .status-closed {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--background-muted);
          color: var(--color-text-tertiary);
          border: 1px solid var(--color-border-subtle);
          opacity: 0.6;
        }

        /* Card body */
        .uv-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          padding: 0 0.875rem 0.75rem;
          flex: 1;
        }

        .uv-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .uv-card-desc {
          font-size: 0.77rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Poll bar */
        .uv-poll {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0.625rem 0.875rem;
          border-top: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
        }

        .uv-poll-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.62rem;
          font-weight: 600;
        }

        .uv-poll-pro-label  { color: var(--color-pro); }
        .uv-poll-con-label  { color: var(--color-con); }

        .uv-poll-track {
          height: 5px;
          border-radius: var(--radius-full);
          background: var(--color-con-bg);
          overflow: hidden;
        }

        .uv-poll-fill {
          height: 100%;
          border-radius: var(--radius-full);
          background: linear-gradient(90deg, var(--color-pro), color-mix(in srgb, var(--color-pro) 70%, var(--yellow)));
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Card footer */
        .uv-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.875rem;
          border-top: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
        }

        .uv-card-footer-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .uv-card-footer-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: var(--color-text-tertiary);
        }

        .uv-card-arrow {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
          transition: transform 0.15s ease, color 0.15s ease;
        }

        .uv-card:hover .uv-card-arrow {
          transform: translateX(3px);
          color: var(--color-text-primary);
        }

        /* ── Footnote ────────────────────────────────────────── */
        .uv-footnote {
          font-size: 0.68rem;
          color: var(--color-text-tertiary);
          text-align: center;
          margin: 0;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 640px) {
          .uv-page        { padding: 1.25rem 0.875rem 3rem; gap: 2rem; }
          .uv-hero-inner  { flex-direction: column; align-items: flex-start; }
          .uv-stats       { width: 100%; justify-content: space-around; }
          .uv-cards       { grid-template-columns: 1fr; }
        }
      `}</style>
        </main>
    );
}

/* ─────────────────────────────────────────────────────────────
   VOTE CARD  (sub-component)
   ───────────────────────────────────────────────────────────── */
function VoteCard({ vote }: { vote: ReferendumVote }) {
    const status = STATUS_CONFIG[vote.status];
    const hasPoll = vote.proEstimate !== undefined && vote.conEstimate !== undefined;

    return (
        <Link
            href={`/votes/${vote.id}`}
            className={`uv-card ${vote.isHighProfile ? "uv-card-high-profile" : ""}`}
        >
            {/* Accent stripe — only for open votes */}
            {vote.status === "open" && <div className="uv-card-stripe" />}

            {/* Top: category + status */}
            <div className="uv-card-top">
                <div className="uv-card-meta">
          <span className="uv-card-category">
            {CATEGORY_ICONS[vote.category]} {vote.category}
          </span>
                    {vote.canton && (
                        <span className="uv-card-canton">{vote.canton}</span>
                    )}
                    {vote.isNew && <span className="uv-card-badge-new">New</span>}
                </div>
                <span className={`uv-card-status ${status.cls}`}>{status.label}</span>
            </div>

            {/* Body: title + description */}
            <div className="uv-card-body">
                <p className="uv-card-title">{vote.title}</p>
                <p className="uv-card-desc">{vote.description}</p>
            </div>

            {/* Poll bar — only when estimate available */}
            {hasPoll && (
                <div className="uv-poll">
                    <div className="uv-poll-labels">
                        <span className="uv-poll-pro-label">For {vote.proEstimate}%</span>
                        <span className="uv-poll-con-label">Against {vote.conEstimate}%</span>
                    </div>
                    <div className="uv-poll-track">
                        <div
                            className="uv-poll-fill"
                            style={{ width: `${vote.proEstimate}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Footer: sources + participation */}
            <div className="uv-card-footer">
                <div className="uv-card-footer-meta">
          <span className="uv-card-footer-item">
            📄 {vote.articleCount} sources
          </span>
                    {vote.participationEstimate !== undefined && (
                        <span className="uv-card-footer-item">
              👥 ~{vote.participationEstimate}% turnout
            </span>
                    )}
                </div>
                <span className="uv-card-arrow">→</span>
            </div>
        </Link>
    );
}


// const MOCK_VOTES = await fetch("/api/votes").then(r => r.json());
// // or with Next.js fetch caching:
// const MOCK_VOTES = await fetch("/api/votes", { next: { revalidate: 60 } }).then(r => r.json());