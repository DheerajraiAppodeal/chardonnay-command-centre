import { useState, useRef, useEffect } from "react";
import { FEATURE_ROADMAP } from "../roadmapData.js";

// ── Date Math ─────────────────────────────────────────────────────────────
// Day 0 = Mon Apr 21 2026 (project start)
// We work in WORK DAYS (Mon–Fri only). weekStart × 5 = day index.
const PROJECT_START = new Date("2026-04-21"); // Monday

function addWorkDays(date, days) {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
}

// Build the full day list: 10 weeks × 5 work days = 50 work days
const ALL_DAYS = [];
{
  let d = new Date(PROJECT_START);
  while (ALL_DAYS.length < 50) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      ALL_DAYS.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
}

// Today's index in ALL_DAYS
const TODAY = new Date("2026-04-23");
const TODAY_IDX = ALL_DAYS.findIndex(d =>
  d.getFullYear() === TODAY.getFullYear() &&
  d.getMonth() === TODAY.getMonth() &&
  d.getDate() === TODAY.getDate()
);

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDay(d) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// Group days by week (each group = 5 work days)
const WEEK_GROUPS = [];
for (let w = 0; w < 10; w++) {
  const days = ALL_DAYS.slice(w * 5, w * 5 + 5);
  const first = days[0], last = days[4];
  WEEK_GROUPS.push({
    weekIdx: w,
    label: `${MONTH_NAMES[first.getMonth()]} W${Math.ceil(first.getDate() / 7)}`,
    shortLabel: `${first.getDate()}–${last.getDate()} ${MONTH_NAMES[first.getMonth()]}`,
    days,
    startDay: w * 5,
  });
}

// ── Layout Constants ──────────────────────────────────────────────────────
const DAY_W   = 38;   // px per work day column
const LABEL_W = 150;  // left label area
const ROW_H   = 26;   // px per track row
const GROUP_H = 32;   // px for version group header
const FEAT_H  = 28;   // px for feature name row
const TRACK_GAP = 2;  // gap between track rows

const WINDOW_DAYS = 20; // 4 weeks = 20 work days visible at once

// ── Status config ─────────────────────────────────────────────────────────
const S = {
  "not-started": { label: "Not started", bar: "#CBD0DC", text: "#8B93A8", alpha: "22" },
  "in-progress":  { label: "In progress", bar: "#4A7BB5", text: "#4A7BB5", alpha: "18" },
  "review":       { label: "Review",      bar: "#F4A428", text: "#B07020", alpha: "18" },
  "done":         { label: "Done",        bar: "#3E9E6A", text: "#2E8A5A", alpha: "18" },
  "blocked":      { label: "Blocked",     bar: "#C05040", text: "#8A3828", alpha: "18" },
  "live":         { label: "Live",        bar: "#3E9E6A", text: "#2E8A5A", alpha: "18" },
};

const TRACKS = ["design", "art", "techArt", "dev", "qa"];
const TRACK_META = {
  design:  { label: "Design",   color: "#7A6EA8" },
  art:     { label: "Art",      color: "#E8922A" },
  techArt: { label: "Tech Art", color: "#5A8F6A" },
  dev:     { label: "Dev",      color: "#4A7BB5" },
  qa:      { label: "QA",       color: "#B05080" },
};

