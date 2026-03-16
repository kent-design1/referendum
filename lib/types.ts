// ─────────────────────────────────────────────────────────
// types/index.ts
// Single source of truth for all TypeScript types.
// Import from "@/types" everywhere in the project.
// ─────────────────────────────────────────────────────────


// ── Primitives ───────────────────────────────────────────

/** 0–100 integer used for preference values and stat percentages */
export type Score = number;

/** ISO-8601 date string e.g. "2024-06-09" */
export type ISODate = string;

/** Source ID token e.g. "S1", "S2" */
export type SourceId = string;


// ── UI component variants ────────────────────────────────

export type BadgeVariant    = "default" | "yellow" | "success" | "error";
export type ButtonVariant   = "primary" | "yellow" | "outline" | "ghost";
export type ButtonSize      = "sm" | "md";
export type ProgressVariant = "default" | "yellow";


// ── Navigation ───────────────────────────────────────────

/** The three main content tabs on the referendum page */
export type TabId = "overview" | "arguments" | "discussion";

export interface Tab {
    id:    TabId;
    label: string;
}


// ── Referendum ───────────────────────────────────────────

export interface Referendum {
    id:          string;
    title:       string;
    /** Short subtitle shown below the title */
    description: string;
    voteDate:    string;
    question:    string;
}

/** A single item in the "What changes?" list */
export interface ChangeItem {
    /** Arrow or icon character displayed as the leading mark */
    icon:  string;
    label: string;
    body:  string;
}


// ── User preferences ─────────────────────────────────────

export interface Preference {
    label: string;
    /** Integer 0–100 */
    value: Score;
}


// ── Arguments ────────────────────────────────────────────

export interface Argument {
    type:  "pro" | "con";
    title: string;
    body:  string;
}


// ── Sources ──────────────────────────────────────────────

export type TrustTier = "Official" | "Verified" | "Unverified";

export type TrustTierVariant = {
    label:   TrustTier;
    variant: BadgeVariant;
};

export interface Source {
    id:          SourceId;
    title:       string;
    description: string;
}


// ── Chat ─────────────────────────────────────────────────

export type ChatRole       = "assistant" | "user";
export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface ChatMessage {
    id:               string;
    role:             ChatRole;
    content:          string;
    confidence?:      ConfidenceLevel;
    /** Source IDs cited in this message */
    sources?:         SourceId[];
    knowledgeLimits?: string[];
}


// ── Deliberation insights ────────────────────────────────

export interface FeedbackCounts {
    agree:    number;
    disagree: number;
    confused: number;
}

export type FeedbackKey = keyof FeedbackCounts;

export interface StatBar {
    label:  string;
    value:  Score;
    /** When true, renders with the yellow accent fill */
    accent: boolean;
}

export interface DeliberationStats {
    respectfulDebate: Score;
    sourcesCited:     Score;
    feedback:         FeedbackCounts;
}


// ── Feedback UI ──────────────────────────────────────────

export interface FeedbackItem {
    key:   FeedbackKey;
    emoji: string;
    label: string;
}