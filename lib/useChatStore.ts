"use client";

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
export type VoteType = "initiative" | "referendum" | "counter-proposal";

export interface ChatMessage {
    id:          string;
    role:        "user" | "assistant";
    content:     string;
    confidence?: string;
    error?:      boolean;
}

export interface ChatThread {
    id:         string;
    title:      string;
    shortTitle: string;
    type:       VoteType;
    voteDate:   string;
    messages:   ChatMessage[];
    createdAt:  number;
    updatedAt:  number;
}

/* ─────────────────────────────────────────────────────────────
   SEED DATA — replace with API fetch later
   ───────────────────────────────────────────────────────────── */
const DAY = 86_400_000;
const NOW = Date.now();

export const SEED_THREADS: ChatThread[] = [
    {
        id:         "fed-2025-06-01",
        title:      "Initiative for a Federal Climate Investment Fund",
        shortTitle: "Climate Fund",
        type:       "initiative",
        voteDate:   "9 Jun 2025",
        createdAt:  NOW - 3 * DAY,
        updatedAt:  NOW - 2 * DAY,
        messages: [{
            id:         "s1-1",
            role:       "assistant",
            content:    "Hello! I can help you understand the Climate Fund initiative. What would you like to know?",
            confidence: "High",
        }],
    },
    {
        id:         "fed-2025-06-04",
        title:      "Initiative for a Population Growth Cap",
        shortTitle: "Population Cap",
        type:       "initiative",
        voteDate:   "9 Jun 2025",
        createdAt:  NOW - 1 * DAY,
        updatedAt:  NOW - 1 * DAY,
        messages: [
            {
                id:         "s4-1",
                role:       "assistant",
                content:    "Hello! I can help you understand the Population Cap initiative. This proposal would amend the Federal Constitution to limit Switzerland's permanent resident population to 10 million people. What would you like to know?",
                confidence: "High",
            },
        ],
    },
    {
        id:         "fed-2025-06-02",
        title:      "Counter-proposal: Voluntary Corporate Emission Targets",
        shortTitle: "Corporate Emissions",
        type:       "counter-proposal",
        voteDate:   "9 Jun 2025",
        createdAt:  NOW - 8 * DAY,
        updatedAt:  NOW - 7 * DAY,
        messages: [{
            id:         "s2-1",
            role:       "assistant",
            content:    "I can compare the counter-proposal with the main initiative. They appear on the same ballot — Swiss voters can accept both and then state a preference.",
            confidence: "High",
        }],
    },
    {
        id:         "fed-2025-06-03",
        title:      "Referendum Against the Energy Grid Expansion Act",
        shortTitle: "Grid Expansion",
        type:       "referendum",
        voteDate:   "9 Jun 2025",
        createdAt:  NOW - 14 * DAY,
        updatedAt:  NOW - 13 * DAY,
        messages: [{
            id:         "s3-1",
            role:       "assistant",
            content:    "This is an optional referendum — parliament passed the Grid Act and opponents gathered 50,000 signatures to force a public vote.",
            confidence: "High",
        }],
    },
];

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────── */
export const EXPIRY_DAYS = 15;
const STORAGE_KEY        = "smartinfo_chat_threads";
const ACTIVE_KEY         = "smartinfo_chat_active";

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
export function daysLeft(createdAt: number): number {
    return Math.max(0, EXPIRY_DAYS - Math.floor((Date.now() - createdAt) / DAY));
}

export function isExpired(createdAt: number): boolean {
    return daysLeft(createdAt) === 0;
}

export function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    if (diff < 60_000)     return "just now";
    if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
}

function load(): ChatThread[] {
    if (typeof window === "undefined") return SEED_THREADS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return SEED_THREADS;

        const parsed: ChatThread[] = JSON.parse(raw);
        const active  = parsed.filter((t) => !isExpired(t.createdAt));

        /*
          Merge: any SEED_THREAD whose id doesn't exist in localStorage
          gets added automatically. This means adding a new seed thread
          in code will always appear on next load without clearing storage.
        */
        const storedIds = new Set(active.map((t) => t.id));
        const newSeeds  = SEED_THREADS.filter((t) => !storedIds.has(t.id));

        return [...active, ...newSeeds];
    } catch {
        return SEED_THREADS;
    }
}