// ── Small helpers ─────────────────────────────────────────────────────────
function Pill({ label, color, bg, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: small ? 9 : 10, fontWeight: 700,
      padding: small ? "1px 5px" : "2px 8px", borderRadius: 99,
      background: bg, color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ── Day Grid background ───────────────────────────────────────────────────
function DayGrid({ windowStart, T }) {
  return (
    <>
      {ALL_DAYS.slice(windowStart, windowStart + WINDOW_DAYS).map((day, i) => {
        const absIdx = windowStart + i;
        const isToday = absIdx === TODAY_IDX;
        const isMon = i % 5 === 0;
        return (
          <div key={i} style={{
            position: "absolute", left: LABEL_W + i * DAY_W, top: 0, bottom: 0,
            width: DAY_W,
            borderLeft: isMon ? `1.5px solid ${T.border}` : `1px solid ${T.isDark ? "#1E2A3A" : "#ECEEf2"}`,
            background: isToday
              ? "rgba(244,164,40,0.06)"
              : i % 2 === 0 ? "transparent" : (T.isDark ? "rgba(255,255,255,0.008)" : "rgba(0,0,0,0.008)"),
            pointerEvents: "none",
          }} />
        );
      })}
    </>
  );
}

// ── Version Group Header ──────────────────────────────────────────────────
function VersionHeader({ label, color, features, T, windowStart, expanded, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: "flex", alignItems: "center",
      height: GROUP_H, cursor: "pointer",
      background: T.isDark ? "#0F1520" : "#F7F8FA",
      borderTop: `2px solid ${color}`,
      borderBottom: `1px solid ${T.border}`,
      position: "sticky", top: 0, zIndex: 10,
    }}>
      {/* Left label */}
      <div style={{
        width: LABEL_W, flexShrink: 0, paddingLeft: 12,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 10, color: T.faint }}>{expanded ? "▾" : "▸"}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "-0.01em" }}>{label}</span>
        <span style={{ fontSize: 9, color: T.faint }}>({features.length})</span>
      </div>
      {/* Timeline background */}
      <div style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden" }}>
        {/* Version span bar */}
        {features.length > 0 && (() => {
          const minDay = Math.min(...features.map(f =>
            Math.min(...TRACKS.map(t => f.tracks[t]?.weekStart ?? 99).filter(v => v !== 99))
          )) * 5;
          const maxDay = Math.max(...features.map(f =>
            Math.max(...TRACKS.map(t => f.tracks[t]?.weekEnd ?? 0))
          )) * 5;
          const leftPx = (minDay - windowStart) * DAY_W;
          const widthPx = (maxDay - minDay) * DAY_W;
          if (widthPx <= 0 || leftPx + widthPx < 0 || leftPx > WINDOW_DAYS * DAY_W) return null;
          return (
            <div style={{
              position: "absolute",
              left: Math.max(0, leftPx),
              width: Math.min(widthPx, WINDOW_DAYS * DAY_W - Math.max(0, leftPx)),
              top: 8, height: GROUP_H - 16,
              background: color + "28", borderRadius: 4,
              border: `1px solid ${color}44`,
              pointerEvents: "none",
            }} />
          );
        })()}
      </div>
    </div>
  );
}

