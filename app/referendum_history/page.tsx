import type { Metadata } from "next";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace with backend fetch when ready
   ───────────────────────────────────────────────────────────── */
export type VoteOutcome  = "accepted" | "rejected" | "withdrawn";
export type VoteCategory = "Environment" | "Economy" | "Social" | "Infrastructure" | "Health" | "Security" | "Democracy";

export interface HistoricalVote {
    id:               string;
    title:            string;
    description:      string;
    category:         VoteCategory;
    voteDate:         string;         // ISO date string
    canton?:          string;         // undefined = federal
    outcome:          VoteOutcome;
    finalYesPct:      number;         // e.g. 54.3
    finalNoPct:       number;
    turnoutPct:       number;
    cantonYes:        number;         // cantons that voted yes
    cantonNo:         number;
    totalVoters:      number;
    isHighProfile?:   boolean;
    aiSummarySnippet: string;
}

const MOCK_HISTORY: HistoricalVote[] = [
    {
        id: "fed-2024-11-01",
        title: "Initiative for a 13th AVS/AHV Monthly Pension Payment",
        description: "Mandated a 13th monthly pension payment for all AVS/AHV retirees, financed by a payroll contribution increase.",
        category: "Social",
        voteDate: "2024-03-03",
        outcome: "accepted",
        finalYesPct: 58.2,
        finalNoPct: 41.8,
        turnoutPct: 58.6,
        cantonYes: 22,
        cantonNo: 4,
        totalVoters: 2_890_000,
        isHighProfile: true,
        aiSummarySnippet: "Passed with a clear majority across most cantons, marking the first successful pension expansion initiative in decades.",
    },
    {
        id: "fed-2024-11-02",
        title: "Initiative for a Minimum Pension Increase",
        description: "Demanded a 10% increase in minimum AVS/AHV pensions specifically for low-income retirees.",
        category: "Social",
        voteDate: "2024-03-03",
        outcome: "rejected",
        finalYesPct: 40.7,
        finalNoPct: 59.3,
        turnoutPct: 58.6,
        cantonYes: 8,
        cantonNo: 18,
        totalVoters: 2_890_000,
        aiSummarySnippet: "Rejected despite the success of the companion 13th pension initiative, with voters preferring the broader approach.",
    },
    {
        id: "fed-2024-06-01",
        title: "Federal Act on the Reform of the Occupational Pension Scheme (BVG)",
        description: "Revised the second pillar (occupational) pension system to improve coverage for part-time and low-wage workers.",
        category: "Social",
        voteDate: "2024-09-22",
        outcome: "rejected",
        finalYesPct: 48.1,
        finalNoPct: 51.9,
        turnoutPct: 46.1,
        cantonYes: 9,
        cantonNo: 17,
        totalVoters: 2_280_000,
        isHighProfile: true,
        aiSummarySnippet: "Narrowly rejected; critics argued the coordination deduction changes would disproportionately favour certain worker segments.",
    },
    {
        id: "fed-2024-06-02",
        title: "Initiative for the Primary Healthcare Fund",
        description: "Would have established a federal fund to support primary care infrastructure and reduce patient co-payments.",
        category: "Health",
        voteDate: "2024-06-09",
        outcome: "rejected",
        finalYesPct: 38.5,
        finalNoPct: 61.5,
        turnoutPct: 44.8,
        cantonYes: 5,
        cantonNo: 21,
        totalVoters: 2_200_000,
        aiSummarySnippet: "Soundly rejected, with opponents citing federalism concerns and existing cantonal health competencies.",
    },
    {
        id: "fed-2023-11-01",
        title: "Climate Protection Act (Counter-Proposal to Glacier Initiative)",
        description: "Set binding targets for net-zero emissions by 2050 and allocated CHF 3.2 billion for building and industry decarbonisation.",
        category: "Environment",
        voteDate: "2023-06-18",
        outcome: "accepted",
        finalYesPct: 59.1,
        finalNoPct: 40.9,
        turnoutPct: 42.5,
        cantonYes: 21,
        cantonNo: 5,
        totalVoters: 2_080_000,
        isHighProfile: true,
        aiSummarySnippet: "Accepted by a comfortable majority; the Glacier Initiative was simultaneously withdrawn in favour of this counter-proposal.",
    },
    {
        id: "fed-2023-06-01",
        title: "OECD Minimum Tax Rate Implementation",
        description: "Constitutional amendment allowing the federal government to implement the OECD/G20 minimum corporate tax rate of 15%.",
        category: "Economy",
        voteDate: "2023-06-18",
        outcome: "accepted",
        finalYesPct: 78.5,
        finalNoPct: 21.5,
        turnoutPct: 42.5,
        cantonYes: 26,
        cantonNo: 0,
        totalVoters: 2_080_000,
        isHighProfile: true,
        aiSummarySnippet: "Passed with near-unanimous support across all cantons, one of the highest acceptance rates in recent Swiss referendum history.",
    },
    {
        id: "fed-2022-11-01",
        title: "Tightening of the Tenancy Law (Counter-Reform)",
        description: "Would have made it easier for landlords to terminate rental agreements for own use and raised the bar for rent reduction claims.",
        category: "Social",
        voteDate: "2022-09-25",
        outcome: "rejected",
        finalYesPct: 42.6,
        finalNoPct: 57.4,
        turnoutPct: 51.2,
        cantonYes: 7,
        cantonNo: 19,
        totalVoters: 2_510_000,
        aiSummarySnippet: "Rejected, with urban cantons voting strongly against; housing affordability concerns dominated the debate.",
    },
    {
        id: "fed-2022-06-01",
        title: "Initiative on Responsible Business (Revision)",
        description: "Required Swiss companies to conduct human rights and environmental due diligence across their global supply chains.",
        category: "Economy",
        voteDate: "2022-11-27",
        outcome: "rejected",
        finalYesPct: 49.8,
        finalNoPct: 50.2,
        turnoutPct: 45.7,
        cantonYes: 12,
        cantonNo: 14,
        totalVoters: 2_240_000,
        aiSummarySnippet: "Rejected by the narrowest of margins; failed on the cantonal majority criterion despite a slim overall popular majority.",
    },
    {
        id: "fed-2021-11-01",
        title: "Covid-19 Act (Special Measures)",
        description: "Approved the legislative basis for the Federal Council's Covid-19 measures, including the certificate system.",
        category: "Health",
        voteDate: "2021-11-28",
        outcome: "accepted",
        finalYesPct: 62.0,
        finalNoPct: 38.0,
        turnoutPct: 65.7,
        cantonYes: 23,
        cantonNo: 3,
        totalVoters: 3_220_000,
        isHighProfile: true,
        aiSummarySnippet: "Confirmed with a large turnout during the peak of the pandemic debate; reflected public trust in the Federal Council's approach.",
    },
    {
        id: "fed-2021-06-01",
        title: "Marriage for All",
        description: "Extended civil marriage rights and joint adoption to same-sex couples, and opened sperm donation to female couples.",
        category: "Democracy",
        voteDate: "2021-09-26",
        outcome: "accepted",
        finalYesPct: 64.1,
        finalNoPct: 35.9,
        turnoutPct: 52.6,
        cantonYes: 25,
        cantonNo: 1,
        totalVoters: 2_580_000,
        isHighProfile: true,
        aiSummarySnippet: "Passed by a clear majority; Switzerland became the 30th country to legalise same-sex marriage.",
    },
    {
        id: "zh-2023-03-01",
        title: "Canton Zürich: Urban Densification Initiative",
        description: "Required communes to increase residential density near public transport hubs by reducing minimum plot sizes.",
        category: "Infrastructure",
        voteDate: "2023-03-12",
        canton: "Zürich",
        outcome: "accepted",
        finalYesPct: 55.4,
        finalNoPct: 44.6,
        turnoutPct: 38.2,
        cantonYes: 0,
        cantonNo: 0,
        totalVoters: 680_000,
        aiSummarySnippet: "Accepted in the canton; seen as a response to rising rents and housing shortages in the Zürich agglomeration.",
    },
    {
        id: "be-2022-11-01",
        title: "Canton Bern: Police Surveillance Powers Expansion",
        description: "Granted cantonal police expanded authorisation for digital surveillance in serious criminal investigations.",
        category: "Security",
        voteDate: "2022-11-27",
        canton: "Bern",
        outcome: "accepted",
        finalYesPct: 61.3,
        finalNoPct: 38.7,
        turnoutPct: 42.1,
        cantonYes: 0,
        cantonNo: 0,
        totalVoters: 490_000,
        aiSummarySnippet: "Accepted with a comfortable majority; civil liberties groups called for a federal framework to standardise cantonal surveillance law.",
    },
];

