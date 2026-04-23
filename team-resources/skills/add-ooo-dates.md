# How to Add Your OOO / Holidays to the Roadmap

**File to edit:** `src/teamAvailability.js` in the chardonnay-command-centre repo

---

## Adding your OOO dates

Find your name in the `TEAM_OOO` object and add a date range:

```js
"Toni": [
  { start: "2026-05-25", end: "2026-05-29", note: "Annual leave" },
],
```

- `start` and `end` are dates in `YYYY-MM-DD` format
- For a single day, set `start` and `end` to the same date
- `note` is optional but helpful (e.g. "Sick", "Conference", "Paternity leave")
- Weekends are automatically excluded — no need to worry about them

---

## Multiple periods

```js
"Krish": [
  { start: "2026-05-01", end: "2026-05-01", note: "Labour Day" },
  { start: "2026-06-02", end: "2026-06-05", note: "Remote work — India" },
],
```

---

## Public holidays (already added)

The following are already in the file and apply automatically to the relevant team:

| Date       | Holiday            | Applies to          |
|------------|--------------------|---------------------|
| May 1      | Labour Day         | Barcelona + KZ      |
| May 7      | Defender's Day     | Didara (Kazakhstan) |
| May 9      | Victory Day        | Didara (Kazakhstan) |
| Jun 24     | Sant Joan          | Barcelona           |

---

## How it shows on the roadmap

- **Teal top stripe** on day columns = public holiday (whole team)
- **Red dots** on day columns = someone is OOO that day (hover to see who)
- **OOO summary bar** above the timeline = week-by-week summary
- **Track row** shows ⚠Nd warning if a person's OOO overlaps their active feature days
- **By Person view** shows OOO blocks inline with their assignments

---

## How to submit your dates

1. Edit `src/teamAvailability.js` directly on GitHub (pencil icon) or in your local clone
2. Add your dates to your name in `TEAM_OOO`
3. Commit with message: `data: [your name] OOO dates Q2`
4. Dashboard updates automatically on next deploy (~1 min)

Questions? Slack DM **Dheeraj Rai**
