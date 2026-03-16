"use client";

import { useState } from "react";
import ProgressBar from "@/components/UI_Primitives/ProgressBar";
import Button from "@/components/UI_Primitives/Button";
import type { Preference } from "@/lib/types";

interface PreferencesPanelProps {
  preferences: Preference[];
}

export default function PreferencesPanel({ preferences }: PreferencesPanelProps) {
  const [prefs, setPrefs] = useState(preferences);

  function nudge(label: string, delta: number) {
    setPrefs((prev) =>
      prev.map((p) =>
        p.label === label
          ? { ...p, value: Math.min(100, Math.max(0, p.value + delta)) }
          : p
      )
    );
  }

  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <div>
          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
            Your priorities
          </p>
          <p style={{ fontSize: "0.7rem", color: "var(--foreground-4)", margin: "2px 0 0" }}>
            Drag or use + / − to adjust
          </p>
        </div>
        <button
          onClick={() => setPrefs(preferences)}
          style={{
            fontSize: "0.7rem",
            color: "var(--yellow-dark)",
            fontWeight: 500,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 6px",
          }}
        >
          Reset
        </button>
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {prefs.map((pref) => (
          <div key={pref.label}>
            <ProgressBar
              label={pref.label}
              value={pref.value}
              variant="yellow"
            />
            {/* +/– nudge buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px", marginTop: "5px" }}>
              {([-10, +10] as const).map((delta) => (
                <button
                  key={delta}
                  onClick={() => nudge(pref.label, delta)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-strong)",
                    background: "var(--background-muted)",
                    color: "var(--foreground-3)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    lineHeight: 1,
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--yellow-light)";
                    e.currentTarget.style.borderColor = "var(--yellow)";
                    e.currentTarget.style.color = "var(--yellow-ink)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--background-muted)";
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                    e.currentTarget.style.color = "var(--foreground-3)";
                  }}
                >
                  {delta > 0 ? "+" : "−"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "6px",
        marginTop: "16px",
        paddingTop: "14px",
        borderTop: "1px solid var(--border)",
      }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => nudge("Environment", 20)}
          style={{ fontSize: "0.72rem" }}
        >
          + Environment
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => nudge("Economic stability", 20)}
          style={{ fontSize: "0.72rem" }}
        >
          + Economy
        </Button>
      </div>
    </div>
  );
}
