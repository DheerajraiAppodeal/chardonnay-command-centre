# 🚀 Getting Started with Claude — Chardonnay Team Guide

> **Who this is for:** Anyone on the Chardonnay Gaming team joining this repo.
> This guide gets you from zero to a fully configured Claude in ~30 minutes.
> Dheeraj has spent weeks figuring this out so you don't have to.

---

## What you'll have at the end

- Claude connected to **Jira** (read/write tickets without leaving Claude)
- Claude connected to **Slack** (search messages, post updates)
- Claude connected to **Google Calendar** (check schedules, create events)
- Claude with **filesystem access** to this repo (read, edit, commit code)
- **Skills** loaded so Claude understands how Chardonnay works
- **Daily morning brief** — open Claude, say "morning brief", get your standup prep done in 2 minutes

---

## Step 1 — Get Claude Pro or Team

You need a paid Claude account for MCP and connectors to work.

- **Individual:** [claude.ai/upgrade](https://claude.ai/upgrade) → Pro ($20/month)
- **Team access:** Ask Dheeraj — Appodeal may have Team seats available

---

## Step 2 — Install Claude Desktop App

Download from [claude.ai/download](https://claude.ai/download) and install.

> ⚠️ MCP only works in the **desktop app**, not the browser version of Claude.

---

## Step 3 — Set up Connectors (claude.ai)

These work in both the browser and desktop app. Go to **claude.ai → Settings → Connectors** and connect:

| Connector | Why you need it |
|-----------|----------------|
| **Jira (Atlassian)** | Search tickets, read sprint status, create tasks |
| **Slack** | Read channels, search messages, post updates |
| **Google Calendar** | Check your schedule, create events |
| **Google Drive** | Access shared docs and specs |
| **Confluence** | Read team documentation |

Each connector uses OAuth — just click connect and authorise with your Appodeal account.

---

## Step 4 — Set up MCP (Claude Desktop only)

MCP gives Claude read/write access to your local files and tools. This is what lets Claude Code commit to GitHub on your behalf.

### 4a — Install Node.js (if you don't have it)

```bash
# Check if you have it:
node --version

# If not, install via Homebrew:
brew install node
```

### 4b — Clone this repo

```bash
cd ~/Documents/GitHub
git clone https://github.com/DheerajraiAppodeal/chardonnay-command-centre.git
```

### 4c — Get your Jira API token

1. Go to: [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **"Create API token"**
3. Label it `chardonnay-claude`
4. Copy the token — **save it now**, it won't show again

### 4d — Configure Claude Desktop

Open Claude Desktop → **Settings → Developer → Edit Config**

Paste this (replace the placeholders with your details):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/opt/homebrew/bin/npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/YOUR_USERNAME/Documents/GitHub/chardonnay-command-centre"
      ]
    },
    "jira": {
      "command": "/opt/homebrew/bin/npx",
      "args": [
        "-y",
        "@aashari/mcp-server-atlassian-jira"
      ],
      "env": {
        "ATLASSIAN_SITE_URL": "https://appodeal.atlassian.net",
        "ATLASSIAN_USER_EMAIL": "YOUR_NAME@appodeal.com",
        "ATLASSIAN_API_TOKEN": "YOUR_JIRA_API_TOKEN"
      }
    }
  }
}
```

> Replace `YOUR_USERNAME`, `YOUR_NAME@appodeal.com`, and `YOUR_JIRA_API_TOKEN` with your actual values.
> Full template at: `team-resources/config/claude_desktop_config.template.json`

### 4e — Restart Claude Desktop

Close and reopen the app. The MCP connections will activate.

---

## Step 5 — Verify everything works

Open Claude Desktop and try these prompts:

```
# Test Jira:
"Show me the latest 5 tickets in CHSOL"

# Test filesystem:
"List the files in the chardonnay-command-centre repo"

# Test Slack (via connector):
"What was discussed in #chardonnay-product today?"