/* ─────────────────────────────────────────────────────────────
   METADATA
   ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Referendum History — Swiss Referendum Info",
    description: "Browse past federal and cantonal referendum results.",
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<VoteCategory, string> = {
    Environment:  "🌱",
    Economy:      "📊",
    Social:       "🤝",
    Infrastructure: "🏗️",
    Health:       "❤️",
    Security:     "🔒",
    Democracy:    "🗳️",
};

const OUTCOME_CONFIG: Record<VoteOutcome, {
    label: string;
    bg: string;
    text: string;
    border: string;
    bar: string;
}> = {
    accepted:  { label: "Accepted",  bg: "var(--color-pro-bg)",     text: "var(--color-pro)",     border: "var(--color-pro-border)",  bar: "var(--color-pro)"  },
    rejected:  { label: "Rejected",  bg: "var(--color-con-bg)",     text: "var(--color-con)",     border: "var(--color-con-border)",  bar: "var(--color-con)"  },
    withdrawn: { label: "Withdrawn", bg: "var(--color-neutral-bg)", text: "var(--color-neutral)", border: "var(--color-border)",      bar: "var(--color-neutral)" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-CH", {
        day: "numeric", month: "long", year: "numeric",
    });
}

function formatYear(iso: string) {
    return new Date(iso).getFullYear();
}

function formatVoters(n: number) {
    return (n / 1_000_000).toFixed(1) + "M";
}

function groupByYear(votes: HistoricalVote[]) {
    const map = new Map<number, HistoricalVote[]>();
    for (const v of votes) {
        const y = formatYear(v.voteDate);
        if (!map.has(y)) map.set(y, []);
        map.get(y)!.push(v);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
}

/* ─────────────────────────────────────────────────────────────
   AGGREGATE STATS
   ───────────────────────────────────────────────────────────── */