function save(threads: ChatThread[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch { /* quota exceeded */ }
}

function loadActiveId(threads: ChatThread[]): string {
    if (typeof window === "undefined") return threads[0]?.id ?? "";
    return localStorage.getItem(ACTIVE_KEY) ?? threads[0]?.id ?? "";
}

function makeId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ─────────────────────────────────────────────────────────────
   HOOK
   ───────────────────────────────────────────────────────────── */
export function useChatStore() {
    const [threads,  setThreadsState]  = useState<ChatThread[]>(SEED_THREADS);
    const [activeId, setActiveIdState] = useState<string>(SEED_THREADS[0].id);
    const [loading,  setLoading]       = useState(false);
    const [ready,    setReady]         = useState(false);

    /* Hydrate from localStorage on mount */
    useEffect(() => {
        const t = load();
        const a = loadActiveId(t);
        setThreadsState(t);
        setActiveIdState(a);
        setReady(true);
    }, []);

    /* Persist + update state together */
    const setThreads = useCallback(
        (updater: (prev: ChatThread[]) => ChatThread[]) => {
            setThreadsState((prev) => {
                const next = updater(prev);
                save(next);
                return next;
            });
        },
        []
    );

    const setActiveId = useCallback((id: string) => {
        setActiveIdState(id);
        if (typeof window !== "undefined") localStorage.setItem(ACTIVE_KEY, id);
    }, []);

    /* ── addMessage — append a single message to a thread ── */
    const addMessage = useCallback(
        (threadId: string, msg: ChatMessage) => {
            setThreads((prev) =>
                prev.map((t) =>
                    t.id === threadId
                        ? { ...t, messages: [...t.messages, msg], updatedAt: Date.now() }
                        : t
                )
            );
        },
        [setThreads]
    );

    /* ── sendMessage — full user → AI round trip ────────── */
    const sendMessage = useCallback(
        async (threadId: string, userText: string) => {
            const trimmed = userText.trim();
            if (!trimmed || loading) return;

            /* 1. Find the thread */
            const thread = threads.find((t) => t.id === threadId);
            if (!thread) return;

            /* 2. Append the user message immediately */
            const userMsg: ChatMessage = {
                id:   `u-${makeId()}`,
                role: "user",
                content: trimmed,
            };
            addMessage(threadId, userMsg);
            setLoading(true);

            /* 3. Build the message history to send (exclude system seed msg if desired) */
            const history = [
                ...thread.messages,
                userMsg,
            ].map(({ role, content }) => ({ role, content }));

            try {
                const res = await fetch("/api/chat", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages:    history,
                        voteContext: thread.title,
                        voteType:    thread.type,
                    }),
                });

                if (!res.ok) {
                    throw new Error(`API responded with ${res.status}`);
                }

                const data = await res.json();

                const aiMsg: ChatMessage = {
                    id:         `a-${makeId()}`,
                    role:       "assistant",
                    content:    data.content,
                    confidence: data.confidence ?? "Medium",
                };
                addMessage(threadId, aiMsg);

            } catch (err) {
                console.error("sendMessage error:", err);

                /* Show a user-facing error bubble */
                const errMsg: ChatMessage = {
                    id:      `e-${makeId()}`,
                    role:    "assistant",
                    content: "The AI backend is currently unreachable. Check your VPN connection and SSH tunnel, then try again.",
                    error:   true,
                };
                addMessage(threadId, errMsg);
            } finally {
                setLoading(false);
            }
        },
        [threads, loading, addMessage]
    );

    const activeThread =
        threads.find((t) => t.id === activeId) ?? threads[0] ?? null;

    return {
        threads,
        activeId,
        activeThread,
        loading,
        ready,
        setActiveId,
        addMessage,    /* low-level — append any message directly     */
        sendMessage,   /* high-level — user input → Ollama → response */
    };
}