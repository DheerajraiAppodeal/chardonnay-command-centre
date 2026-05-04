# Chardonnay Command Centre — Claude Code Session File
# Read this at the start of every Claude Code session in this repo.
# Last updated: 2026-05-04

---

## What This Product Is

A React dashboard for the Chardonnay Gaming division at Appodeal.
Live at: https://chardonnay-command-centre.vercel.app
Owner: Dheeraj Rai (Senior Project Manager, Chardonnay Gaming)

Aggregates Jira, Slack, analytics into one place: sprint state, resource allocation, release health.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v4 + inline styles using theme tokens |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Database | Supabase (@supabase/supabase-js) |
| Icons | lucide-react |
| Deploy | Vercel (auto-deploy on push to main) |
| Data refresh | GitHub Actions — 8am Madrid Mon–Fri |

Dev server: `npm run dev` → localhost:5173
Build: `npm run build` → dist/

---

## Repo Structure

```
src/
  App.jsx              ← main shell + theme + nav + inline page components (Overview, WM, Sol, Initiatives, Team)
  main.jsx             ← entry point
  gameData.js          ← AUTO-GENERATED daily by GitHub Action — NEVER edit manually
  roadmapData.js       ← WM feature roadmap — edit for roadmap updates
  teamAvailability.js  ← OOO / rotation — manual until Rippling sync live
  components/
    ClaudeChat.jsx     ← floating Claude chat widget
    NavBar.jsx
  pages/
    Overview.jsx       ← division health, game status
    Gantt.jsx          ← live sprint Gantt (Supabase, lazy-loaded + error boundary)
    Roadmap.jsx        ← feature roadmap
    ReleaseTrain.jsx   ← release ceremony schedule
    SprintProposal.jsx ← WM sprint process doc
    Operations.jsx     ← blockers, resource allocation
    Team.jsx           ← team directory + rotation calendar
    AIHub.jsx          ← Claude skill reference for team
    AIImpact.jsx       ← AI impact tracking (PIN: 2604)
  lib/                 ← utilities
  data/                ← static data
scripts/
  fetch-jira-data.js   ← Jira → gameData.js (runs via GitHub Action)
  sync-rippling-ooo.mjs← Rippling OOO → Supabase team_ooo
.github/workflows/
  daily-refresh.yml    ← runs fetch-jira-data.js Mon–Fri 8am Madrid
team-resources/        ← human onboarding + team skills (not for Claude Code)
```

---

## Theme System

Two themes: LIGHT and DARK, both defined in App.jsx.
Passed via ThemeCtx React context. All components call useT() to get theme tokens.
NEVER hardcode colours. Always use tokens: T.accent, T.text, T.surface, T.wm, T.sol, etc.

Key tokens:
- T.wm = Word Maker green | T.sol = Solitaire blue
- T.accent = #F4A428 orange (primary action)
- T.ok / T.warn / T.caution = status colours
- T.surface / T.surfaceAlt / T.border = card backgrounds
- T.isDark = boolean

---

## Coding Conventions

- Commits: feat: / fix: / data: / update: / docs:
- Styles: inline using theme tokens. No CSS modules. Tailwind for utilities only.
- No prop drilling: theme via useT(), data via imports or Supabase
- Heavy pages: lazy-load + error boundary (see Gantt pattern)
- New page: create in src/pages/, add to TABS array + pages object in App.jsx
- gameData.js: never edit. Wrong data → check GitHub Action logs or run script locally.
- Mock data: present for crash trends, velocity, retention. Marked with TODO. Replace when live.

---

## Key Data Files

### gameData.js — AUTO-GENERATED
Exports: LAST_UPDATED, GAME_STATS, UNASSIGNED_HIGH_BUGS, SOL_ACTIVE, SOL_CRASHES, WM_ACTIVE

### roadmapData.js — edit for roadmap changes
Exports: FEATURE_ROADMAP
Structure: features → tracks (art/techArt/dev/qa) → { weekStart, weekEnd, status, people }

### teamAvailability.js — edit for OOO/rotation
Manual until Rippling sync is live.

---

## Supabase Tables

| Table | Purpose |
|-------|---------|
| sprint_features | One row per WM feature — name, version, status, KPI targets |
| sprint_tracks | One row per discipline per feature — track status + dates |
| team_ooo | OOO entries from Rippling + manual overrides |

VITE_SUPABASE_URL = https://bbzhntajcxdgeskbmbzp.supabase.co

---

## Live vs Mock Data (May 2026)

| Data | Status |
|------|--------|
| CHSOL + WORD Jira tickets | ✅ Live — GitHub Action → gameData.js |
| WM Gantt tracks | ✅ Live — Supabase sprint_tracks |
| Crash-free rate | ⚠️ Mock — needs Grafana/Firebase |
| Velocity sparklines | ⚠️ Mock — needs Jira sprint history API |
| Retention metrics | ⚠️ Mock — needs Appodeal analytics |
| Team OOO | ⚠️ Manual — Rippling sync planned |
| AI Impact metrics | ⚠️ Mock — conservative rule: 4+ weeks before showing actuals |

---

## Games Context

**Word Maker** — Android, live. Jira: WORD. PM: Didara. Q2 OKR: ≥20% D3 retention uplift.
**Solitaire** — Android. Jira: CHSOL (Board 1860). Firebase: klondike-solitaire-46f14. PM: Srikanth.
**Shared bottlenecks**: Juan Zambrana (TA) + Krish Prabha (QA) rotate WM ↔ Sol weekly.

---

## Environment Variables

```
VITE_SUPABASE_URL=https://bbzhntajcxdgeskbmbzp.supabase.co
VITE_SUPABASE_ANON_KEY=...     ← client-side reads
SUPABASE_SERVICE_KEY=...       ← server-side writes (scripts only, never in src/)
JIRA_EMAIL=dheeraj.rai@appodeal.com
JIRA_API_TOKEN=...
RIPPLING_API_KEY=...
```

Local: .env.local (gitignored). CI: GitHub Secrets.

---

## What's Being Built Next (Week of May 4, 2026)

- [ ] Feature roadmap tab — new page for Q2 WM + Sol feature plan
- [ ] WM source-of-truth GitHub Action — scripts/sync-wm-source.mjs (Phase 2)
- [ ] Rippling OOO sync — scripts/sync-rippling-ooo.mjs (drafted, needs testing)
- [ ] Replace mock crash/velocity/retention data with live sources

Full architecture spec: chardonnay-brain/deliverables/wm-source-of-truth-architecture.md

---

## Useful Commands

```bash
npm run dev                    # dev server → localhost:5173
npm run build                  # production build → dist/
node scripts/fetch-jira-data.js   # manual Jira sync

RIPPLING_API_KEY=xxx VITE_SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx \
node scripts/sync-rippling-ooo.mjs   # manual OOO sync
```
