import { useState } from "react";
import { FEATURE_ROADMAP } from "../roadmapData.js";

// ── Constants ─────────────────────────────────────────────────────────────
const TRACKS = ["design", "art", "techArt", "dev", "qa"];
const TRACK_DISPLAY = {
  design:  { label: "Design",   icon: "✦" },
  art:     { label: "Art",      icon: "🎨" },
  techArt: { label: "Tech Art", icon: "🔧" },
  dev:     { label: "Dev",      icon: "⚙️" },
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

// ── Helpers ───────────────────────────────────────────────────────────────
function StatusPill({ status, small = false }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["not-started"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: small ? 9 : 10, fontWeight: 700,
      padding: small ? "1px 6px" : "2px 9px", borderRadius: 99,
      background: s.bg || "#F0F2F5", color: s.text,
      border: `1px solid ${s.bar}22`, whiteSpace: "nowrap",
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
            : status === "blocked" ? 30 : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 6, borderRadius: 99, background: "#E8ECF2", overflow: "hidden", minWidth: 60 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: s.bar, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
      {showNote && note && <div style={{ fontSize: 9, color: "#8B93A8", lineHeight: 1.3 }}>{note}</div>}
    </div>
  );
}

// ── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ feature, gameColor, T, onClick, selected }) {
  const allTracks = Object.values(feature.tracks);
  const doneCount = allTracks.filter(t => t.status === "done" || t.status === "live").length;
  const totalPct  = Math.round((doneCount / allTracks.length) * 100);
  const hasRisk   = feature.risks?.length > 0;

  return (
    <div onClick={onClick} style={{
      background: selected ? (T.isDark ? "#1A2130" : "#F7F9FF") : T.surface,
      border: `1px solid ${selected ? gameColor : T.border}`,
      borderLeft: `3px solid ${hasRisk ? "#C05040" : gameColor}`,
      borderRadius: "0 10px 10px 0", padding: "12px 16px",
      cursor: "pointer", transition: "all 0.15s", marginBottom: 8,
    }}>
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
              <span style={{ fontSize: 9, fontWeight: 700, color: "#C05040", background: "#FCEAE6", padding: "1px 6px", borderRadius: 99 }}>⚠ Risk</span>
            )}
          </div>
          {feature.subtitle && <div style={{ fontSize: 10, color: T.faint }}>{feature.subtitle}</div>}
        </div>
        <StatusPill status={feature.status} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {TRACKS.map(track => {
          const t = feature.tracks[track] || { status: "not-started" };
          const d = TRACK_DISPLAY[track];
          return (
            <div key={track} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
              <TrackBar status={t.status} />
              <div style={{ fontSize: 9, color: STATUS_STYLE[t.status]?.text || T.faint }}>
                {STATUS_STYLE[t.status]?.label || "—"}
              </div>
            </div>
          );
        })}
      </div>

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
function TimelineView({ features, gameColor, T }) {
  const WEEK_W = 80, ROW_H = 28, LABEL_W = 90;

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      {/* Week headers */}
      <div style={{ display: "flex", marginBottom: 4, marginLeft: LABEL_W }}>
        {WEEKS.map((w, i) => (
          <div key={i} style={{
            width: WEEK_W, flexShrink: 0, fontSize: 9, fontWeight: 700,
            color: i === 0 ? T.accent : T.faint,
            textTransform: "uppercase", letterSpacing: "0.06em",
            paddingLeft: 6, borderLeft: `1px solid ${T.border}`,
          }}>
            <div>{w.label}</div>
            <div style={{ fontWeight: 400, opacity: 0.7 }}>{w.start}</div>
          </div>
        ))}
      </div>

      {features.map((feature) => (
        <div key={feature.id} style={{ marginBottom: 16 }}>
          {/* Feature header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <div style={{ width: LABEL_W, flexShrink: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {feature.name}
              </div>
              <div style={{ fontSize: 9, color: gameColor, fontWeight: 700 }}>{feature.version}</div>
            </div>
            <div style={{ display: "flex", flex: 1, height: 2, background: T.surfaceAlt, borderRadius: 99 }}>
              {WEEKS.map((_, i) => <div key={i} style={{ width: WEEK_W, flexShrink: 0, borderLeft: `1px solid ${T.border}` }} />)}
            </div>
          </div>

          {/* Track rows — use weekStart/weekEnd directly from data */}
          {TRACKS.map((track) => {
            const trackData = feature.tracks[track] || { status: "not-started" };
            const s = STATUS_STYLE[trackData.status] || STATUS_STYLE["not-started"];
            const d = TRACK_DISPLAY[track];
            // ✅ Use people from the feature data, not global TRACK_PEOPLE
            const people = trackData.people || [];
            const hasBar = trackData.status !== "not-started"
              && trackData.weekStart !== undefined
              && trackData.weekEnd !== undefined
              && trackData.weekEnd > trackData.weekStart;

            return (
              <div key={track} style={{ display: "flex", alignItems: "center", marginBottom: 3, height: ROW_H }}>
                <div style={{ width: LABEL_W, flexShrink: 0, paddingRight: 8 }}>
                  <span style={{ fontSize: 9, color: T.faint, display: "block", textAlign: "right", whiteSpace: "nowrap" }}>{d.label}</span>
                </div>
                <div style={{ position: "relative", display: "flex", flex: 1 }}>
                  {/* Grid */}
                  {WEEKS.map((_, i) => (
                    <div key={i} style={{
                      width: WEEK_W, flexShrink: 0, height: ROW_H,
                      borderLeft: `1px solid ${T.border}`,
                      background: i % 2 === 0 ? "transparent" : (T.isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"),
                    }} />
                  ))}

                  {/* Task bar positioned by actual weekStart/weekEnd */}
                  {hasBar && (
                    <div style={{
                      position: "absolute",
                      left: trackData.weekStart * WEEK_W + 4,
                      width: Math.max((trackData.weekEnd - trackData.weekStart) * WEEK_W - 8, 24),
                      top: 4, height: ROW_H - 8,
                      background: s.bar, borderRadius: 4, opacity: 0.88,
                      display: "flex", alignItems: "center", paddingLeft: 6,
                      overflow: "hidden", boxShadow: `0 1px 4px ${s.bar}44`,
                    }}>
                      {people.length > 0 && (
                        <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {people.slice(0, 2).join(", ")}
                        </span>
                      )}
                    </div>
                  )}

                  {trackData.status === "not-started" && (
                    <div style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: T.faint, fontStyle: "italic" }}>
                      not scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {feature.risks?.length > 0 && (
            <div style={{ display: "flex", marginTop: 2 }}>
              <div style={{ width: LABEL_W, flexShrink: 0 }} />
              <div style={{ fontSize: 9, color: "#C05040", fontWeight: 600 }}>⚠ {feature.risks[0].substring(0, 80)}{feature.risks[0].length > 80 ? "…" : ""}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Resource Allocation Panel ──────────────────────────────────────────────
// ✅ Now reads people from feature.tracks[track].people — no global TRACK_PEOPLE
function ResourcePanel({ features, T }) {
  const allocation = {};

  features.forEach(feature => {
    TRACKS.forEach(track => {
      const trackData = feature.tracks[track];
      if (!trackData) return;
      const people = trackData.people || [];
      people.forEach(person => {
        if (!allocation[person]) allocation[person] = { active: 0, review: 0, items: [] };
        if (trackData.status === "in-progress") {
          allocation[person].active++;
          allocation[person].items.push(`${feature.name} / ${TRACK_DISPLAY[track].label}`);
        } else if (trackData.status === "review") {
          allocation[person].review++;
          allocation[person].items.push(`${feature.name} / ${TRACK_DISPLAY[track].label} (review)`);
        }
      });
    });
  });

  const people = Object.entries(allocation).filter(([, v]) => v.active + v.review > 0);

  if (people.length === 0) {
    return <div style={{ fontSize: 12, color: T.panelMuted }}>No active assignments found.</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
      {people.map(([name, data]) => {
        const load = data.active + data.review;
        const loadColor = load <= 1 ? T.ok : load === 2 ? T.warn : "#C05040";
        return (
          <div key={name} style={{
            background: T.panelAlt, border: `1px solid ${T.panelBorder}`,
            borderRadius: 10, padding: "10px 12px", borderTop: `2px solid ${loadColor}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.panelText }}>{name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: loadColor, background: loadColor + "22", padding: "1px 7px", borderRadius: 99 }}>
                {load} active
              </span>
            </div>
            {data.items.slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontSize: 9, color: T.panelMuted, marginBottom: 2 }}>· {item}</div>
            ))}
            {data.items.length > 3 && <div style={{ fontSize: 9, color: T.panelMuted }}>+ {data.items.length - 3} more</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Roadmap Page ──────────────────────────────────────────────────────
export default function RoadmapPage({ T }) {
  const [game, setGame]           = useState("wm");
  const [view, setView]           = useState("timeline");
  const [selected, setSelected]   = useState(null);
  const [showResource, setShowResource] = useState(false);
  const [versionFilter, setVersionFilter] = useState("all");

  const allFeaturesForGame = FEATURE_ROADMAP[game] || [];

  // Get unique versions for filter tabs
  const versions = ["all", ...new Set(allFeaturesForGame.map(f => f.version).filter(Boolean))];

  const features = versionFilter === "all"
    ? allFeaturesForGame
    : allFeaturesForGame.filter(f => f.version === versionFilter);

  const gameColor = game === "wm" ? T.wm : T.sol;
  const gameLabel = game === "wm" ? "Word Maker" : "Solitaire";
  const allFeatures = [...(FEATURE_ROADMAP.wm || []), ...(FEATURE_ROADMAP.sol || [])];
  const selectedFeature = selected ? features.find(f => f.id === selected) : null;

  const inProgress = allFeaturesForGame.filter(f => ["in-progress", "live"].includes(f.status)).length;
  const atRisk     = allFeaturesForGame.filter(f => f.risks?.length > 0).length;
  const planned    = allFeaturesForGame.filter(f => f.status === "planned").length;

  return (
    <div style={{ display: "grid", gap: 16 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { v: allFeaturesForGame.length, l: "Total features", s: `Q2 ${gameLabel}`,        ck: "accent"  },
          { v: inProgress,                l: "In progress",    s: "Active this sprint",       ck: "ok"      },
          { v: atRisk,                    l: "At risk",         s: "Blockers or flags",        ck: atRisk > 0 ? "caution" : "ok" },
          { v: planned,                   l: "Planned",         s: "Not yet started",          ck: "sol"     },
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
        {["wm", "sol"].map(g => (
          <button key={g} onClick={() => { setGame(g); setSelected(null); setVersionFilter("all"); }} style={{
            padding: "5px 16px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${game === g ? (g === "wm" ? T.wm : T.sol) : T.border}`,
            background: game === g ? (g === "wm" ? T.wm + "18" : T.sol + "18") : T.surface,
            color: game === g ? (g === "wm" ? T.wm : T.sol) : T.muted,
          }}>
            {g === "wm" ? "Word Maker" : "Solitaire"}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: T.border, margin: "0 4px" }} />

        {[{ id: "timeline", label: "📅 Timeline" }, { id: "cards", label: "⊞ Cards" }].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${view === v.id ? T.accent : T.border}`,
            background: view === v.id ? T.navActiveBg : T.surface,
            color: view === v.id ? T.accent : T.muted,
          }}>{v.label}</button>
        ))}

        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => setShowResource(r => !r)} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1.5px solid ${showResource ? T.accent : T.border}`,
            background: showResource ? T.navActiveBg : T.surface,
            color: showResource ? T.accent : T.muted,
          }}>👥 Resource load</button>
        </div>
      </div>

      {/* Version filter tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {versions.map(v => (
          <button key={v} onClick={() => { setVersionFilter(v); setSelected(null); }} style={{
            padding: "3px 12px", fontSize: 10, fontWeight: 700, borderRadius: 99, cursor: "pointer",
            border: `1px solid ${versionFilter === v ? gameColor : T.border}`,
            background: versionFilter === v ? gameColor + "18" : T.surface,
            color: versionFilter === v ? gameColor : T.faint,
          }}>
            {v === "all" ? "All versions" : v}
          </button>
        ))}
        <span style={{ fontSize: 10, color: T.faint, alignSelf: "center", marginLeft: 4 }}>
          {features.length} feature{features.length !== 1 ? "s" : ""} shown
        </span>
      </div>

      {/* Resource panel */}
      {showResource && (
        <div style={{ background: T.panelBg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${T.panelBorder}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Resource load — active features ({game === "wm" ? "Word Maker" : "Solitaire"})
          </div>
          <ResourcePanel features={allFeaturesForGame.filter(f => ["in-progress","live"].includes(f.status))} T={T} />
        </div>
      )}

      {/* Main */}
      <div style={{ display: "grid", gridTemplateColumns: selectedFeature ? "1fr 300px" : "1fr", gap: 12 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: gameColor }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{gameLabel} — Q2 2026 Roadmap</span>
            <span style={{ fontSize: 10, color: T.faint, marginLeft: "auto" }}>{features.length} features · Apr–Jun 2026</span>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {Object.entries(STATUS_STYLE).map(([status, s]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.bar }} />
                {s.label}
              </div>
            ))}
          </div>

          {view === "timeline" ? (
            <TimelineView features={features} gameColor={gameColor} T={T} />
          ) : (
            <div>
              {features.map(f => (
                <FeatureCard key={f.id} feature={f} gameColor={gameColor} T={T}
                  selected={selected === f.id}
                  onClick={() => setSelected(selected === f.id ? null : f.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedFeature && (
          <div style={{ background: T.panelBg, border: `1px solid ${T.panelBorder}`, borderRadius: 12, padding: "18px 16px", alignSelf: "start" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.panelText }}>{selectedFeature.name}</span>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: T.panelMuted, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            {selectedFeature.subtitle && <div style={{ fontSize: 10, color: T.panelMuted, marginBottom: 12 }}>{selectedFeature.subtitle}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { l: "Version",    v: selectedFeature.version    || "—" },
                { l: "Target",     v: selectedFeature.targetMonth || "—" },
                { l: "KPI target", v: selectedFeature.kpiTarget   || "—" },
                { l: "Status",     v: STATUS_STYLE[selectedFeature.status]?.label || selectedFeature.status },
              ].map(item => (
                <div key={item.l}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{item.l}</div>
                  <div style={{ fontSize: 11, color: T.panelText }}>{item.v}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, color: T.panelMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Track status</div>
            {TRACKS.map(track => {
              const t = selectedFeature.tracks[track] || { status: "not-started" };
              const d = TRACK_DISPLAY[track];
              const s = STATUS_STYLE[t.status] || STATUS_STYLE["not-started"];
              // ✅ People from feature data
              const people = t.people || [];
              return (
                <div key={track} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.panelText }}>{d.label}</span>
                    <StatusPill status={t.status} small />
                  </div>
                  <TrackBar status={t.status} note={t.note} showNote />
                  {people.length > 0 && (
                    <div style={{ fontSize: 9, color: T.panelMuted, marginTop: 3 }}>{people.join(", ")}</div>
                  )}
                  {t.note && <div style={{ fontSize: 9, color: s.text, marginTop: 2 }}>{t.note}</div>}
                </div>
              );
            })}

            {selectedFeature.risks?.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#C05040", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 14, marginBottom: 6 }}>Risks</div>
                {selectedFeature.risks.map((r, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#C05040", background: "#FCEAE6", padding: "5px 8px", borderRadius: 6, marginBottom: 4 }}>⚠ {r}</div>
                ))}
              </>
            )}

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
