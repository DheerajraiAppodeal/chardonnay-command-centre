import { useState, useContext, createContext } from "react";
import { FEATURE_ROADMAP, TRACK_LABELS, TRACK_STATUS_CONFIG } from "../roadmapData.js";

// ── Consume theme from parent App ─────────────────────────────────────────
// ThemeCtx is exported from App.jsx — imported here via prop or context
// We receive T (theme) as a prop for simplicity

// ── Constants ─────────────────────────────────────────────────────────────
const TRACKS = ["design", "art", "dev", "techArt", "qa"];
const TRACK_DISPLAY = {
  design:  { label: "Design",   icon: "✦" },
  art:     { label: "Art",      icon: "🎨" },
  dev:     { label: "Dev",      icon: "⚙️" },
  techArt: { label: "Tech Art", icon: "🔧" },
  qa:      { label: "QA",       icon: "✓"  },
};

const STATUS_STYLE = {
  "not-started": { label: "Not started", bar: "#D8DCE5", text: "#8B93A8", bg: "transparent" },
  "in-progress":  { label: "In progress", bar: "#4A7BB5", text: "#4A7BB5", bg: "#EEF4FB"    },
  "review":       { label: "Review",      bar: "#F4A428", text: "#B07020", bg: "#FEF5E8"    },
  "done":         { label: "Done",        bar: "#3E9E6A", text: "#2E8A5A", bg: "#E8F5EE"    },
  "blocked":      { label: "Blocked",     bar: "#C05040", text: "#8A3828", bg: "#FCEAE6"    },
  "live":         { label: "Live",        bar: "#3E9E6A", text: "#2E8A5A", bg: "#E8F5EE"    },
};

// Weeks starting from Apr 21 2026 — 10 weeks covers Apr–Jun
const WEEKS = [
  { label: "Apr W3", start: "Apr 21" },
  { label: "Apr W4", start: "Apr 28" },
  { label: "May W1", start: "May 5"  },
  { label: "May W2", start: "May 12" },
  { label: "May W3", start: "May 19" },
  { label: "May W4", start: "May 26" },
  { label: "Jun W1", start: "Jun 2"  },
  { label: "Jun W2", start: "Jun 9"  },
  { label: "Jun W3", start: "Jun 16" },
  { label: "Jun W4", start: "Jun 23" },
];

// Resource people per track
const TRACK_PEOPLE = {
  design:  ["Didara", "Srikanth", "Giulia"],
  art:     ["Henrique", "Guillem", "Juan Z"],
  dev:     ["Toni", "Víctor", "Juan S", "Angel", "Murat", "Yevhenii"],
  techArt: ["Juan Z"],
  qa:      ["Krish", "Andreu"],
};

// ── Sub-components ────────────────────────────────────────────────────────

