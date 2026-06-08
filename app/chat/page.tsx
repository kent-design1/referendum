"use client";

import { useState } from "react";
import Link          from "next/link";
import Badge         from "@/components/UI_Primitives/Badge";
import {
    useChatStore,
    daysLeft,
    timeAgo,
    EXPIRY_DAYS,
} from "@/lib/useChatStore";
import type { ChatMessage, ChatThread, VoteType } from "@/lib/useChatStore";

/* ─────────────────────────────────────────────────────────────
   CONFIG
   ───────────────────────────────────────────────────────────── */
const TYPE_CFG: Record<VoteType, {
    label: string; bg: string; text: string; border: string; stripe: string;
}> = {
    "initiative":       { label: "Initiative",       bg: "var(--yellow-light)",     text: "var(--yellow-dark)",      border: "var(--yellow-mid)",          stripe: "var(--yellow)"           },
    "counter-proposal": { label: "Counter-proposal", bg: "var(--color-pro-bg)",     text: "var(--color-pro)",        border: "var(--color-pro-border)",    stripe: "var(--color-pro)"        },
    "referendum":       { label: "Referendum",        bg: "var(--background-muted)", text: "var(--color-text-muted)", border: "var(--color-border-subtle)", stripe: "var(--color-text-muted)" },
};