function buildStats(votes: HistoricalVote[]) {
    const federal  = votes.filter((v) => !v.canton);
    const accepted = votes.filter((v) => v.outcome === "accepted");
    const avgTurnout = Math.round(votes.reduce((s, v) => s + v.turnoutPct, 0) / votes.length);
    const highestYes = [...votes].sort((a, b) => b.finalYesPct - a.finalYesPct)[0];
    const lowestYes  = [...votes].filter((v) => v.outcome !== "withdrawn").sort((a, b) => a.finalYesPct - b.finalYesPct)[0];

    return { total: votes.length, federal: federal.length, accepted: accepted.length, avgTurnout, highestYes, lowestYes };
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function ReferendumHistoryPage() {
    const allVotes = MOCK_HISTORY;
    const grouped  = groupByYear(allVotes);
    const stats    = buildStats(allVotes);

    return (
        <main className="rh-page">

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="rh-hero">
                <div className="rh-hero-text">
                    <div className="rh-eyebrow">
                        <span className="rh-eyebrow-dot" />
                        Swiss Referendum Tracker
                    </div>
                    <h1 className="rh-title">Referendum History</h1>
                    <p className="rh-subtitle">
                        A neutral, searchable archive of past federal and cantonal referendum results,
                        with AI-generated summaries and official vote data.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="rh-stats-grid">
                    <StatCard value={stats.total}     label="Total votes archived" />
                    <StatCard value={stats.federal}   label="Federal referendums"  />
                    <StatCard value={stats.accepted}  label="Accepted"             accent="pro" />
                    <StatCard value={`${stats.avgTurnout}%`} label="Avg. turnout"  />
                </div>
            </section>

            {/* ── Notable outcomes banner ────────────────────────────── */}
            <section className="rh-notable">
                <div className="rh-notable-card rh-notable-high">
                    <span className="rh-notable-label">Highest yes vote</span>
                    <p className="rh-notable-title">{stats.highestYes.title}</p>
                    <span className="rh-notable-pct">{stats.highestYes.finalYesPct}% yes · {formatDate(stats.highestYes.voteDate)}</span>
                </div>
                <div className="rh-notable-card rh-notable-low">
                    <span className="rh-notable-label">Closest result</span>
                    <p className="rh-notable-title">{stats.lowestYes.title}</p>
                    <span className="rh-notable-pct">{stats.lowestYes.finalYesPct}% yes · {formatDate(stats.lowestYes.voteDate)}</span>
                </div>
            </section>

            {/* ── Timeline ──────────────────────────────────────────── */}
            <section className="rh-timeline">
                {grouped.map(([year, votes]) => (
                    <div key={year} className="rh-year-group">

                        {/* Year header */}
                        <div className="rh-year-header">
                            <h2 className="rh-year-label">{year}</h2>
                            <div className="rh-year-meta">
                <span className="rh-year-meta-item">
                  {votes.filter(v => v.outcome === "accepted").length} accepted
                </span>
                                <span className="rh-year-dot" />
                                <span className="rh-year-meta-item">
                  {votes.filter(v => v.outcome === "rejected").length} rejected
                </span>
                                <span className="rh-year-dot" />
                                <span className="rh-year-meta-item">{votes.length} total</span>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="rh-cards">
                            {votes.map((vote) => (
                                <HistoryCard key={vote.id} vote={vote} />
                            ))}
                        </div>

                    </div>
                ))}
            </section>

            {/* ── Footer note ───────────────────────────────────────── */}
            <p className="rh-footnote">
                Mock data · Results are illustrative · Not official Swiss government records
            </p>

            {/* ── All scoped styles ─────────────────────────────────── */}
            <style>{`

        /* ── Page shell ──────────────────────────────────────── */
        .rh-page {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* ── Hero ────────────────────────────────────────────── */
        .rh-hero {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .rh-hero-text {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .rh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .rh-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--yellow);
          flex-shrink: 0;
        }

        .rh-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          line-height: 1.1;
          margin: 0;
        }

        .rh-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          line-height: 1.65;
          max-width: 520px;
          margin: 0;
        }

        /* ── Stats grid ──────────────────────────────────────── */
        .rh-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .rh-stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 1.25rem 0.75rem;
          border-right: 1px solid var(--color-border-subtle);
          text-align: center;
        }

        .rh-stat-card:last-child { border-right: none; }

        .rh-stat-value {
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--color-text-primary);
          line-height: 1;
        }

        .rh-stat-value-pro { color: var(--color-pro); }

        .rh-stat-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text-muted);
          line-height: 1.3;
        }

        /* ── Notable banner ──────────────────────────────────── */
        .rh-notable {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .rh-notable-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid;
        }

        .rh-notable-high {
          background-color: var(--color-pro-bg);
          border-color: var(--color-pro-border);
        }

        .rh-notable-low {
          background-color: var(--yellow-light);
          border-color: var(--yellow-mid);
        }

        .rh-notable-label {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .rh-notable-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rh-notable-pct {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .rh-notable-high .rh-notable-pct { color: var(--color-pro); }
        .rh-notable-low  .rh-notable-pct { color: var(--yellow-dark); }

        /* ── Timeline ────────────────────────────────────────── */
        .rh-timeline {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .rh-year-group {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .rh-year-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-border-subtle);
        }

        .rh-year-label {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          margin: 0;
        }

        .rh-year-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rh-year-meta-item {
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--color-text-muted);
        }

        .rh-year-dot {
          width: 3px;
          height: 3px;
          border-radius: var(--radius-full);
          background-color: var(--color-border);
        }

        /* ── Card grid ───────────────────────────────────────── */
        .rh-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0.75rem;
        }

        /* ── History card ────────────────────────────────────── */
        .rh-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
        }

        .rh-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px 0 color-mix(in srgb, var(--color-accent) 10%, transparent);
          border-color: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
        }

        .rh-card-high-profile {
          border-color: color-mix(in srgb, var(--yellow) 40%, var(--color-border));
        }

        .rh-card-high-profile:hover {
          border-color: var(--yellow-mid);
          box-shadow: 0 6px 24px 0 color-mix(in srgb, var(--yellow) 14%, transparent);
        }

        /* Outcome stripe */
        .rh-card-stripe {
          height: 3px;
          flex-shrink: 0;
        }

        /* Card top */
        .rh-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.875rem 0.875rem 0.5rem;
        }

        .rh-card-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .rh-card-category {
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

        .rh-card-canton {
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

        .rh-outcome-badge {
          flex-shrink: 0;
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

        /* Card body */
        .rh-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 0.875rem 0.75rem;
          flex: 1;
        }

        .rh-card-date {
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .rh-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .rh-card-snippet {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Result bar */
        .rh-result {
          padding: 0.625rem 0.875rem;
          border-top: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rh-result-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .rh-result-yes { color: var(--color-pro); }
        .rh-result-no  { color: var(--color-con); }

        .rh-result-track {
          height: 6px;
          border-radius: var(--radius-full);
          background: var(--color-con-bg);
          overflow: hidden;
          position: relative;
        }

        .rh-result-fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          border-radius: var(--radius-full);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* The 50% threshold line */
        .rh-result-threshold {
          position: absolute;
          top: 0; bottom: 0;
          left: 50%;
          width: 1.5px;
          background: var(--color-surface);
          z-index: 1;
        }

        /* Card footer */
        .rh-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.875rem;
          border-top: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
        }

        .rh-card-footer-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rh-card-footer-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: var(--color-text-tertiary);
        }

        .rh-card-arrow {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
          transition: transform 0.15s ease, color 0.15s ease;
        }

        .rh-card:hover .rh-card-arrow {
          transform: translateX(3px);
          color: var(--color-text-primary);
        }

        /* ── Footnote ────────────────────────────────────────── */
        .rh-footnote {
          font-size: 0.68rem;
          color: var(--color-text-tertiary);
          text-align: center;
          margin: 0;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 640px) {
          .rh-page         { padding: 1.25rem 0.875rem 3rem; gap: 2rem; }
          .rh-stats-grid   { grid-template-columns: repeat(2, 1fr); }
          .rh-stat-card:nth-child(2) { border-right: none; }
          .rh-stat-card:nth-child(3) { border-top: 1px solid var(--color-border-subtle); }
          .rh-stat-card:nth-child(4) { border-top: 1px solid var(--color-border-subtle); }
          .rh-notable      { grid-template-columns: 1fr; }
          .rh-cards        { grid-template-columns: 1fr; }
          .rh-year-meta    { display: none; }
        }
      `}</style>
        </main>
    );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────────────────────── */

function StatCard({ value, label, accent }: { value: string | number; label: string; accent?: "pro" }) {
    return (
        <div className="rh-stat-card">
      <span className={`rh-stat-value ${accent === "pro" ? "rh-stat-value-pro" : ""}`}>
        {value}
      </span>
            <span className="rh-stat-label">{label}</span>
        </div>
    );
}

function HistoryCard({ vote }: { vote: HistoricalVote }) {
    const cfg = OUTCOME_CONFIG[vote.outcome];

    /* Stripe gradient */
    const stripeStyle =
        vote.outcome === "accepted"
            ? { background: `linear-gradient(90deg, ${cfg.bar}, color-mix(in srgb, ${cfg.bar} 60%, var(--yellow)))` }
            : { background: `linear-gradient(90deg, ${cfg.bar}, color-mix(in srgb, ${cfg.bar} 60%, transparent))` };

    return (
        <Link
            href={`/history/${vote.id}`}
            className={`rh-card ${vote.isHighProfile ? "rh-card-high-profile" : ""}`}
        >
            {/* Outcome stripe */}
            <div className="rh-card-stripe" style={stripeStyle} />

            {/* Top: category + outcome badge */}
            <div className="rh-card-top">
                <div className="rh-card-meta">
          <span className="rh-card-category">
            {CATEGORY_ICONS[vote.category]} {vote.category}
          </span>
                    {vote.canton && (
                        <span className="rh-card-canton">{vote.canton}</span>
                    )}
                </div>
                <span
                    className="rh-outcome-badge"
                    style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                >
          {cfg.label}
        </span>
            </div>

            {/* Body */}
            <div className="rh-card-body">
                <p className="rh-card-date">{formatDate(vote.voteDate)}</p>
                <p className="rh-card-title">{vote.title}</p>
                <p className="rh-card-snippet">{vote.aiSummarySnippet}</p>
            </div>

            {/* Result bar */}
            <div className="rh-result">
                <div className="rh-result-labels">
                    <span className="rh-result-yes">Yes {vote.finalYesPct}%</span>
                    <span style={{ fontSize: "0.62rem", color: "var(--color-text-tertiary)", fontWeight: 500 }}>
            Turnout {vote.turnoutPct}%
          </span>
                    <span className="rh-result-no">No {vote.finalNoPct}%</span>
                </div>
                <div className="rh-result-track">
                    <div
                        className="rh-result-fill"
                        style={{ width: `${vote.finalYesPct}%`, background: cfg.bar }}
                    />
                    <div className="rh-result-threshold" />
                </div>
            </div>

            {/* Footer */}
            <div className="rh-card-footer">
                <div className="rh-card-footer-meta">
                    {!vote.canton && (
                        <span className="rh-card-footer-item">
              🗂️ {vote.cantonYes}/{vote.cantonYes + vote.cantonNo} cantons yes
            </span>
                    )}
                    <span className="rh-card-footer-item">
            👥 {formatVoters(vote.totalVoters)} voters
          </span>
                </div>
                <span className="rh-card-arrow">→</span>
            </div>
        </Link>
    );
}

// const allVotes: HistoricalVote[] = await fetch("/api/history", {
//     next: { revalidate: 3600 }
// }).then(r => r.json());