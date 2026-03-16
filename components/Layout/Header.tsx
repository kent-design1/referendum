"use client";

import { useState } from "react";
import { navLinks, languages, tabs } from "@/constants";
import type { TabId } from "@/lib/types";

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [activeLang, setActiveLang]       = useState("EN");
  const [mobileMenuOpen, setMobileMenu]   = useState(false);
  const [activeNav, setActiveNav]         = useState("Home");

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb, var(--background) 85%, transparent)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }}>

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="page-container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        paddingTop: "13px",
        paddingBottom: "13px",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px", flexShrink: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "var(--radius-md)",
            background: "var(--foreground)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="var(--yellow)" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>
              Swiss Referendum Info
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--foreground-4)", marginTop: "1px" }}>
              smartinfo · mock interface
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center" }}
             className="hidden md:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              className="nav-link"
              style={{
                background: "none",
                border: "none",
                color: activeNav === link ? "var(--foreground)" : "var(--foreground-3)",
                fontWeight: activeNav === link ? 600 : 500,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {link}
              {activeNav === link && (
                <span style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "16px",
                  height: "2px",
                  borderRadius: "2px",
                  background: "var(--yellow)",
                }}/>
              )}
            </button>
          ))}
        </nav>

        {/* Right side: language + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>

          {/* Language switcher */}
          <div style={{
            display: "flex",
            background: "var(--background-muted)",
            borderRadius: "var(--radius-md)",
            padding: "3px",
            gap: "2px",
            border: "1px solid var(--border)",
          }}>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                style={{
                  padding: "4px 8px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: activeLang === lang ? "var(--yellow)" : "transparent",
                  color:      activeLang === lang ? "var(--yellow-ink)" : "var(--foreground-3)",
                  letterSpacing: "0.03em",
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "7px",
              cursor: "pointer",
              color: "var(--foreground-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mobileMenuOpen ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l11 11M13 2L2 13"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 4h11M2 7.5h11M2 11h11"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile nav dropdown ──────────────────────────── */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "12px 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }} className="md:hidden">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => { setActiveNav(link); setMobileMenu(false); }}
              style={{
                textAlign: "left",
                padding: "9px 12px",
                fontSize: "0.85rem",
                fontWeight: activeNav === link ? 600 : 400,
                color: activeNav === link ? "var(--foreground)" : "var(--foreground-2)",
                background: activeNav === link ? "var(--yellow-light)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                borderLeft: activeNav === link ? "2px solid var(--yellow)" : "2px solid transparent",
                transition: "all 0.12s ease",
              }}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="page-container" style={{ paddingBottom: "11px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={activeTab === tab.id ? "tab tab-active" : "tab"}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
