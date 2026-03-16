import VoteBanner from "@/components/Referendum/VoteBanner";
import PreferencesPanel from "@/components/Referendum/PreferencesPanel";
import QuickTake from "@/components/Referendum/QuickTake";
import FactsCard from "@/components/Referendum/FactsCard";
import WhatChangesCard from "@/components/Referendum/WhatChangesCard";
import {
  currentReferendum,
  userPreferences,
  arguments_,
  facts,
} from "@/constants";

export default function ReferendumCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Main card ─────────────────────────────────── */}
      <div className="card">
        <VoteBanner referendum={currentReferendum} />

        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Question */}
          <div
            className="surface-yellow"
            style={{ padding: "1rem 1.25rem" }}
          >
            <p style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--yellow-ink)",
              margin: "0 0 7px",
              opacity: 0.7,
            }}>
              Question on the ballot
            </p>
            <p style={{
              fontSize: "0.92rem",
              color: "var(--yellow-ink)",
              margin: 0,
              lineHeight: 1.6,
              fontWeight: 500,
            }}>
              {currentReferendum.question}
            </p>
          </div>

          {/* Preferences + Quick take */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}>
            <PreferencesPanel preferences={userPreferences} />
            <QuickTake arguments_={arguments_} />
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "9px 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--yellow)",
            flexShrink: 0,
            display: "inline-block",
          }} />
          <p style={{ fontSize: "0.7rem", color: "var(--foreground-4)", margin: 0 }}>
            HCI/XAI goal: clear outputs · interpretable reasoning · explicit knowledge limits · fairness &amp; bias mitigation · user feedback loops
          </p>
        </div>
      </div>

      {/* ── Facts + What changes ───────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "12px",
      }}>
        <FactsCard facts={facts} />
        <WhatChangesCard />
      </div>

      {/* Mock disclaimer */}
      <p style={{ fontSize: "0.7rem", color: "var(--foreground-4)", margin: 0 }}>
        Mockup display — all data is placeholder only.
      </p>
    </div>
  );
}
