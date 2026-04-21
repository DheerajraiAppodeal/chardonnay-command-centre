# Skill: Jira Ops — Chardonnay Gaming
**Last updated:** 2026-04-21
**Use when:** Creating tickets, reviewing sprints, managing backlogs, or doing Jira governance work.

---

## Our Jira Projects

| Project | Key | Game |
|---------|-----|------|
| Chardonnay Solitaire | `CHSOL` | Solitaire |
| Word Maker | `WORD` | Word Maker |

Board: [appodeal.atlassian.net](https://appodeal.atlassian.net)

---

## Issue Types & When to Use Them

| Type | Use for |
|------|---------|
| **Epic** | Feature group spanning multiple weeks (e.g. "v5.8.0 Release", "Beginner's Bonus") |
| **Story** | Player-facing outcome — written from player perspective |
| **Task** | Implementation unit — dev, art, or config work |
| **Bug** | Confirmed defect. Always needs: priority, assignee, version label |

### Hierarchy
```
Epic: M8 — Jigsaw Puzzle
  └── Story: Player sees puzzle info popup
        ├── Task: [Dev] Build popup logic
        └── Task: [Art] Create popup assets
```

---

## Ticket Minimum Standard

### All tickets must have:
- Summary with prefix: `[Dev]`, `[Art]`, `[Bug]`, `[Config]`
- Assignee (set before work starts, not after)
- Priority: High / Medium / Low — never "Unset"
- Release label: e.g. `v5.8.0` or `1.48.0`
- One-sentence description minimum

### Before sending to QA, also add:
- Full description (what, why, context, links to design)
- Acceptance criteria (numbered, each item independently testable)
- Edge cases called out explicitly
- Status set to **"Ready for QA"** — not "In Progress"

---

## Team Members (for assignee field)

| Name | Role | Game |
|------|------|------|
| Toni Puig | Lead Dev | Word Maker |
| Víctor Romero | Developer | Word Maker |
| Juan Sabater | Dev / TA | Word Maker |
| Yevhenii Siechko | Tech Lead | Solitaire |
| Angel Miladinov | Developer | Solitaire |
| Murat Kacmaz | Developer | Solitaire |
| Henrique Nakajima | Artist | Solitaire |
| Guillem Urpí Montserrat | Artist | Solitaire |
| Juan Zambrana | Technical Artist | WM + Sol (rotation) |
| Krish Prabha | QA Lead | All games |
| Andreu Margarit | QA | WM + Sol |

---

## Useful JQL Queries

```
# All non-Done CHSOL tickets
project = CHSOL AND status != Done ORDER BY updated DESC

# Word Maker tickets updated this week
project = WORD AND updated >= -7d ORDER BY updated DESC

# Unassigned High priority bugs (any project)
project in (CHSOL, WORD) AND priority = High AND assignee is EMPTY

# Everything in Ready for QA
project in (CHSOL, WORD) AND status = "Ready for QA" ORDER BY updated DESC

# Crashlytics tickets
project = CHSOL AND labels = Crashlytics AND status != Done
```

---

## Hygiene Rules (non-negotiable)

- No ticket stays **In Progress** >7 days without a comment
- No **High** bug stays unassigned >48 hours
- Every ticket in QA must have acceptance criteria
- **Done** means done AND deployed — not just merged
- Backlog grooming: PM reviews weekly, removes dead tickets

---

## Creating a Good Ticket (prompt for Claude)

```
Create a Jira task in [CHSOL/WORD]:
Summary: [Dev/Art/Bug] Your title here
Assignee: Name
Priority: High / Medium / Low
Release label: vX.X.X
Description: What needs to be done and why. Link to any relevant tickets.
Acceptance criteria:
1. First testable criterion
2. Second testable criterion
3. QA smoke test description
```
