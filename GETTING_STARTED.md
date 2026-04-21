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
- **Daily morning brief** auto-delivered to your Slack

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

### 4e — Restart Claude Desktop

Close and reopen the app. The MCP connections will activate.

---

## Step 5 — Verify everything works

Open Claude Desktop and try these prompts:

```
# Test Jira connection:
"Show me the latest 5 tickets in CHSOL"

# Test filesystem:
"List the files in the chardonnay-command-centre repo"

# Test Slack (via connector):
"What was discussed in #chardonnay-product today?"

# Test Calendar (via connector):
"What's on my calendar tomorrow?"
```

If any of these fail, see the **Troubleshooting** section at the bottom.

---

## Step 6 — Load the Chardonnay Skills

Skills are pre-built prompts that tell Claude how our team works. Paste these into Claude at the start of any relevant session:

### Skill: Jira Ops
*Use when: creating tickets, doing sprint reviews, managing backlogs*

```
Load the Jira ops skill from:
/Users/YOUR_USERNAME/Documents/GitHub/chardonnay-command-centre/team-resources/skills/jira-ops.md
```

### Skill: 1-on-1 Prep
*Use when: preparing for 1:1s with team members or Jordi*

```
Load the 1:1 prep skill from:
/Users/YOUR_USERNAME/Documents/GitHub/chardonnay-command-centre/team-resources/skills/1on1-prep.md
```

### Skill: Chardonnay Context
*Use when: starting any Claude session about the team or games*

```
Load the team context from:
/Users/YOUR_USERNAME/Documents/GitHub/chardonnay-command-centre/team-resources/context/team-context.md
```

---

## Step 7 — Most useful prompts to get started

Once set up, here are the prompts Dheeraj uses daily:

### Morning check
```
Morning brief — check CHSOL and WORD Jira for new tickets, 
unassigned high bugs, and anything in Ready for QA.
Also check #chardonnay-product on Slack for any overnight flags.
```

### Quick ticket creation
```
Create a Jira task in CHSOL:
Summary: [Dev] Your task title here
Assignee: Murat Kacmaz
Priority: Medium
Description: What needs to be done and why
Acceptance criteria: What done looks like
```

### Sprint status
```
Give me a snapshot of the current CHSOL sprint — 
what's in progress, what's ready for QA, and what's blocked.
```

### Store review summary
```
Summarise the latest messages in #ch-wordmaker-main 
about store reviews from Darya this week.
```

---

## What's in this repo

| Path | What it is |
|------|-----------|
| `src/App.jsx` | The Command Centre dashboard (React) |
| `src/gameData.js` | Auto-generated daily from Jira — don't edit manually |
| `scripts/fetch-jira-data.js` | The script that pulls Jira data |
| `.github/workflows/daily-refresh.yml` | GitHub Action running daily at 8am |
| `team-resources/skills/` | Claude skill files for the team |
| `team-resources/context/` | Team context Claude should know |
| `team-resources/config/` | MCP config templates |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP not connecting | Restart Claude Desktop. Check Node is installed: `node --version` |
| Jira auth failing | Regenerate your API token at id.atlassian.com |
| Filesystem not found | Check the path in config matches exactly where you cloned the repo |
| `npx` not found | Change `/opt/homebrew/bin/npx` to the output of `which npx` in Terminal |
| Connectors not working | Make sure you're using the desktop app, not browser |

---

## Questions?

Slack DM **Dheeraj Rai** or post in **#chardonnay-product**.

This guide is a living document — if you find something that doesn't work or a better way to do something, raise a PR.