const SUGGESTIONS = [
    { icon: "⚡", text: "What does this proposal actually do?"  },
    { icon: "✅", text: "What are the strongest PRO arguments?" },
    { icon: "❌", text: "What are the strongest CON arguments?" },
    { icon: "💰", text: "How much will this cost taxpayers?"    },
    { icon: "⚖️", text: "Is this constitutional?"              },
    { icon: "🗓️", text: "What happens if it passes?"           },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
function lastPreview(thread: ChatThread): string {
    const last = thread.messages.at(-1);
    if (!last) return "No messages yet";
    const pre = last.role === "user" ? "You: " : "";
    const txt = last.content;
    return pre + (txt.length > 68 ? txt.slice(0, 68) + "…" : txt);
}

/* ─────────────────────────────────────────────────────────────
   TYPING DOTS
   ───────────────────────────────────────────────────────────── */
function TypingDots() {
    return (
        <span className="cp-dots">
      {[0, 1, 2].map((i) => (
          <span
              key={i}
              className="cp-dot"
              style={{ animation: `cp-bounce 1.1s ease-in-out ${i * 0.18}s infinite` }}
          />
      ))}
    </span>
    );
}

/* ─────────────────────────────────────────────────────────────
   THREAD ITEM
   ───────────────────────────────────────────────────────────── */
function ThreadItem({
                        thread,
                        active,
                        onClick,
                    }: {
    thread:  ChatThread;
    active:  boolean;
    onClick: () => void;
}) {
    const left    = daysLeft(thread.createdAt);
    const expired = left === 0;
    const urgent  = left <= 3 && !expired;
    const cfg     = TYPE_CFG[thread.type];

    return (
        <button
            onClick={onClick}
            disabled={expired}
            className={[
                "cp-thread",
                active   ? "cp-thread-active"   : "",
                expired  ? "cp-thread-expired"  : "",
            ].join(" ")}
            aria-pressed={active}
        >
            {/* Left stripe — coloured when active */}
            <span
                className="cp-thread-stripe"
                style={{ background: active ? cfg.stripe : "var(--color-border-subtle)" }}
            />

            <div className="cp-thread-body">
                {/* Top: type pill + timestamp */}
                <div className="cp-thread-top">
          <span
              className="cp-thread-type"
              style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
                    <span className="cp-thread-time">{timeAgo(thread.updatedAt)}</span>
                </div>

                {/* Title */}
                <p className={`cp-thread-title ${active ? "cp-thread-title-active" : ""}`}>
                    {thread.shortTitle}
                </p>

                {/* Last message preview */}
                <p className="cp-thread-preview">{lastPreview(thread)}</p>

                {/* Expiry bar */}
                <div className="cp-expiry-row">
                    <div className="cp-expiry-track">
                        <div
                            className="cp-expiry-fill"
                            style={{
                                width: `${(left / EXPIRY_DAYS) * 100}%`,
                                background: expired
                                    ? "var(--color-text-tertiary)"
                                    : urgent
                                        ? "var(--color-con)"
                                        : "var(--color-pro)",
                            }}
                        />
                    </div>
                    <span
                        className="cp-expiry-label"
                        style={{
                            color: expired
                                ? "var(--color-text-tertiary)"
                                : urgent
                                    ? "var(--color-con)"
                                    : "var(--color-text-muted)",
                        }}
                    >
            {expired ? "Cleared" : `${left}d left`}
          </span>
                </div>
            </div>
        </button>
    );
}

/* ─────────────────────────────────────────────────────────────
   USER BUBBLE
   ───────────────────────────────────────────────────────────── */
function UserBubble({ msg }: { msg: ChatMessage }) {
    return (
        <div className="cp-user-bubble">
            <p className="cp-user-label">You</p>
            <p className="cp-user-text">{msg.content}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ASSISTANT BUBBLE
   ───────────────────────────────────────────────────────────── */
function AssistantBubble({ msg }: { msg: ChatMessage }) {
    const [feedback, setFeedback] = useState<string | null>(null);

    return (
        <div className="cp-asst-bubble">
            <div className="cp-asst-hdr">
                <div className="cp-asst-av">
                    <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
                        <path
                            d="M4 0.5v7M0.5 4h7"
                            stroke="var(--yellow)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <span className="cp-asst-name">SmartInfo AI</span>
                {msg.confidence && (
                    <Badge label="Confidence" value={msg.confidence} variant="yellow" />
                )}
            </div>

            <p className="cp-asst-text">{msg.content}</p>

            <div className="cp-fb-row">
                {(["👍 Helpful", "👎 Not helpful", "❓ Unclear"] as const).map((lbl) => (
                    <button
                        key={lbl}
                        onClick={() => setFeedback(feedback === lbl ? null : lbl)}
                        className={`cp-fb-btn ${feedback === lbl ? "cp-fb-on" : ""}`}
                    >
                        {lbl}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   CHAT PANEL  (right column)
   ───────────────────────────────────────────────────────────── */
import { useRef, useEffect } from "react";

function ChatPanel({
                       thread,
                       onSend,
                       loading,
                   }: {
    thread:  ChatThread;
    onSend:  (threadId: string, text: string) => Promise<void>;
    loading: boolean;
}) {
    const [input,           setInput]           = useState("");
    const [showSuggestions, setShowSuggestions] = useState(
        thread.messages.length <= 1
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef  = useRef<HTMLInputElement>(null);
    const cfg       = TYPE_CFG[thread.type];
    const left      = daysLeft(thread.createdAt);

    /* Auto-scroll */
    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [thread.messages, loading]);

    /* Reset when active thread changes */
    useEffect(() => {
        setShowSuggestions(thread.messages.length <= 1);
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 80);
    }, [thread.id, thread.messages.length]);

    async function send(text: string) {
        if (!text.trim() || loading) return;
        setShowSuggestions(false);
        setInput("");
        await onSend(thread.id, text);
    }


    const canSend = !loading && input.trim().length > 0;

    return (
        <div className="cp-chat-panel">

            {/* Panel header */}
            <div className="cp-chat-hdr">
                <div className="cp-chat-hdr-left">
                    <div className="cp-chat-av">
                        <svg width="10" height="10" viewBox="0 0 8 8" fill="none">
                            <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div className="cp-chat-title-row">
                            <p className="cp-chat-title">{thread.shortTitle}</p>
                            <span
                                className="cp-chat-type-pill"
                                style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                            >
                {cfg.label}
              </span>
                        </div>
                        <p className="cp-chat-sub">
                            Vote date: {thread.voteDate} &nbsp;·&nbsp; {thread.messages.length} messages
                        </p>
                    </div>
                </div>

                <div className="cp-chat-hdr-right">
                    {left <= 3 && left > 0 && (
                        <span className="cp-chat-urgent">⚠ {left}d until cleared</span>
                    )}
                    {left > 3 && (
                        <span className="cp-chat-expiry-info">{left}d left</span>
                    )}
                    {left === 0 && (
                        <span className="cp-chat-cleared">Cleared</span>
                    )}
                </div>
            </div>

            {/* Message scroll area */}
            <div ref={scrollRef} className="cp-scroll">

                {/* Thread start marker */}
                <div className="cp-start-marker">
                    <span className="cp-start-line" />
                    <span className="cp-start-label">
            Started {timeAgo(thread.createdAt)} · auto-clears after {EXPIRY_DAYS} days
          </span>
                    <span className="cp-start-line" />
                </div>

                {thread.messages.map((m) =>
                    m.role === "user"
                        ? <UserBubble      key={m.id} msg={m} />
                        : <AssistantBubble key={m.id} msg={m} />
                )}

                {loading && (
                    <div className="cp-thinking">
                        <div className="cp-thinking-av">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <TypingDots />
                        <span className="cp-thinking-lbl">Thinking…</span>
                    </div>
                )}
            </div>

            {/* Suggestion chips */}
            {showSuggestions && (
                <div className="cp-suggestions">
                    <p className="cp-sugg-label">
                        Suggested questions for this {thread.type}
                    </p>
                    <div className="cp-sugg-grid">
                        {SUGGESTIONS.map(({ icon, text }) => (
                            <button
                                key={text}
                                className="cp-sugg-btn"
                                onClick={() => send(text)}
                            >
                                <span className="cp-sugg-icon">{icon}</span>
                                <span className="cp-sugg-text">{text}</span>
                                <svg
                                    className="cp-sugg-arrow"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                >
                                    <path
                                        d="M2 5h6M5.5 2l3 3-3 3"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="cp-input-area">
                <div className="cp-input-shell">
                    <input
                        ref={inputRef}
                        className="cp-input"
                        placeholder={`Ask about ${thread.shortTitle}…`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                        disabled={loading || daysLeft(thread.createdAt) === 0}
                        aria-label="Chat input"
                    />
                    <button
                        className={`cp-send ${canSend ? "cp-send-on" : ""}`}
                        onClick={() => send(input)}
                        disabled={!canSend}
                        aria-label="Send message"
                    >
                        {loading
                            ? <span className="cp-spinner" />
                            : (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M1 7h12M7.5 2l5.5 5-5.5 5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )
                        }
                    </button>
                </div>
                <p className="cp-disclaimer">
                   This is a Mock Up
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   EMPTY STATE
   ───────────────────────────────────────────────────────────── */
function EmptyState({ onBrowse }: { onBrowse: () => void }) {
    return (
        <div className="cp-empty">
            <div className="cp-empty-icon">
                <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
                    <rect width="22" height="22" rx="6" fill="var(--yellow)" />
                    <rect x="10" y="4"  width="2.2" height="14" rx="1" fill="var(--yellow-ink)" />
                    <rect x="4"  y="10" width="14"  height="2.2" rx="1" fill="var(--yellow-ink)" />
                </svg>
            </div>
            <h2 className="cp-empty-title">Select a referendum to start chatting</h2>
            <p className="cp-empty-body">
                Choose one of the active votes from the left panel. Your conversation
                history is kept for {EXPIRY_DAYS} days, then automatically cleared to
                protect your privacy.
            </p>
            <button className="cp-empty-btn" onClick={onBrowse}>
                Browse referendums
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
   ───────────────────────────────────────────────────────────── */
export default function ChatPage() {
    const { threads, activeId, activeThread, setActiveId, sendMessage, loading, ready } = useChatStore();

    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!ready) return null;

    /* Sort: active-first, then recency; expired float to bottom */
    const sorted = [...threads].sort((a, b) => {
        const aExp = daysLeft(a.createdAt) === 0;
        const bExp = daysLeft(b.createdAt) === 0;
        if (aExp !== bExp) return aExp ? 1 : -1;
        return b.updatedAt - a.updatedAt;
    });

    return (
        <div className="cp-root">

            {/* ── LEFT SIDEBAR ──────────────────────────────── */}
            <aside className={`cp-sidebar ${sidebarOpen ? "cp-sidebar-open" : "cp-sidebar-closed"}`}>

                {/* Header */}
                <div className="cp-sidebar-hdr">
                    <div>
                        <p className="cp-sidebar-eyebrow">SmartInfo AI</p>
                        <p className="cp-sidebar-title">Chat history</p>
                    </div>
                    <Link href="/" className="cp-sidebar-back" title="Back to overview">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M8 2L3 6.5 8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                {/* Expiry notice */}
                <div className="cp-expiry-notice">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5.5 4v3M5.5 8v.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Conversations clear after {EXPIRY_DAYS} days
                </div>

                {/* Thread list */}
                <div className="cp-thread-list">
                    {sorted.map((t) => (
                        <ThreadItem
                            key={t.id}
                            thread={t}
                            active={t.id === activeId}
                            onClick={() => {
                                setActiveId(t.id);
                                setSidebarOpen(false);
                            }}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="cp-sidebar-footer">
                    <div className="cp-legend">
            <span className="cp-legend-item">
              <span className="cp-legend-dot" style={{ background: "var(--color-pro)" }} />
              Fresh
            </span>
                        <span className="cp-legend-item">
              <span className="cp-legend-dot" style={{ background: "var(--color-con)" }} />
              Expiring soon
            </span>
                        <span className="cp-legend-item">
              <span className="cp-legend-dot" style={{ background: "var(--color-text-tertiary)" }} />
              Cleared
            </span>
                    </div>
                </div>
            </aside>

            {/* ── MOBILE TOGGLE ─────────────────────────────── */}
            <button
                className="cp-mobile-toggle"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label={sidebarOpen ? "Close vote list" : "Open vote list"}
            >
                {sidebarOpen
                    ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                }
                {!sidebarOpen && <span>All votes</span>}
            </button>

            {/* ── MAIN PANEL ────────────────────────────────── */}
            <main className="cp-main">
                {activeThread
                    ? <ChatPanel thread={activeThread} onSend={sendMessage} loading={loading} />
                    : <EmptyState onBrowse={() => setSidebarOpen(true)} />
                }
            </main>

            {/* ── ALL STYLES ────────────────────────────────── */}
            <style>{`

        /* Root */
        .cp-root {
          display: flex;
          height: calc(100dvh - 108px);
          overflow: hidden;
          background: var(--background);
          position: relative;
        }

        /* ── SIDEBAR ──────────────────────────────────── */
        .cp-sidebar {
          width: 288px; flex-shrink: 0;
          display: flex; flex-direction: column;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          overflow: hidden;
          transition: width 0.22s ease;
        }

        .cp-sidebar-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1rem 0.75rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          flex-shrink: 0;
        }

        .cp-sidebar-eyebrow {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-muted); margin: 0;
        }

        .cp-sidebar-title {
          font-size: 0.9rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--color-text-primary); margin: 2px 0 0;
        }

        .cp-sidebar-back {
          width: 28px; height: 28px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle); background: none;
          display: grid; place-items: center;
          color: var(--color-text-muted); text-decoration: none;
          transition: all 0.12s ease;
        }

        .cp-sidebar-back:hover {
          background: var(--yellow-light); border-color: var(--yellow-mid);
          color: var(--yellow-dark);
        }

        .cp-expiry-notice {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          font-size: 0.62rem; color: var(--color-text-muted);
          background: var(--yellow-light);
          border-bottom: 1px solid var(--yellow-mid);
          flex-shrink: 0;
        }

        .cp-thread-list {
          flex: 1; overflow-y: auto;
          padding: 6px; display: flex; flex-direction: column; gap: 3px;
        }

        .cp-thread-list::-webkit-scrollbar       { width: 3px; }
        .cp-thread-list::-webkit-scrollbar-track { background: transparent; }
        .cp-thread-list::-webkit-scrollbar-thumb {
          background: var(--color-border); border-radius: var(--radius-full);
        }

        /* Thread item */
        .cp-thread {
          display: flex; align-items: stretch;
          width: 100%; text-align: left;
          background: none; border: 1px solid transparent;
          border-radius: var(--radius-md); cursor: pointer; padding: 0;
          overflow: hidden; transition: all 0.13s ease;
          margin-bottom: 2px;
        }

        .cp-thread:last-child { margin-bottom: 0; }

        .cp-thread:hover:not(.cp-thread-active):not(.cp-thread-expired) {
          background: var(--color-surface-raised);
          border-color: var(--color-border-subtle);
        }

        .cp-thread-active {
          background: var(--yellow-light) !important;
          border-color: var(--yellow-mid) !important;
          box-shadow: 0 1px 6px color-mix(in srgb, var(--yellow) 15%, transparent);
        }

        .cp-thread-expired { opacity: 0.4; cursor: not-allowed; }

        .cp-thread-stripe {
          width: 3px; flex-shrink: 0; align-self: stretch;
          border-radius: 2px 0 0 2px;
          transition: background 0.13s ease;
        }

        .cp-thread-body {
          flex: 1; min-width: 0;
          padding: 9px 10px;
          display: flex; flex-direction: column; gap: 3px;
        }

        .cp-thread-top {
          display: flex; align-items: center;
          justify-content: space-between; gap: 4px;
        }

        .cp-thread-type {
          display: inline-flex; align-items: center;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid;
        }

        .cp-thread-time {
          font-size: 0.58rem; color: var(--color-text-tertiary); white-space: nowrap;
        }

        .cp-thread-title {
          font-size: 0.78rem; font-weight: 700; color: var(--color-text-primary);
          letter-spacing: -0.01em; line-height: 1.2; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.12s ease;
        }

        .cp-thread-title-active { color: var(--yellow-ink); }

        .cp-thread-preview {
          font-size: 0.68rem; color: var(--color-text-muted);
          line-height: 1.35; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .cp-expiry-row {
          display: flex; align-items: center; gap: 6px; margin-top: 3px;
        }

        .cp-expiry-track {
          flex: 1; height: 3px; border-radius: var(--radius-full);
          background: var(--background-muted); overflow: hidden;
        }

        .cp-expiry-fill {
          height: 100%; border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .cp-expiry-label {
          font-size: 0.55rem; font-weight: 700; white-space: nowrap;
        }

        /* Sidebar footer */
        .cp-sidebar-footer {
          padding: 8px 12px;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          flex-shrink: 0;
        }

        .cp-legend {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.6rem; color: var(--color-text-muted);
        }

        .cp-legend-item { display: flex; align-items: center; gap: 4px; }

        .cp-legend-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* ── MOBILE TOGGLE ──────────────────────────────── */
        .cp-mobile-toggle {
          display: none;
          position: absolute; top: 12px; left: 12px; z-index: 20;
          padding: 5px 10px; border-radius: var(--radius-md);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          font-size: 0.72rem; font-weight: 600;
          color: var(--color-text-muted); cursor: pointer;
          gap: 5px; align-items: center;
          transition: all 0.12s ease;
        }

        .cp-mobile-toggle:hover {
          background: var(--yellow-light); border-color: var(--yellow-mid);
          color: var(--yellow-dark);
        }

        @media (max-width: 768px) {
          .cp-mobile-toggle { display: flex; }
          .cp-sidebar {
            position: absolute; top: 0; left: 0; bottom: 0; z-index: 10;
            box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          }
          .cp-sidebar-closed { width: 0; }
          .cp-sidebar-open   { width: 288px; }
        }

        /* ── MAIN ─────────────────────────────────────── */
        .cp-main {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
          overflow: hidden; background: var(--background);
        }

        /* ── CHAT PANEL ───────────────────────────────── */
        .cp-chat-panel {
          display: flex; flex-direction: column;
          height: 100%; overflow: hidden;
        }

        .cp-chat-hdr {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; padding: 0.875rem 1.25rem 0.75rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface); flex-shrink: 0;
        }

        .cp-chat-hdr-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .cp-chat-hdr-right { flex-shrink: 0; }

        .cp-chat-av {
          width: 32px; height: 32px; border-radius: var(--radius-md);
          background: var(--color-accent);
          display: grid; place-items: center; flex-shrink: 0;
        }

        .cp-chat-title-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

        .cp-chat-title {
          font-size: 0.9rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--color-text-primary); margin: 0;
        }

        .cp-chat-type-pill {
          display: inline-flex; align-items: center;
          padding: 2px 7px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid;
        }

        .cp-chat-sub { font-size: 0.65rem; color: var(--color-text-muted); margin: 2px 0 0; }

        .cp-chat-urgent      { font-size: 0.68rem; font-weight: 600; color: var(--color-con); }
        .cp-chat-expiry-info { font-size: 0.68rem; font-weight: 500; color: var(--color-text-muted); }
        .cp-chat-cleared     { font-size: 0.68rem; font-weight: 600; color: var(--color-text-tertiary); }

        /* Scroll */
        .cp-scroll {
          flex: 1; overflow-y: auto;
          padding: 1.25rem;
          display: flex; flex-direction: column; gap: 10px;
          background: var(--color-surface-raised);
          scroll-behavior: smooth;
        }

        .cp-scroll::-webkit-scrollbar       { width: 4px; }
        .cp-scroll::-webkit-scrollbar-track { background: transparent; }
        .cp-scroll::-webkit-scrollbar-thumb {
          background: var(--color-border); border-radius: var(--radius-full);
        }

        /* Start marker */
        .cp-start-marker {
          display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
        }
        .cp-start-line  { flex: 1; height: 1px; background: var(--color-border-subtle); }
        .cp-start-label { font-size: 0.6rem; font-weight: 500; color: var(--color-text-tertiary); white-space: nowrap; }

        /* Thinking */
        .cp-thinking {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; width: fit-content;
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); border-bottom-left-radius: 3px;
        }

        .cp-thinking-av {
          width: 20px; height: 20px; border-radius: var(--radius-sm);
          background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0;
        }

        .cp-thinking-lbl { font-size: 0.68rem; color: var(--color-text-tertiary); }

        .cp-dots { display: flex; gap: 3px; align-items: center; }
        .cp-dot  { width: 5px; height: 5px; border-radius: 50%; background: var(--yellow); display: inline-block; }

        @keyframes cp-bounce {
          0%,80%,100% { transform: translateY(0);    opacity: 0.35; }
          40%          { transform: translateY(-4px); opacity: 1; }
        }

        /* Bubbles */
        .cp-user-bubble {
          align-self: flex-end; max-width: 72%;
          background: var(--color-accent); color: #fff;
          border-radius: var(--radius-lg); border-bottom-right-radius: 4px;
          padding: 10px 14px;
        }

        .cp-user-label {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; opacity: 0.4; margin: 0 0 4px; color: #FFFAFA
        }

        .cp-user-text { font-size: 0.84rem; margin: 0; line-height: 1.55; color: #ffff }

        .cp-asst-bubble {
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-lg); border-bottom-left-radius: 4px;
          padding: 10px 14px; max-width: 82%;
          display: flex; flex-direction: column; gap: 7px;
        }

        .cp-asst-hdr  { display: flex; align-items: center; gap: 7px; }
        .cp-asst-av   { width: 22px; height: 22px; border-radius: var(--radius-sm); background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0; }
        .cp-asst-name { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--color-text-muted); flex: 1; }
        .cp-asst-text { font-size: 0.84rem; color: var(--color-text-secondary); margin: 0; line-height: 1.65; }

        .cp-fb-row { display: flex; flex-wrap: wrap; gap: 4px; }
        .cp-fb-btn {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 9px; border-radius: var(--radius-full);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          font-size: 0.66rem; font-weight: 500; color: var(--color-text-muted);
          cursor: pointer; transition: all 0.11s ease;
        }
        .cp-fb-btn:hover, .cp-fb-on {
          background: var(--yellow-light); border-color: var(--yellow-mid); color: var(--yellow-dark);
        }
        .cp-fb-on { border-color: var(--yellow) !important; font-weight: 700; }

        /* Suggestions */
        .cp-suggestions {
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
          padding: 0.875rem 1.25rem; flex-shrink: 0;
        }

        .cp-sugg-label {
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); margin: 0 0 8px;
        }

        .cp-sugg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }

        .cp-sugg-btn {
          display: flex; align-items: flex-start; gap: 5px;
          padding: 7px 9px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          cursor: pointer; text-align: left; transition: all 0.12s ease;
        }

        .cp-sugg-btn:hover {
          background: var(--yellow-light); border-color: var(--yellow-mid);
          transform: translateY(-1px);
        }

        .cp-sugg-icon  { font-size: 0.78rem; flex-shrink: 0; line-height: 1.5; }
        .cp-sugg-text  { font-size: 0.68rem; color: var(--color-text-secondary); line-height: 1.4; flex: 1; }
        .cp-sugg-arrow { flex-shrink: 0; color: var(--color-text-tertiary); opacity: 0; transform: translateX(-3px); transition: all 0.12s; margin-top: 3px; }
        .cp-sugg-btn:hover .cp-sugg-text  { color: var(--yellow-ink); }
        .cp-sugg-btn:hover .cp-sugg-arrow { opacity: 1; transform: translateX(0); }

        /* Input */
        .cp-input-area {
          padding: 0.875rem 1.25rem 0.75rem;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface); flex-shrink: 0;
        }

        .cp-input-shell {
          display: flex; gap: 8px; align-items: center;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 6px 6px 6px 14px;
          transition: border-color 0.14s, box-shadow 0.14s;
        }

        .cp-input-shell:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        .cp-input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 0.875rem; color: var(--color-text-primary);
          padding: 4px 0; min-width: 0;
        }

        .cp-input::placeholder { color: var(--color-text-tertiary); }
        .cp-input:disabled     { opacity: 0.5; cursor: not-allowed; }

        .cp-send {
          width: 34px; height: 34px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--background-muted); color: var(--color-text-tertiary);
          display: grid; place-items: center; flex-shrink: 0;
          cursor: not-allowed; transition: all 0.14s ease;
        }

        .cp-send-on {
          background: var(--yellow);
          border-color: color-mix(in srgb, var(--yellow) 70%, transparent);
          color: var(--yellow-ink); cursor: pointer;
        }

        .cp-send-on:hover {
          background: var(--yellow-dark); border-color: var(--yellow-dark);
          color: #fff; transform: translateY(-1px);
          box-shadow: 0 3px 10px color-mix(in srgb, var(--yellow) 30%, transparent);
        }

        .cp-spinner {
          width: 13px; height: 13px; display: block;
          border: 1.5px solid var(--yellow-mid); border-top-color: var(--yellow-dark);
          border-radius: 50%; animation: cp-spin 0.7s linear infinite;
        }

        @keyframes cp-spin { to { transform: rotate(360deg); } }

        .cp-disclaimer {
          font-size: 0.62rem; color: var(--color-text-tertiary);
          text-align: center; margin: 6px 0 0; line-height: 1.4;
        }

        /* ── EMPTY STATE ──────────────────────────────── */
        .cp-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 2rem; text-align: center;
        }

        .cp-empty-icon {
          width: 56px; height: 56px; border-radius: var(--radius-lg);
          background: var(--yellow-light); border: 1px solid var(--yellow-mid);
          display: grid; place-items: center;
        }

        .cp-empty-title {
          font-size: 1rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--color-text-primary); margin: 0;
        }

        .cp-empty-body {
          font-size: 0.82rem; color: var(--color-text-muted);
          line-height: 1.65; max-width: 380px; margin: 0;
        }

        .cp-empty-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.625rem 1.25rem; border-radius: var(--radius-md);
          background: var(--yellow); color: var(--yellow-ink);
          border: none; font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: all 0.14s ease;
        }

        .cp-empty-btn:hover {
          background: var(--yellow-dark); color: #fff; transform: translateY(-1px);
          box-shadow: 0 4px 14px color-mix(in srgb, var(--yellow) 30%, transparent);
        }

        @media (max-width: 640px) {
          .cp-sugg-grid  { grid-template-columns: 1fr 1fr; }
          .cp-input-area { padding: 0.75rem 1rem; }
          .cp-scroll     { padding: 1rem; }
          .cp-chat-hdr   { padding: 0.75rem 1rem; }
        }
      `}</style>
        </div>
    );
}