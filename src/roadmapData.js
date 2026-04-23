// ── Feature Roadmap Data ─────────────────────────────────────────────────
// This file is the MANUAL layer on top of gameData.js (auto-generated).
// Edit this file directly to update feature roadmap status.
// The dashboard reads both files and merges them.
//
// STATUS OPTIONS: "not-started" | "in-progress" | "review" | "done" | "blocked"
// ─────────────────────────────────────────────────────────────────────────

export const FEATURE_ROADMAP = {
  wm: [
    {
      id: "wm-m7",
      name: "Collectible Event",
      subtitle: "Gems / Lanterns / Chain Tiles",
      version: "1.46.0",
      milestone: "M7",
      targetMonth: "Apr 2026",
      status: "live",
      tracks: {
        design: { status: "done",        note: "Finalised" },
        art:    { status: "done",        note: "Assets delivered — Juan Z" },
        dev:    { status: "done",        note: "Live @ 10% Android" },
        qa:     { status: "done",        note: "Signed off" },
      },
      jiraEpic: null,
      risks: [],
      kpiTarget: "D1–D3 retention uplift",
    },
    {
      id: "wm-m8",
      name: "Beginner's Bonus",
      subtitle: "Jigsaw Puzzle + feature foreshadowing",
      version: "1.47.0",
      milestone: "M8",
      targetMonth: "Apr 2026",
      status: "in-progress",
      tracks: {
        design: { status: "done",        note: "Spec complete — Didara" },
        art:    { status: "done",        note: "Assets delivered — Juan Z" },
        dev:    { status: "review",      note: "11 tickets Ready for QA — unassigned ⚠️" },
        qa:     { status: "not-started", note: "Waiting for assignees" },
      },
      jiraEpic: null,
      risks: ["11 QA tickets unassigned — Krish not yet briefed"],
      kpiTarget: "D2–D3 retention uplift",
    },
    {
      id: "wm-m9",
      name: "Word Master Chained Reward",
      subtitle: "",
      version: "1.48.0",
      milestone: "M9",
      targetMonth: "May 2026",
      status: "planned",
      tracks: {
        design: { status: "in-progress", note: "Spec in progress — Didara" },
        art:    { status: "not-started", note: "" },
        dev:    { status: "not-started", note: "" },
        qa:     { status: "not-started", note: "" },
      },
      jiraEpic: null,
      risks: [],
      kpiTarget: "D1–D3 retention uplift",
    },
    {
      id: "wm-m10",
      name: "Breather Levels",
      subtitle: "New gameplay mode",
      version: "1.49.0",
      milestone: "M10",
      targetMonth: "Jun 2026",
      status: "planned",
      tracks: {
        design: { status: "not-started", note: "" },
        art:    { status: "not-started", note: "" },
        dev:    { status: "not-started", note: "" },
        qa:     { status: "not-started", note: "" },
      },
      jiraEpic: null,
      risks: [],
      kpiTarget: "D3–D7 retention uplift",
    },
    {
      id: "wm-m11",
      name: "Meta Progress + FTUE Polish",
      subtitle: "",
      version: "1.50.0",
      milestone: "M11",
      targetMonth: "Jun 2026",
      status: "planned",
      tracks: {
        design: { status: "not-started", note: "" },
        art:    { status: "not-started", note: "" },
        dev:    { status: "not-started", note: "" },
        qa:     { status: "not-started", note: "" },
      },
      jiraEpic: null,
      risks: [],
      kpiTarget: "D1→D3–D7 uplift",
    },
  ],

  sol: [
    {
      id: "sol-coins-meta",
      name: "Coins Meta System",
      subtitle: "Coins behind cards + booster purchase",
      version: "v5.7.x",
      milestone: "",
      targetMonth: "Apr 2026",
      status: "in-progress",
      tracks: {
        design: { status: "done",        note: "Spec complete — Srikanth" },
        art:    { status: "done",        note: "UI assets complete" },
        dev:    { status: "review",      note: "Angel — multiple tickets Ready for QA" },
        qa:     { status: "in-progress", note: "Krish — active testing" },
      },
      jiraEpic: null,
      risks: ["v4.3.4 still has 139K users — multi-version QA burden"],
      kpiTarget: "Engagement + monetisation",
    },
    {
      id: "sol-level-up",
      name: "Level Up Screen",
      subtitle: "New level up animation + results screen",
      version: "v5.7.x",
      milestone: "",
      targetMonth: "Apr 2026",
      status: "in-progress",
      tracks: {
        design: { status: "done",        note: "Spec complete" },
        art:    { status: "in-progress", note: "Henrique — In Progress" },
        dev:    { status: "not-started", note: "Blocked on art" },
        qa:     { status: "not-started", note: "" },
      },
      jiraEpic: "CHSOL-1367",
      risks: [],
      kpiTarget: "D1 retention",
    },
    {
      id: "sol-journey-liveops",
      name: "Journey / Live Ops Integration",
      subtitle: "Journey system using live ops infrastructure",
      version: "v5.8.0",
      milestone: "",
      targetMonth: "May 2026",
      status: "in-progress",
      tracks: {
        design: { status: "done",        note: "Spec complete — Giulia" },
        art:    { status: "not-started", note: "" },
        dev:    { status: "in-progress", note: "Angel — CHSOL-1357 In Progress" },
        qa:     { status: "not-started", note: "" },
      },
      jiraEpic: "CHSOL-1357",
      risks: ["Depends on MetaPlay live ops infrastructure — scope TBD"],
      kpiTarget: "D7+ retention",
    },
  ],
};

// Track label display names
export const TRACK_LABELS = {
  design: "Design",
  art:    "Art",
  dev:    "Dev",
  qa:     "QA",
};

// Status display config
export const TRACK_STATUS_CONFIG = {
  "not-started": { label: "Not started", color: "#8B93A8", bg: "#F0F2F5" },
  "in-progress":  { label: "In progress", color: "#4A7BB5", bg: "#EEF4FB" },
  "review":       { label: "Review",      color: "#B07020", bg: "#FEF5E8" },
  "done":         { label: "Done",        color: "#2E8A5A", bg: "#E8F5EE" },
  "blocked":      { label: "Blocked",     color: "#8A3828", bg: "#FCEAE6" },
};