# Test Calendar (via connector):
"What's on my calendar tomorrow?"
```

If any of these fail, see **Troubleshooting** at the bottom.

---

## Step 6 — Load the Skills

Skills are ready-made prompts that tell Claude exactly how to help with Chardonnay work.
Load them by telling Claude to read the file, or just paste the file contents directly.

### 🌅 Morning Brief
*The first thing to use every day. Checks Jira + Slack before standup.*

```
Read team-resources/skills/morning-brief.md and run a morning brief for today.
```

→ Full guide: [`team-resources/skills/morning-brief.md`](./team-resources/skills/morning-brief.md)

---

### 🐛 Bug Report
*Found a bug? Turn rough notes into a perfect Jira ticket in 60 seconds.*

```
Read team-resources/skills/bug-report.md, then help me log this bug:
[describe what broke]
```

→ Full guide: [`team-resources/skills/bug-report.md`](./team-resources/skills/bug-report.md)

---

### 📋 Feature Spec → Jira Tickets
*Have a feature idea? Turn a rough brief into a full set of Jira tickets with one prompt.*

```
Read team-resources/skills/feature-spec.md, then spec this feature for [CHSOL/WORD]:
[describe the feature]
```

→ Full guide: [`team-resources/skills/feature-spec.md`](./team-resources/skills/feature-spec.md)

---

### 🎯 Jira Ops
*Standards, JQL queries, and ticket templates for the Chardonnay boards.*

```
Read team-resources/skills/jira-ops.md
```

→ Full guide: [`team-resources/skills/jira-ops.md`](./team-resources/skills/jira-ops.md)

---

### 👥 Team Context
*Load at the start of any session about the team, games, or operations.*

```
Read team-resources/context/team-context.md
```

→ Full guide: [`team-resources/context/team-context.md`](./team-resources/context/team-context.md)

---

## Step 7 — Most useful daily prompts

```
# Morning standup prep (after loading morning-brief skill):
"Morning brief"

# Log a bug fast:
"Log a bug in CHSOL — [what broke, one sentence]"

# Spec a feature:
"Spec [feature name] for Solitaire, target v5.8.0, here's my brief: [paste notes]"

# Sprint status snapshot:
"What's the current state of the CHSOL sprint — in progress, QA queue, blockers?"

# Unassigned ticket check:
"Are there any High priority tickets in CHSOL or WORD without an assignee?"

# Store review summary:
"Summarise this week's store review reports from Darya in #ch-wordmaker-main"
```

---

## What's in this repo

| Path | What it is |
|------|-----------|
| `src/App.jsx` | The Command Centre dashboard (React) |
| `src/gameData.js` | Auto-generated daily from Jira — do not edit manually |
| `scripts/fetch-jira-data.js` | Jira data fetch script (runs via GitHub Action) |
| `.github/workflows/daily-refresh.yml` | GitHub Action — runs Mon–Fri 8am Madrid |
| `team-resources/skills/morning-brief.md` | Daily standup prep skill |
| `team-resources/skills/bug-report.md` | Bug → Jira ticket skill |
| `team-resources/skills/feature-spec.md` | Feature brief → Jira tickets skill |
| `team-resources/skills/jira-ops.md` | Jira standards and JQL queries |
| `team-resources/context/team-context.md` | Full team context — load at session start |
| `team-resources/config/` | MCP config template — copy and fill in your details |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP not connecting | Restart Claude Desktop. Check Node: `node --version` |
| Jira auth failing | Regenerate your API token at id.atlassian.com |
| Filesystem not found | Check the path in config matches exactly where you cloned the repo |
| `npx` not found | Run `which npx` in Terminal and use that path in the config |
| Connectors not working | Make sure you're using the **desktop app**, not the browser |

---

## Questions?

Slack DM **Dheeraj Rai** or post in **#chardonnay-product**.

This is a living document. If you find something that doesn't work or discover a better prompt, raise a PR — the whole team benefits.
