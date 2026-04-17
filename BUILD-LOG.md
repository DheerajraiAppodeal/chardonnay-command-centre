# Chardonnay Command Centre — Build Log

## Build date: 2026-04-17

---

## Items requiring manual connection

### 1. Jira (appodeal.atlassian.net)
- **What's needed**: Sprint ticket counts, blocker list, completion % per game label
- **Where it shows**: Operations page (sprint cards, blocker table), Overview (stat cards)
- **How to connect**: Jira MCP is available (`mcp__8e1535a8`). Auth via Atlassian token in Claude Code settings.
  - Fetch: `searchJiraIssuesUsingJql` with JQL `project = CHSOL AND sprint in openSprints() AND labels = "solitaire" AND status = Blocked`
  - Board ID: 1860
- **Current state**: Mock data in `src/data/mockData.js` — update `GAMES`, `BLOCKERS` arrays when live.

### 2. Grafana / Sentry — Crash rate
- **What's needed**: Crash % per release, per game, last 4 sprints
- **Where it shows**: Overview sparklines, Release Train QA gate
- **How to connect**: Grafana MCP skill available. Need Grafana instance URL + auth.
- **Current state**: Hardcoded crash trend arrays in `GAMES[].crashTrend`. TODO comment in Overview.jsx.

### 3. Confluence (appodeal.atlassian.net)
- **What's needed**: PM spec docs, release notes (optional enrichment)
- **Current state**: Not connected. No TODO markers — not blocking any current view.

### 4. Fireflies (meeting transcripts)
- **What's needed**: Post-meeting action items auto-surfaced to Operations blockers
- **Current state**: Not connected. Future enhancement — Fireflies MCP available.

### 5. Google Calendar
- **What's needed**: Release date sync — QA gate auto-populated from calendar invites
- **Current state**: Not connected. Release dates are manual-entry in `RELEASE_MILESTONES`.

### 6. Slack send (C07GS984RUG)
- **What's needed**: One-click send of resource update message
- **Current state**: "Send resource update" button generates a draft modal. Dheeraj must copy-paste manually (by design — rule #1: never send autonomously).

---

## Design decisions & notes

- **PIN for AI Impact**: Hardcoded as `2604`. Change in `src/pages/AIImpact.jsx` line with `CORRECT_PIN`.
- **Conservative AI delta display**: Logic stub in place — currently no actuals to display. Implement in Section 2 when sprint data flows.
- **Crash trend sparklines**: Using `polyline` SVG — no chart library dependency.
- **Tooltip on timeline**: Pure CSS hover, no library.
- **QA overload detection**: Currently checks if >1 product has a blocker in week 1. Refine logic once Jira is live.

---

## Known gaps (not blockers)

- Release Train "click to edit dates" — tooltip text says it; inline date editing not yet implemented (dates are in `RELEASE_MILESTONES` in mockData — edit there for now).
- Velocity sparkline data is mock. Will need Jira sprint history API.
- AI Impact "Export to PDF" button — copy-to-clipboard works; PDF export requires a library (jsPDF or similar). Not implemented.