// ── Feature Row ───────────────────────────────────────────────────────────
function FeatureRow({ feature, gameColor, T, windowStart, isSelected, onSelect }) {
  const hasRisk = feature.risks?.length > 0;

  return (
    <div style={{ borderBottom: `1px solid ${T.isDark ? "#141C28" : "#F0F2F5"}` }}>
      {/* Feature name row */}
      <div
        onClick={() => onSelect(isSelected ? null : feature.id)}
        style={{
          display: "flex", alignItems: "center",
          height: FEAT_H, cursor: "pointer",
          background: isSelected ? (gameColor + "12") : "transparent",
          transition: "background 0.1s",
        }}
      >
        <div style={{
          width: LABEL_W, flexShrink: 0, paddingLeft: 20,
          display: "flex", alignItems: "center", gap: 5, overflow: "hidden",
        }}>
          {hasRisk && <span style={{ fontSize: 9, color: "#C05040", flexShrink: 0 }}>⚠</span>}
          <span style={{ fontSize: 11, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {feature.name}
          </span>
        </div>
        {/* Feature span indicator on timeline */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          {(() => {
            const allTrackDays = TRACKS.flatMap(t => {
              const tr = feature.tracks[t];
              if (!tr || tr.status === "not-started") return [];
              return [tr.weekStart * 5, tr.weekEnd * 5];
            });
            if (allTrackDays.length === 0) return null;
            const minDay = Math.min(...allTrackDays);
            const maxDay = Math.max(...allTrackDays);
            const left = (minDay - windowStart) * DAY_W;
            const width = (maxDay - minDay) * DAY_W;
            if (width <= 0) return null;
            return (
              <div style={{
                position: "absolute",
                left: Math.max(0, left) + 2,
                width: Math.max(4, width - 4),
                top: "50%", transform: "translateY(-50%)",
                height: 3, borderRadius: 99,
                background: gameColor + "40",
                pointerEvents: "none",
              }} />
            );
          })()}
        </div>
      </div>

      {/* Track rows */}
      {TRACKS.map(track => {
        const td = feature.tracks[track] || { status: "not-started", weekStart: 0, weekEnd: 0 };
        const style = S[td.status] || S["not-started"];
        const tm = TRACK_META[track];
        const people = td.people || [];
        const isActive = td.status !== "not-started";

        // Pixel position within the 20-day window
        const dayStart = td.weekStart * 5;
        const dayEnd   = td.weekEnd * 5;
        const leftPx   = (dayStart - windowStart) * DAY_W;
        const widthPx  = Math.max((dayEnd - dayStart) * DAY_W, isActive ? DAY_W : 0);

        // Clip to visible window
        const clippedLeft  = Math.max(0, leftPx);
        const clippedRight = Math.min(WINDOW_DAYS * DAY_W, leftPx + widthPx);
        const clippedWidth = clippedRight - clippedLeft;
        const visible = isActive && clippedWidth > 0;

        return (
          <div key={track} style={{
            display: "flex", alignItems: "center",
            height: ROW_H, marginBottom: TRACK_GAP,
          }}>
            {/* Track label */}
            <div style={{
              width: LABEL_W, flexShrink: 0, paddingLeft: 28,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: tm.color, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ fontSize: 9, color: T.faint, fontWeight: 600 }}>{tm.label}</span>
            </div>

            {/* Timeline bar */}
            <div style={{ flex: 1, position: "relative", height: "100%", overflow: "visible" }}>
              {visible ? (
                <div style={{
                  position: "absolute",
                  left: clippedLeft + 2,
                  width: clippedWidth - 4,
                  top: 3, height: ROW_H - 6,
                  background: style.bar,
                  borderRadius: 4,
                  opacity: td.status === "done" || td.status === "live" ? 0.7 : 0.9,
                  display: "flex", alignItems: "center",
                  paddingLeft: 6, overflow: "hidden",
                  boxShadow: `0 1px 3px ${style.bar}44`,
                  transition: "opacity 0.15s",
                }}>
                  {/* People + status label */}
                  {clippedWidth > 40 && (
                    <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {people.length > 0 ? people.slice(0, 2).join(", ") : style.label}
                    </span>
                  )}
                  {/* Status icon for narrow bars */}
                  {clippedWidth <= 40 && clippedWidth > 10 && (
                    <span style={{ fontSize: 9, color: "#fff" }}>
                      {td.status === "done" ? "✓" : td.status === "review" ? "↻" : td.status === "blocked" ? "!" : "▶"}
                    </span>
                  )}
                </div>
              ) : td.status === "not-started" ? (
                <div style={{
                  position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
                  fontSize: 8, color: T.faint, fontStyle: "italic", opacity: 0.5,
                }}>—</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Detail Side Panel ─────────────────────────────────────────────────────
function DetailPanel({ feature, gameColor, T, onClose }) {
  if (!feature) return null;
  const style = S[feature.status] || S["not-started"];

  return (
    <div style={{
      width: 260, flexShrink: 0,
      background: T.panelBg, border: `1px solid ${T.panelBorder}`,
      borderRadius: 12, padding: "16px 14px",
      alignSelf: "start", position: "sticky", top: 80,
      maxHeight: "calc(100vh - 120px)", overflowY: "auto",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.panelText, marginBottom: 3 }}>{feature.name}</div>
          {feature.subtitle && <div style={{ fontSize: 10, color: T.panelMuted }}>{feature.subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.panelMuted, cursor: "pointer", fontSize: 16, padding: "0 0 0 8px" }}>×</button>
      </div>

      {/* Meta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { l: "Version",   v: feature.version    || "—" },
          { l: "Target",    v: feature.targetMonth || "—" },
          { l: "KPI",       v: feature.kpiTarget   || "—" },
          { l: "Status",    v: style.label },
        ].map(x => (
          <div key={x.l}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{x.l}</div>
            <div style={{ fontSize: 11, color: T.panelText }}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* Tracks */}
      <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Tracks</div>
      {TRACKS.map(track => {
        const td = feature.tracks[track] || { status: "not-started" };
        const tm = TRACK_META[track];
        const st = S[td.status] || S["not-started"];
        const people = td.people || [];
        const pct = td.status === "done" || td.status === "live" ? 100
          : td.status === "review" ? 80 : td.status === "in-progress" ? 50
          : td.status === "blocked" ? 20 : 0;
        return (
          <div key={track} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: tm.color }}>{tm.label}</span>
              <Pill label={st.label} color={st.text} bg={st.bar + "28"} small />
            </div>
            <div style={{ height: 4, borderRadius: 99, background: T.isDark ? "#1C2535" : "#E8ECF2", marginBottom: 3 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: st.bar, borderRadius: 99 }} />
            </div>
            {people.length > 0 && <div style={{ fontSize: 9, color: T.panelMuted }}>{people.join(", ")}</div>}
            {td.note && <div style={{ fontSize: 9, color: st.text, marginTop: 1, fontStyle: "italic" }}>{td.note}</div>}
          </div>
        );
      })}

      {/* Risks */}
      {feature.risks?.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#C05040", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 12, marginBottom: 6 }}>Risks</div>
          {feature.risks.map((r, i) => (
            <div key={i} style={{ fontSize: 9, color: "#C05040", background: "#FCEAE6", padding: "5px 8px", borderRadius: 6, marginBottom: 4, lineHeight: 1.4 }}>⚠ {r}</div>
          ))}
        </>
      )}

      {feature.jiraEpic && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.panelBorder}` }}>
          <a href={`https://appodeal.atlassian.net/browse/${feature.jiraEpic}`}
             target="_blank" rel="noreferrer"
             style={{ fontSize: 10, color: "#60A8D8", textDecoration: "none", fontWeight: 700 }}>
            ↗ {feature.jiraEpic} in Jira
          </a>
        </div>
      )}
    </div>
  );
}

// ── Resource Swimlane View ─────────────────────────────────────────────────
function ResourceView({ features, T, windowStart }) {
  // Build person → [{ feature, track, trackData }]
  const personMap = {};
  features.forEach(feat => {
    TRACKS.forEach(track => {
      const td = feat.tracks[track];
      if (!td || td.status === "not-started") return;
      (td.people || []).forEach(person => {
        if (!personMap[person]) personMap[person] = [];
        personMap[person].push({ feat, track, td });
      });
    });
  });

  const people = Object.entries(personMap).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      {people.map(([person, assignments]) => {
        const load = assignments.filter(a => a.td.status === "in-progress").length;
        const loadColor = load <= 1 ? "#3E9E6A" : load === 2 ? "#F4A428" : "#C05040";
        return (
          <div key={person} style={{ borderBottom: `1px solid ${T.border}`, marginBottom: 2 }}>
            {/* Person header */}
            <div style={{ display: "flex", alignItems: "center", height: FEAT_H }}>
              <div style={{ width: LABEL_W, flexShrink: 0, paddingLeft: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: loadColor + "30", border: `1.5px solid ${loadColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: loadColor }}>{person.charAt(0)}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{person}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: loadColor, background: loadColor + "20", padding: "1px 5px", borderRadius: 99 }}>{load}</span>
              </div>
              <div style={{ flex: 1 }} />
            </div>
            {/* Assignment bars */}
            {assignments.map((a, i) => {
              const style = S[a.td.status] || S["not-started"];
              const tm = TRACK_META[a.track];
              const dayStart = a.td.weekStart * 5;
              const dayEnd   = a.td.weekEnd * 5;
              const leftPx   = (dayStart - windowStart) * DAY_W;
              const widthPx  = Math.max((dayEnd - dayStart) * DAY_W, DAY_W);
              const clippedLeft  = Math.max(0, leftPx);
              const clippedRight = Math.min(WINDOW_DAYS * DAY_W, leftPx + widthPx);
              const clippedWidth = clippedRight - clippedLeft;
              if (clippedWidth <= 0) return null;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", height: ROW_H, marginBottom: TRACK_GAP }}>
                  <div style={{ width: LABEL_W, flexShrink: 0, paddingLeft: 36 }}>
                    <span style={{ fontSize: 9, color: tm.color, fontWeight: 600 }}>{tm.label}</span>
                    <span style={{ fontSize: 9, color: T.faint }}> — {a.feat.name}</span>
                  </div>
                  <div style={{ flex: 1, position: "relative", height: "100%" }}>
                    <div style={{
                      position: "absolute", left: clippedLeft + 2, width: clippedWidth - 4,
                      top: 3, height: ROW_H - 6,
                      background: style.bar, borderRadius: 4, opacity: 0.85,
                      display: "flex", alignItems: "center", paddingLeft: 6, overflow: "hidden",
                    }}>
                      {clippedWidth > 50 && (
                        <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {a.feat.version} · {a.feat.name.substring(0, 18)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Roadmap Page ──────────────────────────────────────────────────────
export default function RoadmapPage({ T }) {
  const [game, setGame]         = useState("wm");
  const [selected, setSelected] = useState(null);
  const [windowStart, setWindowStart] = useState(Math.max(0, TODAY_IDX - 2)); // show today near left
  const [viewMode, setViewMode]  = useState("features"); // "features" | "resources"
  const [collapsed, setCollapsed] = useState({});
  const [versionFilter, setVersionFilter] = useState("all");

  const features = FEATURE_ROADMAP[game] || [];
  const gameColor = game === "wm" ? T.wm : T.sol;
  const selectedFeature = selected ? features.find(f => f.id === selected) : null;

  // Group features by version
  const versionGroups = features.reduce((acc, f) => {
    const key = f.version || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  const versions = Object.keys(versionGroups);
  const filteredGroups = versionFilter === "all"
    ? versionGroups
    : { [versionFilter]: versionGroups[versionFilter] || [] };

  // Version colours (cycle through a palette)
  const VERSION_COLORS = ["#4A7BB5","#3E9E6A","#7A6EA8","#C27A3A","#B05080","#4A9A9A"];
  const versionColorMap = {};
  versions.forEach((v, i) => { versionColorMap[v] = VERSION_COLORS[i % VERSION_COLORS.length]; });

  const canPrev = windowStart > 0;
  const canNext = windowStart + WINDOW_DAYS < ALL_DAYS.length;

  const visibleDays = ALL_DAYS.slice(windowStart, windowStart + WINDOW_DAYS);
  // Group visible days into weeks
  const visibleWeeks = [];
  visibleDays.forEach((day, i) => {
    const absIdx = windowStart + i;
    const weekIdx = Math.floor(absIdx / 5);
    if (visibleWeeks.length === 0 || visibleWeeks[visibleWeeks.length - 1].weekIdx !== weekIdx) {
      visibleWeeks.push({ weekIdx, days: [{ day, relIdx: i }], label: WEEK_GROUPS[weekIdx]?.label || "" });
    } else {
      visibleWeeks[visibleWeeks.length - 1].days.push({ day, relIdx: i });
    }
  });

  const totalFeatures = Object.values(filteredGroups).flat().length;
  const inProgress    = features.filter(f => ["in-progress","live"].includes(f.status)).length;
  const atRisk        = features.filter(f => f.risks?.length > 0).length;

  const TOTAL_TIMELINE_W = WINDOW_DAYS * DAY_W;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

      {/* ── Main panel ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { v: features.length,  l: "Q2 Features",  s: game === "wm" ? "Word Maker" : "Solitaire", ck: "accent" },
            { v: inProgress,       l: "In Progress",  s: "Active features",                           ck: "ok"     },
            { v: atRisk,           l: "At Risk",       s: "Flags or blockers",                         ck: atRisk > 0 ? "caution" : "ok" },
            { v: WEEK_GROUPS[Math.floor(TODAY_IDX / 5)]?.label || "—", l: "Current Week", s: formatDay(TODAY), ck: "sol" },
          ].map(k => (
            <div key={k.l} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `3px solid ${T[k.ck]}`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: T[k.ck], lineHeight: 1.2 }}>{k.v}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, margin: "2px 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</div>
              <div style={{ fontSize: 9, color: T.faint }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Game */}
          {["wm","sol"].map(g => (
            <button key={g} onClick={() => { setGame(g); setSelected(null); setVersionFilter("all"); }} style={{
              padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
              border: `1.5px solid ${game===g ? (g==="wm"?T.wm:T.sol) : T.border}`,
              background: game===g ? (g==="wm"?T.wm:T.sol)+"18" : T.surface,
              color: game===g ? (g==="wm"?T.wm:T.sol) : T.muted,
            }}>{g==="wm"?"Word Maker":"Solitaire"}</button>
          ))}

          <div style={{ width: 1, height: 18, background: T.border }} />

          {/* View mode */}
          {[{ id:"features",label:"⊟ Features"},{id:"resources",label:"👥 By Person"}].map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)} style={{
              padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
              border: `1.5px solid ${viewMode===v.id ? T.accent : T.border}`,
              background: viewMode===v.id ? T.navActiveBg : T.surface,
              color: viewMode===v.id ? T.accent : T.muted,
            }}>{v.label}</button>
          ))}

          {/* Navigation */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setWindowStart(Math.max(0, windowStart - WINDOW_DAYS))} disabled={!canPrev}
              style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 6, cursor: canPrev?"pointer":"default", border: `1px solid ${T.border}`, background: T.surface, color: canPrev?T.text:T.faint }}>
              ← Prev
            </button>
            <button onClick={() => setWindowStart(Math.max(0, TODAY_IDX - 2))}
              style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: `1.5px solid ${T.accent}`, background: T.navActiveBg, color: T.accent }}>
              Today
            </button>
            <button onClick={() => setWindowStart(Math.min(ALL_DAYS.length - WINDOW_DAYS, windowStart + WINDOW_DAYS))} disabled={!canNext}
              style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 6, cursor: canNext?"pointer":"default", border: `1px solid ${T.border}`, background: T.surface, color: canNext?T.text:T.faint }}>
              Next →
            </button>
          </div>
        </div>

        {/* Version filter pills */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setVersionFilter("all")} style={{
            padding: "2px 10px", fontSize: 9, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1px solid ${versionFilter==="all" ? gameColor : T.border}`,
            background: versionFilter==="all" ? gameColor+"18" : T.surface,
            color: versionFilter==="all" ? gameColor : T.faint,
          }}>All</button>
          {versions.map(v => (
            <button key={v} onClick={() => setVersionFilter(v)} style={{
              padding: "2px 10px", fontSize: 9, fontWeight: 700, borderRadius: 99, cursor: "pointer",
              border: `1px solid ${versionFilter===v ? versionColorMap[v] : T.border}`,
              background: versionFilter===v ? versionColorMap[v]+"18" : T.surface,
              color: versionFilter===v ? versionColorMap[v] : T.faint,
            }}>{v}</button>
          ))}
          <span style={{ fontSize: 9, color: T.faint, marginLeft: 4 }}>{totalFeatures} features</span>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {Object.entries(S).map(([status, st]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: T.muted }}>
              <div style={{ width: 10, height: 6, borderRadius: 2, background: st.bar }} />
              {st.label}
            </div>
          ))}
        </div>

        {/* ── Timeline Grid ── */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>

          {/* Header: Week labels */}
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.isDark ? "#0C1220" : "#F4F6F9", position: "sticky", top: 56, zIndex: 20 }}>
            <div style={{ width: LABEL_W, flexShrink: 0, padding: "6px 12px", fontSize: 9, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Feature / Track
            </div>
            <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
              {visibleWeeks.map((wg, wi) => (
                <div key={wi} style={{
                  width: wg.days.length * DAY_W, flexShrink: 0,
                  padding: "4px 6px", fontSize: 9, fontWeight: 700,
                  color: wg.weekIdx === Math.floor(TODAY_IDX/5) ? T.accent : T.faint,
                  borderLeft: `1px solid ${T.border}`,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {wg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Header: Day labels */}
          <div style={{ display: "flex", borderBottom: `2px solid ${T.border}`, background: T.isDark ? "#0C1220" : "#F4F6F9", position: "sticky", top: 80, zIndex: 20 }}>
            <div style={{ width: LABEL_W, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex" }}>
              {visibleDays.map((day, i) => {
                const absIdx = windowStart + i;
                const isToday = absIdx === TODAY_IDX;
                const isMon = i % 5 === 0;
                return (
                  <div key={i} style={{
                    width: DAY_W, flexShrink: 0, textAlign: "center", padding: "3px 2px",
                    borderLeft: isMon ? `1.5px solid ${T.border}` : `1px solid ${T.isDark?"#1A2535":"#ECEEf2"}`,
                    background: isToday ? "rgba(244,164,40,0.12)" : "transparent",
                  }}>
                    <div style={{ fontSize: 8, fontWeight: isToday ? 700 : 400, color: isToday ? T.accent : T.faint }}>
                      {DAY_NAMES[i % 5]}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: isToday ? 700 : 600, color: isToday ? T.accent : T.text }}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div style={{ position: "relative" }}>
            {/* Today column highlight */}
            {TODAY_IDX >= windowStart && TODAY_IDX < windowStart + WINDOW_DAYS && (
              <div style={{
                position: "absolute",
                left: LABEL_W + (TODAY_IDX - windowStart) * DAY_W,
                top: 0, bottom: 0, width: DAY_W,
                background: "rgba(244,164,40,0.05)",
                pointerEvents: "none", zIndex: 1,
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: T.accent, opacity: 0.6 }} />
              </div>
            )}

            {viewMode === "features" ? (
              Object.entries(filteredGroups).map(([version, feats]) => {
                const vColor = versionColorMap[version] || gameColor;
                const isCollapsed = collapsed[version];
                return (
                  <div key={version}>
                    <VersionHeader
                      label={version} color={vColor} features={feats} T={T}
                      windowStart={windowStart} expanded={!isCollapsed}
                      onToggle={() => setCollapsed(c => ({ ...c, [version]: !c[version] }))}
                    />
                    {!isCollapsed && feats.map(feature => (
                      <FeatureRow
                        key={feature.id} feature={feature} gameColor={vColor} T={T}
                        windowStart={windowStart}
                        isSelected={selected === feature.id}
                        onSelect={setSelected}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <ResourceView
                features={Object.values(filteredGroups).flat()}
                T={T} windowStart={windowStart}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selectedFeature && (
        <DetailPanel feature={selectedFeature} gameColor={gameColor} T={T} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
