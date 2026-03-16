import type {
    Referendum,
    Preference,
    Argument,
    ChangeItem,
    Source,
    TrustTierVariant,
    ChatMessage,
    DeliberationStats,
    StatBar,
    FeedbackItem,
    Tab,
} from "@/lib/types";

// ── Referendum ───────────────────────────────────────────

export const currentReferendum: Referendum = {
    id:          "climate-fund-2024",
    title:       "Initiative for a Climate Fund",
    description: "Federal popular initiative (example placeholder)",
    voteDate:    "Sun, 9 Jun (example)",
    question:
        "Do you support creating a dedicated fund to finance environmental projects?",
};

// ── User preferences ─────────────────────────────────────

export const userPreferences: Preference[] = [
    { label: "Economic stability",    value: 60 },
    { label: "Environment",           value: 72 },
    { label: "Social cohesion",       value: 55 },
    { label: "Autonomy / local control", value: 63 },
];

// ── Facts ────────────────────────────────────────────────

export const facts: string[] = [
    "The measure introduces a dedicated funding mechanism (exact wording would be cited).",
    "Implementation details influence long-term costs and governance.",
    "Official pro/contra statements can be mapped into the argument module.",
];

// ── Arguments ────────────────────────────────────────────

export const arguments_: Argument[] = [
    { type: "pro", title: "Top PRO (community)", body: "Provides clearer long-term funding security." },
    { type: "con", title: "Top CON (community)", body: "Risk of higher costs for taxpayers." },
];

// ── What changes items ───────────────────────────────────

export const changeItems: ChangeItem[] = [
    {
        icon:  "→",
        label: "Funding mechanism",
        body:  "Creates a dedicated fund separate from the general federal budget.",
    },
    {
        icon:  "→",
        label: "Decision authority",
        body:  "Shifts certain project approvals from parliament to a new oversight body.",
    },
    {
        icon:  "→",
        label: "Timeline",
        body:  "Enables faster financing cycles for qualifying environmental projects.",
    },
];

// ── Sources ──────────────────────────────────────────────

export const sources: Source[] = [
    {
        id:          "S1",
        title:       "Federal Voting Booklet",
        description: "Primary source for proposal + official statements.",
    },
    {
        id:          "S2",
        title:       "Parliamentary debate summary",
        description: "Context + rationale (summary).",
    },
    {
        id:          "S3",
        title:       "Neutral fact-check brief",
        description: "Non-partisan overview of key claims.",
    },
];

export const trustTiers: Record<string, TrustTierVariant> = {
    S1: { label: "Official",  variant: "success" },
    S2: { label: "Official",  variant: "success" },
    S3: { label: "Verified",  variant: "yellow"  },
};

// ── Chat ─────────────────────────────────────────────────

export const chatSuggestions: string[] = [
    "What does this proposal actually do?",
    "What are the strongest PRO arguments?",
    "What are the strongest CON arguments?",
    "How much will this cost taxpayers?",
];

export const initialMessages: ChatMessage[] = [
    {
        id:         "msg-1",
        role:       "assistant",
        content:
            "Hi — I can help you understand this referendum. Ask what the proposal does, the strongest arguments, or what facts are well-established.",
        confidence: "High",
        sources:    ["S1", "S3"],
        knowledgeLimits: [
            "Some impacts depend on implementation details and future budgets.",
            "I will cite official passages for factual claims in production.",
        ],
    },
    {
        id:      "msg-2",
        role:    "user",
        content: "What are the strongest PRO and CON points?",
    },
    {
        id:      "msg-3",
        role:    "assistant",
        content:
            "Strongest PRO points: planning security, reduced friction. Strongest CON points: cost risk, unclear safeguards. Tell me what matters most — cost, fairness, environment, or autonomy — and I'll highlight the relevant trade-offs.",
    },
];

// ── Deliberation ─────────────────────────────────────────

export const deliberationStats: DeliberationStats = {
    respectfulDebate: 82,
    sourcesCited:     76,
    feedback: { agree: 0, disagree: 0, confused: 0 },
};

export const statBars: StatBar[] = [
    { label: "Respectful debate",  value: 82, accent: false },
    { label: "Sources cited",      value: 76, accent: true  },
    { label: "New participants",   value: 61, accent: false },
    { label: "Avg. reading time",  value: 74, accent: false },
];

export const feedbackItems: FeedbackItem[] = [
    { key: "agree",    emoji: "👍", label: "Agree"    },
    { key: "disagree", emoji: "👎", label: "Disagree" },
    { key: "confused", emoji: "❓", label: "Confused"  },
];

// ── Navigation ───────────────────────────────────────────

export const tabs: Tab[] = [
    { id: "overview",   label: "Overview"           },
    { id: "arguments",  label: "Arguments"          },
    { id: "discussion", label: "Citizen Discussion" },
];

export const navLinks: string[] = [
    "Home",
    "Upcoming Votes",
    "Referendum History",
    "My Canton",
];

export const languages: string[] = ["EN", "DE", "FR", "IT"];

export const footerPillars: string[] = [
    "Transparency",
    "Explainability",
    "Fairness",
    "Participation",
];