# Skill: Feature Spec → Jira Tickets
**Use when:** You have a feature idea or PM brief and need to turn it into properly structured Jira tickets.
**Who benefits most:** PMs (Didara, Srikanth, Giulia) — anyone who specs features.
**Time saved:** 30–60 minutes per feature vs writing tickets manually.

---

## The Prompt — Fill in the blanks and paste

```
I need to spec a feature for [Word Maker / Solitaire] and create Jira tickets for it.

Feature name:
[What we're calling it internally]

What the player experiences:
[2-3 sentences from the player's perspective — what they see, do, and feel]

Why we're building it:
[Retention / monetisation / engagement — and what metric we're targeting]

Scope (what's IN):
-
-
-

Scope (what's NOT in this sprint):
-
-

Dependencies or risks:
[Other tickets, team members, or unknowns that could block this]

Target release:
[e.g. v5.8.0 or 1.48.0]

From this, please:
1. Write one Epic ticket
2. Break it into individual Task tickets (one per dev/art deliverable)
3. For each Task, write a proper description and acceptance criteria
4. Suggest assignees based on the Chardonnay team
5. Flag any missing information I should clarify before we start
```

---

## What Claude will produce

For a typical feature you'll get:
- **1 Epic** — the container for all the work
- **3–8 Tasks** — one per dev or art deliverable, each with full description + AC
- **Assignee suggestions** — based on who owns what in the team
- **Flags** — missing info Claude spotted that you should resolve before starting

---

## Example output structure

```
EPIC: [Feature Name] — v5.8.0
  └── [Dev] Feature flag + remote config — Yevhenii
  └── [Dev] Core game logic — Murat  
  └── [Art] UI assets — Henrique
  └── [Dev] Analytics events — Angel
  └── [Dev] Save/restore state — Murat
  └── [QA] Smoke test checklist — Krish
```

---

## Tips

**For a quick spec** (you have 5 minutes):
```
Quick spec for [feature name] in [CHSOL/WORD]:
What it does: [one paragraph]
Target release: [version]
Create the Epic and main Tasks.
```

**To refine an existing spec:**
```
I have this feature description: [paste your notes]
Turn this into Jira-ready tickets for [CHSOL/WORD], target release [version].
```

**To check a spec before writing tickets:**
```
I'm about to spec [feature name]. What information am I probably missing
that will cause problems during development or QA?
```

---

## Before you copy tickets into Jira

Check each ticket has:
- [ ] `[Dev]` / `[Art]` / `[Config]` prefix in summary
- [ ] Assignee set
- [ ] Priority set (not Unset)
- [ ] Release label added (e.g. `v5.8.0`)
- [ ] Acceptance criteria are testable (each one independently verifiable)
- [ ] Epic link set on all Tasks

If any of these are missing, ask Claude to fill them in before copying.
