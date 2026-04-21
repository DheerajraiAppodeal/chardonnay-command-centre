# Skill: Bug Report
**Use when:** You've found a bug and need to log it in Jira properly.
**Who benefits most:** Krish (QA), Srikanth, Didara — anyone logging bugs.
**Time saved:** ~10 minutes per bug vs writing from scratch.

---

## The Prompt — Fill in the blanks and paste

```
Create a Jira bug ticket in [CHSOL / WORD] with the following:

What broke:
[One sentence — what the player/user sees that is wrong]

Steps to reproduce:
1.
2.
3.

Expected behaviour:
[What should have happened]

Actual behaviour:
[What actually happened]

Device / version:
[e.g. Samsung Galaxy S21, Android 13, app v5.7.0]

How often does it happen:
[Always / Sometimes / Rare — and under what conditions]

Extra context:
[Screenshot link, Crashlytics link, Slack message, or "none"]

Suggested priority:
[High / Medium / Low — and why]
```

---

## What Claude will produce

A complete Jira-ready ticket with:
- Formatted summary with `[Bug]` prefix
- Full description with all the context above
- Acceptance criteria written for QA
- Suggested assignee based on the affected area
- Priority and release label recommendation

---

## Priority Guide

| Priority | Use when |
|----------|----------|
| **High** | Players can't complete a core action (crash, soft lock, broken purchase) |
| **Medium** | Feature is broken but there's a workaround |
| **Low** | Visual glitch, edge case, cosmetic issue |

**Never leave priority unset.** Unset = invisible in Krish's QA queue.

---

## Quick version (when you're in a hurry)

```
Log a bug in CHSOL:
What: [one sentence]
Steps: [brief]
Expected: [brief]
Actual: [brief]
Device: [model + Android version + app version]
Priority: [High/Medium/Low]
```

Claude will fill in the rest and format it properly.

---

## After Claude creates the ticket

- Copy the ticket summary + description into Jira
- Set assignee to the relevant dev (see team-context.md for who owns what)
- Add the release label (e.g. `v5.8.0`) — **this is mandatory**
- Change status to **Backlog** (or **In Progress** if already being fixed)
