// ───────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Source:    Jira CHSOL + WORD (appodeal.atlassian.net)
// Generator: scripts/fetch-jira-data.js
// Refreshed: 2026-04-21T08:09:00.000Z  (initial stub — will be overwritten by Action)
// ───────────────────────────────────────────────────────────

export const LAST_UPDATED     = "Tue 21 Apr 2026";
export const LAST_UPDATED_ISO = "2026-04-21T08:09:00.000Z";

export const GAME_STATS = {
  wm:  { activeIssues: 11, readyForQA: 11 },
  sol: { activeIssues: 7,  readyForQA: 3  },
};

// High-priority unassigned bugs — surfaced in Overview
export const UNASSIGNED_HIGH_BUGS = [
  { key: "CHSOL-1355", summary: "Left hand mode UI broken", project: "CHSOL", status: "Backlog" },
];

// Solitaire active sprint tickets (non-crash, non-Done)
export const SOL_ACTIVE = [
  { key: "CHSOL-1367", summary: "[Art] Level Up Screen",                        assignee: "Henrique", status: "In Progress"  },
  { key: "CHSOL-1329", summary: "[Art] Results screen",                         assignee: "Henrique", status: "Review"       },
  { key: "CHSOL-1357", summary: "[Dev] Journey to live ops system",             assignee: "Angel",    status: "In Progress"  },
  { key: "CHSOL-1344", summary: "[Dev] Coins between cards — shuffle/magic",    assignee: "Angel",    status: "Review"       },
  { key: "CHSOL-1312", summary: "[Dev] Logic for coins behind cards",            assignee: "Angel",    status: "Ready for QA" },
  { key: "CHSOL-1352", summary: "Keep infinite time on game relaunch",           assignee: "Murat",    status: "Ready for QA" },
  { key: "CHSOL-1345", summary: "[Bug] Card to pile instead of foundation",      assignee: "Murat",    status: "Ready for QA" },
  { key: "CHSOL-1355", summary: "Left hand mode UI broken ⚠ HIGH — unassigned", assignee: "—",        status: "Backlog"      },
  { key: "CHSOL-1358", summary: "[Code] New quest popup design",                 assignee: "Murat",    status: "Backlog"      },
];

// Solitaire Crashlytics crash tickets
export const SOL_CRASHES = [
  { id: "CHSOL-1366", issue: "libil2cpp.so SIGTRAP",           device: "Motorola moto g pure",   note: "Ad WebView corrupting IL2CPP on low-RAM device"       },
  { id: "CHSOL-1365", issue: "libc.so fatal crash",            device: "Motorola moto g series", note: "Ad WebView / Appodeal bridge on low-RAM devices"      },
  { id: "CHSOL-1364", issue: "MainBoostersUnlockTracker NRE",  device: "Multiple",               note: "Migration runs before Initialize — order bug"         },
  { id: "CHSOL-1363", issue: "AutoCompleteService NRE",        device: "Multiple",               note: "StageManager null on offline cold-start"              },
  { id: "CHSOL-1362", issue: "ANR — WebView freeze",           device: "OnePlus DE2118",         note: "11 notifications + SessionProgression on main thread" },
  { id: "CHSOL-1361", issue: "CardItem card cycle crash",       device: "Multiple",               note: "Rapid replay creates card chain loop"                 },
];

// Word Maker recent tickets (last 7 days)
export const WM_ACTIVE = [
  { key: "WORD-560", summary: "[DEV] Implement popup priority system",          assignee: "—", status: "Ready for QA" },
  { key: "WORD-562", summary: "[DEV] Wire logic to the widget",                 assignee: "—", status: "Ready for QA" },
  { key: "WORD-561", summary: "[DEV] Wire logic to the popup",                  assignee: "—", status: "Ready for QA" },
  { key: "WORD-559", summary: "[DEV] Save and restore event state",             assignee: "—", status: "Ready for QA" },
  { key: "WORD-558", summary: "[DEV] Set up timer in the widget",               assignee: "—", status: "Ready for QA" },
  { key: "WORD-557", summary: "[DEV] Show widget in the lobby",                 assignee: "—", status: "Ready for QA" },
  { key: "WORD-556", summary: "[DEV] Event completion logic — expiration",      assignee: "—", status: "Ready for QA" },
  { key: "WORD-555", summary: "[DEV] Event completion logic — success",         assignee: "—", status: "Ready for QA" },
  { key: "WORD-554", summary: "[DEV] Progress bar logic in the popup",          assignee: "—", status: "Ready for QA" },
  { key: "WORD-553", summary: "[DEV] Set up timer in the popup",                assignee: "—", status: "Ready for QA" },
  { key: "WORD-552", summary: "[DEV] Popup appearance logic",                   assignee: "—", status: "Ready for QA" },
  { key: "WORD-551", summary: "[DEV] Implement one-time activation",            assignee: "—", status: "Ready for QA" },
  { key: "WORD-550", summary: "[DEV] Create remote config for feature params",  assignee: "—", status: "Ready for QA" },
  { key: "WORD-549", summary: "[DEV] Create feature flag for Beginner's Bonus", assignee: "—", status: "Ready for QA" },
];
