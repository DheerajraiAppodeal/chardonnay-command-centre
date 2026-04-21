# Chardonnay Gaming Command Centre

Operational intelligence dashboard for the Chardonnay Gaming division at Appodeal.

**Live dashboard:** [chardonnay-command-centre.vercel.app](https://chardonnay-command-centre.vercel.app)

---

## 👋 New to the team?

**Start here → [GETTING_STARTED.md](./GETTING_STARTED.md)**

It covers everything you need to get Claude set up properly — MCP, connectors, skills, and the prompts we use daily. Takes ~30 minutes and saves you weeks of figuring it out yourself.

---

## What's in this repo

| Path | What it is |
|------|-----------|
| `GETTING_STARTED.md` | **Start here** — full Claude setup guide for the team |
| `src/App.jsx` | The Command Centre dashboard (React) |
| `src/gameData.js` | Auto-generated daily from Jira — do not edit manually |
| `scripts/fetch-jira-data.js` | Jira data fetch script (runs via GitHub Action) |
| `.github/workflows/daily-refresh.yml` | GitHub Action — runs Mon–Fri at 8am Madrid |
| `team-resources/skills/` | Claude skill files — load these for Jira and 1:1 work |
| `team-resources/context/team-context.md` | Team structure, games status, key rules — load at start of sessions |
| `team-resources/config/` | MCP config template — copy and fill in your details |

---

## Team Resources (for Claude)

These files are designed to be loaded directly into Claude:

- **`team-resources/context/team-context.md`** — who's who, what we're building, key rules
- **`team-resources/skills/jira-ops.md`** — Jira standards, JQL queries, ticket templates
- **`team-resources/skills/1on1-prep.md`** — 1:1 prep framework and question banks
- **`team-resources/config/claude_desktop_config.template.json`** — MCP config template

---

## Dashboard Stack

- React 19 + Vite 6
- Data: auto-refreshed from Jira daily via GitHub Actions
- Deployed: Vercel (auto-deploys on push to main)

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Contributing

The dashboard auto-updates daily from Jira — no manual data editing needed.

For dashboard changes, push to main and Vercel deploys automatically.

For skill/context improvements, open a PR — the whole team benefits.

---

*Questions? Slack DM Dheeraj Rai*