function StatusPill({ status, small = false }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["not-started"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: small ? 9 : 10, fontWeight: 700,
      padding: small ? "1px 6px" : "2px 9px",
      borderRadius: 99,
      background: s.bg || "#F0F2F5",
      color: s.text,
      border: `1px solid ${s.bar}22`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.bar, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function TrackBar({ status, note, showNote = false }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["not-started"];
  const pct = status === "done" || status === "live" ? 100
            : status === "review" ? 80
            : status === "in-progress" ? 50
            : status === "blocked" ? 30
            : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 6, borderRadius: 99, background: "#E8ECF2", overflow: "hidden", minWidth: 60 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: s.bar, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
      {showNote && note && (
        <div style={{ fontSize: 9, color: "#8B93A8", lineHeight: 1.3 }}>{note}</div>
      )}
    </div>
  );
}

// ── Feature Card (list view) ───────────────────────────────────────────────
function FeatureCard({ feature, gameColor, T, onClick, selected }) {
  const allTracks = Object.values(feature.tracks);
  const doneCount = allTracks.filter(t => t.status === "done" || t.status === "live").length;
  const totalPct = Math.round((doneCount / allTracks.length) * 100);
  const hasRisk = feature.risks?.length > 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? (T.isDark ? "#1A2130" : "#F7F9FF") : T.surface,
        border: `1px solid ${selected ? gameColor : T.border}`,
        borderLeft: `3px solid ${hasRisk ? "#C05040" : gameColor}`,
        borderRadius: "0 10px 10px 0",
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.15s",
        marginBottom: 8,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{feature.name}</span>
            {feature.version && (
              <span style={{ fontSize: 9, fontWeight: 700, color: gameColor, background: gameColor + "18", padding: "1px 6px", borderRadius: 99 }}>
                {feature.version}
              </span>
            )}
            {hasRisk && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "#C05040", background: "#FCEAE6", padding: "1px 6px", borderRadius: 99 }}>
                ⚠ Risk
              </span>
            )}
          </div>
          {feature.subtitle && (
            <div style={{ fontSize: 10, color: T.faint }}>{feature.subtitle}</div>
          )}
        </div>
        <StatusPill status={feature.status} />
      </div>

      {/* Track bars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {TRACKS.map(track => {
          const t = feature.tracks[track] || { status: "not-started", note: "" };
          const d = TRACK_DISPLAY[track];
          return (
            <div key={track} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {d.label}
              </div>
              <TrackBar status={t.status} note={t.note} />
              <div style={{ fontSize: 9, color: STATUS_STYLE[t.status]?.text || T.faint }}>
                {STATUS_STYLE[t.status]?.label || "—"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <div style={{ flex: 1, height: 3, background: T.surfaceAlt, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${totalPct}%`, height: "100%", background: gameColor, borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: T.muted }}>{totalPct}% complete</span>
        <span style={{ fontSize: 10, color: T.faint }}>{feature.targetMonth}</span>
      </div>
    </div>
  );
}

// ── Timeline View ──────────────────────────────────────────────────────────
function TimelineView({ features, gameColor, T, game }) {
  // Map each feature+track to a week range based on status
  // This is a visual approximation — start/end weeks derived from status progression
  const getWeekRange = (featureIdx, trackKey) => {
    const feature = features[featureIdx];
    const trackStatus = feature.tracks[trackKey]?.status || "not-started";
    const trackOrder = TRACKS.indexOf(trackKey);
    const baseWeek = featureIdx * 2; // stagger features

    if (trackStatus === "not-started") return null;
    if (trackStatus === "done" || trackStatus === "live") {
      // Done — show in early weeks
      const start = Math.max(0, trackOrder - 1 + baseWeek);
      return { start: Math.min(start, 7), end: Math.min(start + 1, 8) };
    }
    if (trackStatus === "in-progress") {
      const start = trackOrder + baseWeek;
      return { start: Math.min(start, 7), end: Math.min(start + 2, 9) };
    }
    if (trackStatus === "review") {
      const start = trackOrder + baseWeek - 1;
      return { start: Math.min(start, 7), end: Math.min(start + 1, 9) };
    }
    if (trackStatus === "blocked") {
      const start = trackOrder + baseWeek;
      return { start: Math.min(start, 7), end: Math.min(start + 2, 9) };
    }
    return null;
  };

  const WEEK_W = 80; // px per week column
  const ROW_H = 28;  // px per track row
  const LABEL_W = 90; // left label column

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      {/* Week headers */}
      <div style={{ display: "flex", marginBottom: 4, marginLeft: LABEL_W }}>
        {WEEKS.map((w, i) => (
          <div key={i} style={{
            width: WEEK_W, flexShrink: 0, fontSize: 9, fontWeight: 700,
            color: i === 0 ? T.accent : T.faint,
            textTransform: "uppercase", letterSpacing: "0.06em", paddingLeft: 6,
            borderLeft: `1px solid ${T.border}`,
          }}>
            <div>{w.label}</div>
            <div style={{ fontWeight: 400, opacity: 0.7 }}>{w.start}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      {features.map((feature, fi) => (
        <div key={feature.id} style={{ marginBottom: 16 }}>
          {/* Feature name row */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <div style={{ width: LABEL_W, flexShrink: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {feature.name}
              </div>
              <div style={{ fontSize: 9, color: gameColor, fontWeight: 700 }}>{feature.version}</div>
            </div>
            {/* Timeline background stripe */}
            <div style={{ display: "flex", flex: 1, height: 2, background: T.surfaceAlt, borderRadius: 99 }}>
              {WEEKS.map((_, i) => (
                <div key={i} style={{ width: WEEK_W, flexShrink: 0, borderLeft: `1px solid ${T.border}` }} />
              ))}
            </div>
          </div>

          {/* Track rows */}
          {TRACKS.map((track, ti) => {
            const trackData = feature.tracks[track] || { status: "not-started", note: "" };
            const range = getWeekRange(fi, track);
            const s = STATUS_STYLE[trackData.status] || STATUS_STYLE["not-started"];
            const d = TRACK_DISPLAY[track];
            const people = TRACK_PEOPLE[track] || [];

            return (
              <div key={track} style={{ display: "flex", alignItems: "center", marginBottom: 3, height: ROW_H }}>
                {/* Track label */}
                <div style={{ width: LABEL_W, flexShrink: 0, paddingRight: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 9, color: T.faint, width: 60, textAlign: "right", whiteSpace: "nowrap" }}>
                    {d.label}
                  </span>
                </div>

                {/* Timeline grid */}
                <div style={{ position: "relative", display: "flex", flex: 1 }}>
                  {/* Background grid lines */}
                  {WEEKS.map((_, i) => (
                    <div key={i} style={{
                      width: WEEK_W, flexShrink: 0, height: ROW_H,
                      borderLeft: `1px solid ${T.border}`,
                      background: i % 2 === 0 ? "transparent" : (T.isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"),
                    }} />
                  ))}

                  {/* Task bar */}
                  {range && trackData.status !== "not-started" && (
                    <div style={{
                      position: "absolute",
                      left: range.start * WEEK_W + 4,
                      width: (range.end - range.start) * WEEK_W - 8,
                      top: 4, height: ROW_H - 8,
                      background: s.bar,
                      borderRadius: 4,
                      opacity: 0.85,
                      display: "flex", alignItems: "center", paddingLeft: 6,
                      overflow: "hidden",
                      boxShadow: `0 1px 4px ${s.bar}44`,
                    }}>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {people.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Not started indicator */}
                  {(!range || trackData.status === "not-started") && (
                    <div style={{
                      position: "absolute",
                      left: 4, top: "50%", transform: "translateY(-50%)",
                      fontSize: 9, color: T.faint, fontStyle: "italic",
                    }}>
                      {trackData.status === "not-started" ? "not scheduled" : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Risk row */}
          {feature.risks?.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <div style={{ width: LABEL_W, flexShrink: 0 }} />
              <div style={{ fontSize: 9, color: "#C05040", fontWeight: 600 }}>
                ⚠ {feature.risks[0]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Resource Allocation Panel ──────────────────────────────────────────────
function ResourcePanel({ features, T }) {
  // Count how many features each person is on right now (in-progress tracks)
  const allocation = {};
  Object.entries(TRACK_PEOPLE).forEach(([track, people]) => {
    people.forEach(person => {
      if (!allocation[person]) allocation[person] = { active: 0, review: 0, tracks: [] };
    });
  });

  features.forEach(feature => {
    TRACKS.forEach(track => {
      const trackData = feature.tracks[track];
      if (!trackData) return;
      const people = TRACK_PEOPLE[track] || [];
      if (trackData.status === "in-progress") {
        people.forEach(p => {
          if (allocation[p]) {
            allocation[p].active++;
            allocation[p].tracks.push(`${feature.name} / ${TRACK_DISPLAY[track].label}`);
          }
        });
      }
      if (trackData.status === "review") {
        people.forEach(p => {
          if (allocation[p]) allocation[p].review++;
        });
      }
    });
  });

  const people = Object.entries(allocation).filter(([, v]) => v.active + v.review > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
      {people.map(([name, data]) => {
        const load = data.active + data.review;
        const loadColor = load === 0 ? T.faint : load === 1 ? T.ok : load === 2 ? T.warn : "#C05040";
        return (
          <div key={name} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px",
            borderTop: `2px solid ${loadColor}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: loadColor, background: loadColor + "18", padding: "1px 6px", borderRadius: 99 }}>
                {load} active
              </span>
            </div>
            {data.tracks.slice(0, 2).map((t, i) => (
              <div key={i} style={{ fontSize: 9, color: T.faint, marginBottom: 2 }}>· {t}</div>
            ))}
            {data.tracks.length > 2 && (
              <div style={{ fontSize: 9, color: T.faint }}>+ {data.tracks.length - 2} more</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Roadmap Page ──────────────────────────────────────────────────────
export default function RoadmapPage({ T }) {
  const [game, setGame]         = useState("wm");
  const [view, setView]         = useState("timeline"); // "timeline" | "cards"
  const [selected, setSelected] = useState(null);
  const [showResource, setShowResource] = useState(false);

  const features   = FEATURE_ROADMAP[game] || [];
  const gameColor  = game === "wm" ? T.wm : T.sol;
  const gameLabel  = game === "wm" ? "Word Maker" : "Solitaire";

  const allFeatures = [...(FEATURE_ROADMAP.wm || []), ...(FEATURE_ROADMAP.sol || [])];
  const selectedFeature = selected ? features.find(f => f.id === selected) : null;

  const inProgress = features.filter(f => f.status === "in-progress" || f.status === "live").length;
  const atRisk     = features.filter(f => f.risks?.length > 0).length;
  const onTrack    = features.filter(f => f.status === "live" || (f.status !== "blocked" && !f.risks?.length)).length;

  return (
    <div style={{ display: "grid", gap: 16 }}>

      {/* Header stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { v: features.length, l: "Features Q2", s: `${game === "wm" ? "Word Maker" : "Solitaire"}`, ck: "accent" },
          { v: inProgress,      l: "In progress", s: "Active features",                                ck: "ok"     },
          { v: atRisk,          l: "At risk",      s: "Have blockers or flags",                        ck: atRisk > 0 ? "caution" : "ok" },
          { v: onTrack,         l: "On track",     s: "No flags raised",                               ck: "ok"     },
        ].map(k => (
          <div key={k.l} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `3px solid ${T[k.ck]}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T[k.ck], lineHeight: 1.2 }}>{k.v}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, margin: "3px 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</div>
            <div style={{ fontSize: 10, color: T.faint }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {/* Game switcher */}
        {["wm", "sol"].map(g => (
          <button key={g} onClick={() => { setGame(g); setSelected(null); }} style={{
            padding: "5px 16px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${game === g ? (g === "wm" ? T.wm : T.sol) : T.border}`,
            background: game === g ? (g === "wm" ? T.wm + "18" : T.sol + "18") : T.surface,
            color: game === g ? (g === "wm" ? T.wm : T.sol) : T.muted,
          }}>
            {g === "wm" ? "Word Maker" : "Solitaire"}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: T.border, margin: "0 4px" }} />

        {/* View switcher */}
        {[
          { id: "timeline", label: "📅 Timeline" },
          { id: "cards",    label: "⊞ Cards"    },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${view === v.id ? T.accent : T.border}`,
            background: view === v.id ? T.navActiveBg : T.surface,
            color: view === v.id ? T.accent : T.muted,
          }}>
            {v.label}
          </button>
        ))}

        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => setShowResource(r => !r)} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${showResource ? T.accent : T.border}`,
            background: showResource ? T.navActiveBg : T.surface,
            color: showResource ? T.accent : T.muted,
          }}>
            👥 Resource load
          </button>
        </div>
      </div>

      {/* Resource allocation panel */}
      {showResource && (
        <div style={{ background: T.panelBg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${T.panelBorder}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Resource load — all active features
          </div>
          <ResourcePanel features={allFeatures} T={T} />
        </div>
      )}

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: selectedFeature ? "1fr 300px" : "1fr", gap: 12 }}>

        {/* Timeline or Cards */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: gameColor }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{gameLabel} — Q2 2026 Feature Roadmap</span>
            <span style={{ fontSize: 10, color: T.faint, marginLeft: "auto" }}>
              {features.length} features · Apr–Jun 2026
            </span>
          </div>

          {/* Track legend */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {Object.entries(STATUS_STYLE).map(([status, s]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.bar }} />
                {s.label}
              </div>
            ))}
          </div>

          {view === "timeline" ? (
            <TimelineView features={features} gameColor={gameColor} T={T} game={game} />
          ) : (
            <div>
              {features.map(f => (
                <FeatureCard
                  key={f.id}
                  feature={f}
                  gameColor={gameColor}
                  T={T}
                  selected={selected === f.id}
                  onClick={() => setSelected(selected === f.id ? null : f.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedFeature && (
          <div style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}`, borderRadius: 12, padding: "18px 16px", alignSelf: "start" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.panelText }}>{selectedFeature.name}</span>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: T.panelMuted, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>

            <div style={{ fontSize: 10, color: T.panelMuted, marginBottom: 14 }}>{selectedFeature.subtitle}</div>

            {/* Version + target */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { l: "Version",   v: selectedFeature.version      || "—" },
                { l: "Target",    v: selectedFeature.targetMonth   || "—" },
                { l: "Milestone", v: selectedFeature.milestone     || "—" },
                { l: "KPI target",v: selectedFeature.kpiTarget     || "—" },
              ].map(item => (
                <div key={item.l}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{item.l}</div>
                  <div style={{ fontSize: 11, color: T.panelText }}>{item.v}</div>
                </div>
              ))}
            </div>

            {/* Track breakdown */}
            <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Track status</div>
            {TRACKS.map(track => {
              const t = selectedFeature.tracks[track] || { status: "not-started", note: "" };
              const d = TRACK_DISPLAY[track];
              const s = STATUS_STYLE[t.status] || STATUS_STYLE["not-started"];
              const people = TRACK_PEOPLE[track] || [];
              return (
                <div key={track} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.panelText }}>{d.label}</span>
                    <StatusPill status={t.status} small />
                  </div>
                  <TrackBar status={t.status} note={t.note} showNote />
                  <div style={{ fontSize: 9, color: T.panelMuted, marginTop: 2 }}>
                    {people.join(", ")}
                  </div>
                  {t.note && <div style={{ fontSize: 9, color: s.text, marginTop: 2 }}>{t.note}</div>}
                </div>
              );
            })}

            {/* Risks */}
            {selectedFeature.risks?.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#C05040", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 14, marginBottom: 6 }}>Risks</div>
                {selectedFeature.risks.map((r, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#C05040", background: "#FCEAE6", padding: "5px 8px", borderRadius: 6, marginBottom: 4 }}>⚠ {r}</div>
                ))}
              </>
            )}

            {/* Jira epic link */}
            {selectedFeature.jiraEpic && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.panelBorder}` }}>
                <a href={`https://appodeal.atlassian.net/browse/${selectedFeature.jiraEpic}`}
                   target="_blank" rel="noreferrer"
                   style={{ fontSize: 10, color: T.sol, textDecoration: "none", fontWeight: 700 }}>
                  → {selectedFeature.jiraEpic} in Jira ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
