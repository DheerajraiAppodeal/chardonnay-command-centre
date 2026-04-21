# Skill: Morning Brief
**Use when:** Start of your working day, before standup.
**Time it takes:** 30 seconds to paste, 2 minutes to read the output.

---

## The Prompt — Copy and paste this every morning

```
Morning brief for Chardonnay Gaming — [TODAY'S DATE]

Check the following and give me a concise summary:

JIRA:
- Any new tickets created in CHSOL or WORD since yesterday
- Any High priority tickets that are unassigned
- How many tickets are in "Ready for QA" across both projects
- Anything that moved to Done yesterday

SLACK:
- Any messages in #chardonnay-product overnight or this morning
- Any DMs or mentions I should know about
- Any blockers or urgent flags from the team

Format the output as:
🟢 Word Maker — [X tickets in QA, notable changes]
🔵 Solitaire — [X tickets in QA, notable changes]
⚠️ Flags — [anything needing action today]
💬 Slack — [anything worth knowing]
```

---

## What to do with the output

- **Flags section** → these are your standup talking points
- **QA count** → ping Krish if the queue is growing and she hasn't acknowledged it
- **Slack section** → respond to anything urgent before standup, not after
- **Nothing to flag** → great, standup will be fast

---

## Tips

- You can shorten it: just say **"morning brief"** and Claude will know what to do if you've loaded the team context file first
- Add **"focus on Solitaire only"** or **"Word Maker only"** if you only have a minute
- Add **"and summarise in one sentence per game"** if you want it even shorter
