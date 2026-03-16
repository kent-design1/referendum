"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/UI_Primitives/Card";
import { deliberationStats } from "@/constants";

const FEEDBACK_ITEMS = [
  { key: "agree",    emoji: "👍", label: "Agree"    },
  { key: "disagree", emoji: "👎", label: "Disagree" },
  { key: "confused", emoji: "❓", label: "Confused"  },
] as const;

const STAT_BARS = [
  { label: "Respectful debate",   value: deliberationStats.respectfulDebate, accent: false },
  { label: "Sources cited",       value: deliberationStats.sourcesCited,     accent: true  },
  { label: "New participants",    value: 61,                                  accent: false },
  { label: "Avg. reading time",   value: 74,                                  accent: false },
];

export default function DeliberationInsights() {
  const [feedback, setFeedback] = useState(deliberationStats.feedback);
  const [animated, setAnimated] = useState(false);

  // Trigger bar animation on first render
  if (!animated) setTimeout(() => setAnimated(true), 80);

  function bump(key: "agree" | "disagree" | "confused") {
    setFeedback((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  }

  return (
    <Card>
      <CardHeader title="Deliberation Insights" subtitle="Quality signals (mock)" />
      <CardBody className="flex flex-col gap-4" >

        {/* ── Stat bars ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {STAT_BARS.map((stat) => (
            <div key={stat.label}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-3)" }}>
                  {stat.label}
                </span>
                <span style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: stat.accent ? "var(--yellow-dark)" : "var(--foreground)",
                }}>
                  {stat.value}%
                </span>
              </div>
              {/* Track */}
              <div style={{
                height: 6,
                background: "var(--background-muted)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  borderRadius: "var(--radius-full)",
                  background: stat.accent
                    ? "linear-gradient(90deg, var(--yellow-mid), var(--yellow))"
                    : "var(--foreground-2)",
                  width: animated ? `${stat.value}%` : "0%",
                  transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────── */}
        <div style={{ height: 1, background: "var(--border)" }} />

        {/* ── Session feedback ─────────────────────────── */}
        <div>
          <p className="text-label" style={{ marginBottom: "10px" }}>Session feedback</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {FEEDBACK_ITEMS.map(({ key, emoji, label }) => {
              const count = feedback[key];
              const total = feedback.agree + feedback.disagree + feedback.confused;
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <button
                  key={key}
                  onClick={() => bump(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    background: count > 0 && key === "agree"
                      ? "var(--yellow-light)"
                      : "var(--background-subtle)",
                    border: `1px solid ${count > 0 && key === "agree" ? "color-mix(in srgb, var(--yellow) 35%, transparent)" : "var(--border)"}`,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!(count > 0 && key === "agree")) {
                      e.currentTarget.style.background = "var(--background-muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(count > 0 && key === "agree")) {
                      e.currentTarget.style.background = "var(--background-subtle)";
                    }
                  }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{emoji}</span>
                  <span style={{
                    fontSize: "0.8rem",
                    color: "var(--foreground-2)",
                    fontWeight: 500,
                    flex: 1,
                  }}>
                    {label}
                  </span>
                  {/* Count pill */}
                  <span style={{
                    background: count > 0 ? "var(--yellow)" : "var(--background-muted)",
                    color: count > 0 ? "var(--yellow-ink)" : "var(--foreground-4)",
                    borderRadius: "var(--radius-full)",
                    padding: "1px 8px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    minWidth: 22,
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}>
                    {count}
                  </span>
                  {/* Mini pct bar */}
                  {total > 0 && (
                    <div style={{
                      width: 40,
                      height: 4,
                      background: "var(--background-muted)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--yellow)",
                        borderRadius: "var(--radius-full)",
                        transition: "width 0.3s ease",
                      }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
