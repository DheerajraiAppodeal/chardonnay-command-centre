// ── Team Availability & OOO Data ─────────────────────────────────────────
// HOW TO UPDATE:
//   1. Add your OOO dates to your name below
//   2. Format: { start: "YYYY-MM-DD", end: "YYYY-MM-DD", note: "reason" }
//   3. For a single day: start and end can be the same date
//   4. Commit the file — dashboard updates on next deploy
//
// LAST UPDATED: 2026-04-23
// ─────────────────────────────────────────────────────────────────────────

// Public holidays — shown as a full-day marker for affected offices
export const PUBLIC_HOLIDAYS = [
  // ── Q2 2026 — Spain (Barcelona team) ──────────────────────────────────
  { date: "2026-05-01", name: "Labour Day",  scope: "Barcelona", color: "#4A9A9A" },
  { date: "2026-06-24", name: "Sant Joan",   scope: "Barcelona", color: "#4A9A9A" },

  // ── Q2 2026 — Kazakhstan (Didara) ─────────────────────────────────────
  // May 1 already covered above (Labour Day also in KZ)
  { date: "2026-05-07", name: "Defender's Day (KZ)", scope: "Kazakhstan", color: "#7A6EA8" },
  { date: "2026-05-09", name: "Victory Day (KZ)",    scope: "Kazakhstan", color: "#7A6EA8" },
];

// Individual OOO — each person adds their own dates here
// People: Didara · Toni · Víctor · Juan S · Juan Z · Srikanth
//         Yevhenii · Angel · Murat · Henrique · Guillem · Krish · Andreu
export const TEAM_OOO = {
  "Didara":   [
    { start: "2026-05-07", end: "2026-05-07", note: "Defender's Day (KZ)" },
    { start: "2026-05-09", end: "2026-05-09", note: "Victory Day (KZ)" },
  ],
  "Toni":     [],
  "Víctor":   [],
  "Juan S":   [],
  "Juan Z":   [],
  "Srikanth": [],
  "Yevhenii": [],
  "Angel":    [],
  "Murat":    [],
  "Henrique": [],
  "Guillem":  [],
  "Krish":    [],
  "Andreu":   [],
};

// ── Helper: get all OOO dates for a person (returns Set of "YYYY-MM-DD") ─
export function getOOODates(person) {
  const dates = new Set();
  const ranges = TEAM_OOO[person] || [];
  ranges.forEach(({ start, end }) => {
    const s = new Date(start), e = new Date(end);
    const d = new Date(s);
    while (d <= e) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.add(d.toISOString().slice(0, 10));
      }
      d.setDate(d.getDate() + 1);
    }
  });
  // Add public holidays relevant to person
  const barcelonaTeam = ["Toni","Víctor","Juan S","Juan Z","Srikanth","Yevhenii","Angel","Murat","Henrique","Guillem","Krish","Andreu"];
  const kazTeam = ["Didara"];
  PUBLIC_HOLIDAYS.forEach(h => {
    if (h.scope === "Barcelona" && barcelonaTeam.includes(person)) dates.add(h.date);
    if (h.scope === "Kazakhstan" && kazTeam.includes(person)) dates.add(h.date);
    if (h.scope === "Barcelona" && kazTeam.includes(person)) dates.add(h.date); // Didara observes Labour Day too
  });
  return dates;
}

// ── Helper: get all people OOO on a given date ───────────────────────────
export function getOOOPeopleOnDate(dateStr) {
  return Object.keys(TEAM_OOO).filter(person => getOOODates(person).has(dateStr));
}

// ── Helper: is a date a public holiday? ──────────────────────────────────
export function getPublicHolidayOnDate(dateStr) {
  return PUBLIC_HOLIDAYS.filter(h => h.date === dateStr);
}
