"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader } from "@/components/UI_Primitives/Card";
import Badge from "@/components/UI_Primitives/Badge";
import { initialMessages, sources } from "@/constants";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "What does this proposal actually do?",
  "What are the strongest PRO arguments?",
  "What are the strongest CON arguments?",
  "How much will this cost taxpayers?",
];

export default function ChatAssistant() {
  const [messages, setMessages]   = useState<ChatMessage[]>(initialMessages);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setShowSuggestions(false);
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: "user", content: trimmed },
    ]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content:
            "This is a mock response. In production this would call your AI backend with full referendum context, user preferences, and sourced factual grounding.",
          confidence: "Medium",
        },
      ]);
      setLoading(false);
    }, 950);
  }

  return (
    <Card>
      <CardHeader
        title="AI Chat Assistant"
        subtitle="Ask about the referendum"
        action={
          <span style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--success)",
            display: "inline-block",
            boxShadow: "0 0 0 2px var(--success-bg)",
          }} />
        }
      />

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* ── Message thread ───────────────────────────── */}
        <div
          ref={scrollRef}
          style={{
            height: 340,
            overflowY: "auto",
            background: "var(--background-subtle)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((msg) =>
            msg.role === "user"
              ? <UserBubble key={msg.id} message={msg} />
              : <AssistantBubble key={msg.id} message={msg} />
          )}

          {/* Typing indicator */}
          {loading && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              borderBottomLeftRadius: 4,
              width: "fit-content",
            }}>
              <TypingDots />
              <span style={{ fontSize: "0.75rem", color: "var(--foreground-4)" }}>Thinking…</span>
            </div>
          )}
        </div>

        {/* ── Suggested questions ──────────────────────── */}
        {showSuggestions && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <p className="text-label" style={{ marginBottom: "4px" }}>Suggested questions</p>
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: "0.78rem",
                  color: "var(--foreground-2)",
                  background: "var(--background-subtle)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all 0.12s ease",
                  lineHeight: 1.45,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--yellow-light)";
                  e.currentTarget.style.borderColor = "var(--yellow-mid)";
                  e.currentTarget.style.color = "var(--yellow-ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--background-subtle)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--foreground-2)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* ── Input row ────────────────────────────────── */}
        <div style={{ display: "flex", gap: "7px" }}>
          <input
            className="input"
            placeholder="Ask about this referendum…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="btn btn-yellow"
            style={{
              flexShrink: 0,
              opacity: loading || !input.trim() ? 0.45 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "0.7rem", color: "var(--foreground-4)", margin: 0, lineHeight: 1.55 }}>
          Supports informed decision-making with transparent explanations and feedback mechanisms.
        </p>
      </div>
    </Card>
  );
}

/* ── Typing animation ─────────────────────────────────── */
function TypingDots() {
  return (
    <span style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--yellow)",
            display: "inline-block",
            animation: `typingBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

/* ── User bubble ──────────────────────────────────────── */
function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div style={{
      alignSelf: "flex-end",
      maxWidth: "88%",
      background: "var(--foreground)",
      color: "var(--background)",
      borderRadius: "var(--radius-lg)",
      borderBottomRightRadius: 4,
      padding: "10px 14px",
    }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.45, margin: "0 0 4px" }}>You</p>
      <p style={{ fontSize: "0.85rem", margin: 0, lineHeight: 1.55 }}>{message.content}</p>
    </div>
  );
}

/* ── Assistant bubble ─────────────────────────────────── */
function AssistantBubble({ message }: { message: ChatMessage }) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const citedSources = sources.filter((s) => message.sources?.includes(s.id));

  return (
    <div style={{
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      borderBottomLeftRadius: 4,
      padding: "10px 14px",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "7px" }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: "var(--radius-sm)",
          background: "var(--foreground)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--foreground-4)" }}>
          Assistant
        </span>
        {message.confidence && (
          <Badge label="Confidence" value={message.confidence} variant="yellow" />
        )}
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--foreground-2)", margin: 0, lineHeight: 1.62 }}>
        {message.content}
      </p>

      {/* Feedback buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
        {(["👍 Agree", "👎 Disagree", "❓ Confused"] as const).map((label) => (
          <button
            key={label}
            onClick={() => setFeedback(label)}
            className="btn btn-outline btn-sm"
            style={{
              background: feedback === label ? "var(--yellow-light)" : undefined,
              borderColor: feedback === label ? "var(--yellow)" : undefined,
              color: feedback === label ? "var(--yellow-ink)" : undefined,
              fontSize: "0.72rem",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sources */}
      {citedSources.length > 0 && (
        <div style={{
          background: "var(--background-muted)",
          borderRadius: "var(--radius-md)",
          padding: "9px 11px",
          marginTop: "10px",
        }}>
          <p className="text-label" style={{ marginBottom: "6px" }}>Sources cited</p>
          {citedSources.map((s) => (
            <p key={s.id} style={{ fontSize: "0.78rem", color: "var(--foreground-2)", margin: "3px 0" }}>
              <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>{s.id}</strong>{" "}
              {s.title}
            </p>
          ))}
        </div>
      )}

      {/* Knowledge limits */}
      {message.knowledgeLimits && message.knowledgeLimits.length > 0 && (
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "9px 11px",
          marginTop: "8px",
        }}>
          <p className="text-label" style={{ marginBottom: "6px" }}>Knowledge limits</p>
          <ul style={{ margin: 0, paddingLeft: "1rem" }}>
            {message.knowledgeLimits.map((l, i) => (
              <li key={i} style={{ fontSize: "0.78rem", color: "var(--foreground-3)", marginBottom: 2, lineHeight: 1.5 }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
