// Gantt.jsx — Real-time interactive sprint Gantt
// Supabase live sync · dnd-kit drag-drop · OOO overlay · Edit panel
import { useState, useEffect, useRef, useCallback } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { supabase, isConfigured } from "../lib/supabase.js";
import { getOOOPeopleOnDate, getPublicHolidayOnDate } from "../teamAvailability.js";

// ── Grid constants ────────────────────────────────────────────────────────────
const DAY_W      = 56;
const WEEK_W     = DAY_W * 5;
const LABEL_W    = 148;
const TRACK_W    = 72;
const ROW_H      = 34;
const HDR_H      = 48; // two-line header (week + day)
const NUM_WEEKS  = 10;
const TRACKS     = ["design","art","techArt","dev","qa"];
const TRACK_LABELS = { design:"Design", art:"Art", techArt:"Tech Art", dev:"Dev", qa:"QA" };
const TEAM_MEMBERS = ["Didara","Srikanth","Toni","Víctor","Juan S","Juan Z","Yevhenii","Angel","Murat","Henrique","Guillem","Krish","Andreu","Dheeraj"];

// ── Week 0 = Apr 21 2026 · generate working days ─────────────────────────────
const W0 = new Date("2026-04-21T00:00:00");
const ALL_DAYS = [];
{ let d = new Date(W0);
  while (ALL_DAYS.length < NUM_WEEKS * 5) {
    if (d.getDay() !== 0 && d.getDay() !== 6) ALL_DAYS.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
}
const TODAY_STR = new Date().toISOString().slice(0,10);
const TODAY_IDX = ALL_DAYS.findIndex(d => d.toISOString().slice(0,10) === TODAY_STR);
const MON = ["Mon","Tue","Wed","Thu","Fri"];
const MSHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Week-float ↔ calendar date helpers ───────────────────────────────────────
function weekFloatToDate(wf) {
  const idx = Math.max(0, Math.min(Math.round(wf * 5), ALL_DAYS.length - 1));
  return ALL_DAYS[idx]?.toISOString().slice(0, 10) ?? '';
}
function dateToWeekFloat(dateStr) {
  const exact = ALL_DAYS.findIndex(d => d.toISOString().slice(0, 10) === dateStr);
  if (exact >= 0) return exact / 5;
  // Nearest working day (handles weekends / out-of-range)
  const target = new Date(dateStr + 'T00:00:00');
  let nearest = 0, minDiff = Infinity;
  ALL_DAYS.forEach((d, i) => { const diff = Math.abs(d - target); if (diff < minDiff) { minDiff = diff; nearest = i; } });
  return nearest / 5;
}

// ── Discipline colours ────────────────────────────────────────────────────────
const D = {
  design:  { bg:"#3A7FC1", light:"#EBF4FB", text:"#1A5C8A" },
  art:     { bg:"#C87E28", light:"#FDF0E0", text:"#9A5810" },
  techArt: { bg:"#3A8A5A", light:"#E4F0E8", text:"#2A6A40" },
  dev:     { bg:"#3A5AB5", light:"#E8EEF8", text:"#1A3A8A" },
  qa:      { bg:"#A83068", light:"#F5E8F0", text:"#8A2A60" },
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  "not-started": { label:"Not started", bar:"#C0C8D8", text:"#8B93A8" },
  "in-progress":  { label:"In progress", bar:"#4A7BB5", text:"#4A7BB5" },
  "review":       { label:"Review",      bar:"#F4A428", text:"#B07020" },
  "done":         { label:"Done",        bar:"#3E9E6A", text:"#2E8A5A" },
  "blocked":      { label:"Blocked",     bar:"#C05040", text:"#8A3828" },
  "live":         { label:"Live",        bar:"#3E9E6A", text:"#2E8A5A" },
};

// ── Feature status bar colour ─────────────────────────────────────────────────
const FEAT_STATUS = {
  live:"#3E9E6A", "in-progress":"#F4A428", planned:"#8B93A8", blocked:"#C05040",
};

// ── User identity (localStorage) ─────────────────────────────────────────────
const LS_KEY = "gantt_user";
const storedUser = () => localStorage.getItem(LS_KEY) || "";

// ── UserModal ─────────────────────────────────────────────────────────────────
function UserModal({ onConfirm, T }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"28px 32px", width:320, textAlign:"center" }}>
        <div style={{ fontSize:22, marginBottom:8 }}>👋</div>
        <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:4 }}>Who are you?</div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:18 }}>Your updates will show your name on the Gantt.</div>
        <select
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, background:T.surfaceAlt, color:T.text, fontSize:13, marginBottom:16 }}
        >
          <option value="">— select your name —</option>
          {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button
          disabled={!name}
          onClick={() => onConfirm(name)}
          style={{
            width:"100%", padding:"9px 0", borderRadius:8, border:"none",
            background: name ? T.accent : T.border, color: name ? "#fff" : T.faint,
            fontWeight:700, fontSize:13, cursor: name ? "pointer" : "default",
          }}
        >Let's go</button>
      </div>
    </div>
  );
}

// ── EditPanel ─────────────────────────────────────────────────────────────────
function EditPanel({ track, featureName, onUpdate, onClose, T }) {
  const [status, setStatus]   = useState(track.status || "not-started");
  const [note, setNote]       = useState(track.note || "");
  const [people, setPeople]   = useState((track.people || []).join(", "));
  const [jira, setJira]       = useState((track.jira_tickets || []).join(", "));
  const [wkStart, setWkStart] = useState(track.week_start ?? 0);
  const [wkEnd, setWkEnd]     = useState(track.week_end ?? 1);
  const dirty = useRef(false);

  // Debounced save (status / note / people / jira)
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(() => {
      onUpdate(track.id, {
        status,
        note,
        people:       people.split(",").map(p=>p.trim()).filter(Boolean),
        jira_tickets: jira.split(",").map(j=>j.trim()).filter(Boolean),
      });
    }, 600);
    return () => clearTimeout(t);
  }, [status, note, people, jira]);

  // Immediate save for date changes
  const handleStartDate = val => {
    const wf = dateToWeekFloat(val);
    setWkStart(wf);
    const newEnd = Math.max(wf + 0.2, wkEnd);
    setWkEnd(newEnd);
    onUpdate(track.id, { week_start: wf, week_end: newEnd });
  };
  const handleEndDate = val => {
    const wf = dateToWeekFloat(val);
    const newEnd = Math.max(wkStart + 0.2, wf);
    setWkEnd(newEnd);
    onUpdate(track.id, { week_end: newEnd });
  };

  const field = (label, el) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:10, fontWeight:700, color:T.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
      {el}
    </div>
  );

  const inputStyle = { width:"100%", padding:"7px 10px", borderRadius:7, border:`1px solid ${T.border}`, background:T.surfaceAlt, color:T.text, fontSize:12, boxSizing:"border-box" };

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:300, background:T.surface, borderLeft:`1px solid ${T.border}`, zIndex:100, display:"flex", flexDirection:"column", boxShadow:"-4px 0 20px rgba(0,0,0,0.12)" }}>
      <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:D[track.track]?.bg || T.accent, flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.text }}>{featureName}</div>
          <div style={{ fontSize:10, color:T.muted }}>{TRACK_LABELS[track.track]}</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:T.faint, padding:"0 4px" }}>×</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 18px" }}>
        {field("Status",
          <select value={status} onChange={e=>{dirty.current=true;setStatus(e.target.value)}} style={inputStyle}>
            {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        )}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>Start</div>
            <input type="date" value={weekFloatToDate(wkStart)} onChange={e => handleStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>End</div>
            <input type="date" value={weekFloatToDate(wkEnd)} onChange={e => handleEndDate(e.target.value)} style={inputStyle} />
          </div>
        </div>
        {field("People (comma-separated)",
          <input value={people} onChange={e=>{dirty.current=true;setPeople(e.target.value)}} style={inputStyle} placeholder="Toni, Víctor" />
        )}
        {field("Note",
          <textarea value={note} onChange={e=>{dirty.current=true;setNote(e.target.value)}} style={{...inputStyle, resize:"vertical", minHeight:72}} placeholder="Any notes..." />
        )}
        {field("Jira tickets (comma-separated)",
          <input value={jira} onChange={e=>{dirty.current=true;setJira(e.target.value)}} style={inputStyle} placeholder="WORD-123, WORD-124" />
        )}
        {track.updated_by && (
          <div style={{ fontSize:10, color:T.faint, marginTop:8, fontStyle:"italic" }}>
            Last updated by {track.updated_by}
          </div>
        )}
      </div>
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${T.border}`, fontSize:10, color:T.ok }}>
        ✓ Saves automatically · syncs to all team members
      </div>
    </div>
  );
}

// ── TrackBar — draggable + resizable ─────────────────────────────────────────
function TrackBar({ track, editMode, onEdit, T }) {
  // Move drag
  const { setNodeRef:mRef, attributes:mAttr, listeners:mList, transform:mT, isDragging:isMoving } = useDraggable({
    id: `move-${track.id}`,
    disabled: !editMode,
    data: { type:"move", trackId:track.id, weekStart:track.week_start, weekEnd:track.week_end },
  });
  // Resize drag
  const { setNodeRef:rRef, attributes:rAttr, listeners:rList, transform:rT, isDragging:isResizing } = useDraggable({
    id: `resize-${track.id}`,
    disabled: !editMode,
    data: { type:"resize", trackId:track.id, weekStart:track.week_start, weekEnd:track.week_end },
  });

  // Live snap-to-day preview during drag
  const moveWeeks   = isMoving   ? Math.round((mT?.x || 0) / DAY_W) / 5 : 0;
  const resizeWeeks = isResizing ? Math.round((rT?.x || 0) / DAY_W) / 5 : 0;
  const visStart    = Math.max(0, track.week_start + moveWeeks);
  const visEnd      = Math.max(visStart + 0.2, track.week_end + moveWeeks + resizeWeeks);

  const left  = visStart * WEEK_W;
  const width = Math.max(DAY_W, (visEnd - visStart) * WEEK_W);
  const sc    = STATUS[track.status] || STATUS["not-started"];

  return (
    <div
      ref={mRef}
      {...mAttr}
      {...mList}
      style={{
        position:"absolute", left, width, height:ROW_H - 6, top:3,
        background:sc.bar, borderRadius:5,
        display:"flex", alignItems:"center",
        cursor: editMode ? (isMoving ? "grabbing" : "grab") : "pointer",
        opacity: isMoving ? 0.75 : 1,
        zIndex: isMoving ? 20 : 2,
        userSelect:"none", boxSizing:"border-box",
        transition: (isMoving || isResizing) ? "none" : "left 0.15s, width 0.15s",
      }}
      onClick={e => { if (!isMoving && !isResizing) { e.stopPropagation(); onEdit(track); } }}
    >
      <span style={{ flex:1, fontSize:9, color:"rgba(255,255,255,0.95)", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", padding:"0 8px" }}>
        {(track.people || []).join(" · ") || TRACK_LABELS[track.track]}
        {width > 70 && <span style={{ fontWeight:400, opacity:0.75 }}> ({Math.round((visEnd - visStart) * 5)}d)</span>}
      </span>
      {track.updated_by && (
        <span style={{ fontSize:8, color:"rgba(255,255,255,0.65)", paddingRight:editMode ? 2 : 8, flexShrink:0 }}>
          {track.updated_by}
        </span>
      )}
      {editMode && (
        <div
          ref={rRef}
          {...rAttr}
          {...rList}
          style={{ width:10, height:"100%", cursor:"col-resize", background:"rgba(0,0,0,0.18)", borderRadius:"0 5px 5px 0", flexShrink:0 }}
          onClick={e => e.stopPropagation()}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GanttPage({ T }) {
  const [game, setGame]           = useState("wm");
  const [features, setFeatures]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editMode, setEditMode]   = useState(false);
  const [currentUser, setUser]    = useState(storedUser);
  const [showModal, setShowModal] = useState(!storedUser());
  const [editTrack, setEditTrack] = useState(null);   // { track, featureName }
  const subRef                    = useRef(null);

  // ── Load from Supabase ───────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!isConfigured) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("sprint_features")
        .select("*, sprint_tracks(*)")
        .eq("game", game)
        .order("sprint_week_start");
      if (err) throw err;
      setFeatures(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [game]);

  // ── Real-time subscription ────────────────────────────────────────────────
  useEffect(() => {
    loadData();
    if (!isConfigured) return;

    if (subRef.current) supabase.removeChannel(subRef.current);

    const ch = supabase.channel(`gantt-${game}`)
      .on("postgres_changes", { event:"*", schema:"public", table:"sprint_tracks" }, payload => {
        const updated = payload.new;
        setFeatures(prev => prev.map(f => ({
          ...f,
          sprint_tracks: (f.sprint_tracks || []).map(t =>
            t.id === updated?.id ? { ...t, ...updated } : t
          ),
        })));
      })
      .on("postgres_changes", { event:"*", schema:"public", table:"sprint_features" }, () => {
        loadData(); // re-fetch on feature change
      })
      .subscribe();

    subRef.current = ch;
    return () => { if (subRef.current) supabase.removeChannel(subRef.current); };
  }, [game, loadData]);

  // ── Update a track ────────────────────────────────────────────────────────
  const updateTrack = useCallback(async (trackId, fields) => {
    // Optimistic update
    setFeatures(prev => prev.map(f => ({
      ...f,
      sprint_tracks: (f.sprint_tracks || []).map(t =>
        t.id === trackId ? { ...t, ...fields } : t
      ),
    })));
    if (!isConfigured) return;
    await supabase.from("sprint_tracks").update({
      ...fields,
      updated_by: currentUser || "Unknown",
      updated_at: new Date().toISOString(),
    }).eq("id", trackId);
  }, [currentUser]);

  // ── Drag end ─────────────────────────────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(({ active, delta }) => {
    if (!active?.data?.current) return;
    const { type, trackId, weekStart, weekEnd } = active.data.current;
    const daysShifted = Math.round(delta.x / DAY_W);
    if (daysShifted === 0) return;
    const weeksShifted = daysShifted / 5;

    if (type === "move") {
      const newStart = Math.max(0, weekStart + weeksShifted);
      const dur = weekEnd - weekStart;
      updateTrack(trackId, { week_start: newStart, week_end: newStart + dur });
    } else if (type === "resize") {
      const newEnd = Math.max(weekStart + 0.2, weekEnd + weeksShifted);
      updateTrack(trackId, { week_end: newEnd });
    }
  }, [updateTrack]);

  // ── User identity ─────────────────────────────────────────────────────────
  const confirmUser = name => {
    localStorage.setItem(LS_KEY, name);
    setUser(name);
    setShowModal(false);
  };

  // ── Group features by version ─────────────────────────────────────────────
  const versionGroups = features.reduce((acc, f) => {
    if (!acc.has(f.version)) acc.set(f.version, []);
    acc.get(f.version).push(f);
    return acc;
  }, new Map());

  // ── OOO / holiday helpers ─────────────────────────────────────────────────
  const dayOOO  = idx => idx >= 0 && idx < ALL_DAYS.length ? getOOOPeopleOnDate(ALL_DAYS[idx].toISOString().slice(0,10)) : [];
  const dayHoliday = idx => idx >= 0 && idx < ALL_DAYS.length ? getPublicHolidayOnDate(ALL_DAYS[idx].toISOString().slice(0,10)) : null;

  // ── Render helpers ────────────────────────────────────────────────────────
  const gridW = NUM_WEEKS * WEEK_W;

  // Day header
  function DayHeaders() {
    return (
      <div style={{ display:"flex" }}>
        {/* Sticky labels placeholder */}
        <div style={{ width:LABEL_W + TRACK_W, flexShrink:0, position:"sticky", left:0, zIndex:5, background:T.topbar, borderRight:`1px solid ${T.panelBorder}` }}>
          <div style={{ height:HDR_H, display:"flex", alignItems:"flex-end", paddingBottom:6, paddingLeft:12 }}>
            <span style={{ fontSize:10, fontWeight:700, color:T.panelMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Feature / Track</span>
          </div>
        </div>
        {/* Day columns */}
        <div style={{ position:"relative", width:gridW, flexShrink:0 }}>
          {/* Week row */}
          <div style={{ display:"flex", height:24, borderBottom:`1px solid ${T.panelBorder}` }}>
            {Array.from({ length: NUM_WEEKS }, (_, w) => {
              const day = ALL_DAYS[w * 5];
              return (
                <div key={w} style={{ width:WEEK_W, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", borderRight:`1px solid ${T.panelBorder}` }}>
                  <span style={{ fontSize:9, fontWeight:700, color:T.panelMuted, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    {day ? `${MSHORT[day.getMonth()]} W${Math.ceil(day.getDate()/7)}` : `W${w+1}`}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Day row */}
          <div style={{ display:"flex", height:HDR_H - 24 }}>
            {ALL_DAYS.map((d, i) => {
              const isToday = i === TODAY_IDX;
              const ooo = dayOOO(i);
              const holiday = dayHoliday(i);
              return (
                <div
                  key={i}
                  style={{
                    width:DAY_W, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    borderRight:`1px solid ${T.panelBorder}`,
                    background: isToday ? T.accent+"30" : holiday ? "#4A9A9A18" : ooo.length > 0 ? "#C0504018" : "transparent",
                    position:"relative",
                  }}
                  title={ooo.length ? `OOO: ${ooo.join(', ')}` : holiday?.name || ""}
                >
                  <span style={{ fontSize:9, fontWeight: isToday ? 700 : 400, color: isToday ? T.accent : T.panelMuted }}>
                    {MON[d.getDay() - 1]}
                  </span>
                  {isToday && (
                    <div style={{ position:"absolute", bottom:-1, width:2, height:2, background:T.accent, borderRadius:2 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Version group
  function VersionGroup({ version, feats }) {
    const minWeek = Math.min(...feats.map(f => f.sprint_week_start ?? 0));
    const statusColor = FEAT_STATUS[feats[0]?.status] || T.faint;

    return (
      <div style={{ borderBottom:`1px solid ${T.border}`, marginBottom:4 }}>
        {/* Version header */}
        <div style={{ display:"flex", background:T.surfaceAlt }}>
          <div style={{ width:LABEL_W + TRACK_W, flexShrink:0, position:"sticky", left:0, zIndex:3, background:T.surfaceAlt, borderRight:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"6px 12px", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:statusColor, flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:700, color:T.text }}>{version}</span>
          </div>
          <div style={{ position:"relative", width:gridW, flexShrink:0, height:28 }}>
            {/* Version span bar */}
            <div style={{ position:"absolute", left: minWeek * WEEK_W + 2, top:6, height:16, width: Math.max(WEEK_W, (NUM_WEEKS - minWeek) * WEEK_W - 4), background:statusColor+"22", borderRadius:4, border:`1px solid ${statusColor}44` }} />
            {/* OOO tints */}
            {ALL_DAYS.map((_, i) => {
              const ooo = dayOOO(i); const holiday = dayHoliday(i);
              const bg = i === TODAY_IDX ? T.accent+"15" : holiday ? "#4A9A9A10" : ooo.length ? "#C0504010" : "transparent";
              return bg !== "transparent" ? <div key={i} style={{ position:"absolute", left:i*DAY_W, top:0, width:DAY_W, height:"100%", background:bg, pointerEvents:"none" }} /> : null;
            })}
          </div>
        </div>

        {/* Feature rows */}
        {feats.map((feat, fi) => {
          const trkMap = {};
          (feat.sprint_tracks || []).forEach(t => { trkMap[t.track] = t; });

          return (
            <div key={feat.id}>
              {TRACKS.map((tk, ti) => {
                const track = trkMap[tk];
                const dc = D[tk];
                const isFirstTrack = ti === 0;

                return (
                  <div key={tk} style={{ display:"flex", borderTop:`1px solid ${T.border}` }}>
                    {/* Labels */}
                    <div style={{ width:LABEL_W + TRACK_W, flexShrink:0, position:"sticky", left:0, zIndex:3, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", alignItems:"stretch" }}>
                      {/* Feature name (only on first track row) */}
                      <div style={{ width:LABEL_W, flexShrink:0, borderRight:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 10px 0 14px", background: isFirstTrack ? T.surface : T.surface }}>
                        {isFirstTrack && (
                          <div style={{ overflow:"hidden" }}>
                            <div style={{ fontSize:11, fontWeight:700, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{feat.name}</div>
                            {feat.subtitle && <div style={{ fontSize:9, color:T.faint, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{feat.subtitle}</div>}
                          </div>
                        )}
                      </div>
                      {/* Track label */}
                      <div style={{ width:TRACK_W, flexShrink:0, display:"flex", alignItems:"center", padding:"0 8px", gap:5 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:dc.bg, flexShrink:0 }} />
                        <span style={{ fontSize:9, fontWeight:700, color:dc.text, textTransform:"uppercase", letterSpacing:"0.06em" }}>{TRACK_LABELS[tk]}</span>
                      </div>
                    </div>

                    {/* Day cells + bar */}
                    <div style={{ position:"relative", width:gridW, height:ROW_H, flexShrink:0 }}>
                      {/* Day column backgrounds */}
                      {ALL_DAYS.map((_, i) => {
                        const ooo = dayOOO(i); const holiday = dayHoliday(i);
                        const bg = i === TODAY_IDX ? T.accent+"12" : holiday ? "#4A9A9A0C" : ooo.length ? "#C050400C" : "transparent";
                        return (
                          <div key={i} style={{ position:"absolute", left:i*DAY_W, top:0, width:DAY_W, height:"100%", background:bg, borderRight:`1px solid ${T.border+"44"}` }} />
                        );
                      })}
                      {/* Today vertical line */}
                      {TODAY_IDX >= 0 && (
                        <div style={{ position:"absolute", left: TODAY_IDX * DAY_W + DAY_W/2 - 1, top:0, width:2, height:"100%", background:T.accent+"60", zIndex:1 }} />
                      )}
                      {/* Track bar */}
                      {track && (
                        <TrackBar
                          track={track}
                          editMode={editMode}
                          onEdit={t => setEditTrack({ track:t, featureName:feat.name })}
                          T={T}
                        />
                      )}
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

  // ── Not configured state ──────────────────────────────────────────────────
  if (!isConfigured) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:16, textAlign:"center" }}>
        <div style={{ fontSize:32 }}>🔌</div>
        <div style={{ fontSize:18, fontWeight:700, color:T.text }}>Supabase not configured</div>
        <div style={{ fontSize:12, color:T.muted, maxWidth:460, lineHeight:1.6 }}>
          Create <code style={{ background:T.surfaceAlt, padding:"1px 6px", borderRadius:4 }}>.env.local</code> in the project root with your Supabase credentials. See <code style={{ background:T.surfaceAlt, padding:"1px 6px", borderRadius:4 }}>.env.example</code> for the format.
        </div>
        <div style={{ background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 20px", fontSize:11, color:T.muted, textAlign:"left", lineHeight:1.8, fontFamily:"monospace" }}>
          VITE_SUPABASE_URL=https://bbzhntajcxdgeskbmbzp.supabase.co<br />
          VITE_SUPABASE_ANON_KEY=&lt;your-anon-key&gt;
        </div>
        <div style={{ fontSize:11, color:T.faint }}>
          Then run the SQL schema in the Supabase editor → seed with <code style={{ background:T.surfaceAlt, padding:"1px 5px", borderRadius:4 }}>node src/lib/seedGantt.mjs</code>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      {showModal && <UserModal onConfirm={confirmUser} T={T} />}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        {/* Game selector */}
        <div style={{ display:"flex", gap:4 }}>
          {[["wm","Word Maker"],["sol","Solitaire"]].map(([id,label]) => (
            <button key={id} onClick={() => setGame(id)} style={{
              padding:"5px 14px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer", border:`1.5px solid ${game===id ? T.accent : T.border}`,
              background: game===id ? T.navActiveBg : T.surface, color: game===id ? T.accent : T.muted, transition:"all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {/* Live indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:T.ok }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:T.ok }} />
          Live sync
        </div>

        {/* Spacer */}
        <div style={{ flex:1 }} />

        {/* User badge */}
        {currentUser && (
          <button onClick={() => setShowModal(true)} style={{ fontSize:11, color:T.muted, background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:99, padding:"4px 12px", cursor:"pointer" }}>
            👤 {currentUser}
          </button>
        )}

        {/* Edit mode toggle */}
        <button onClick={() => setEditMode(e => !e)} style={{
          padding:"5px 14px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
          border:`1.5px solid ${editMode ? T.accent : T.border}`,
          background: editMode ? T.navActiveBg : T.surface,
          color: editMode ? T.accent : T.muted,
        }}>
          {editMode ? "✏️ Edit mode ON" : "Edit mode"}
        </button>
      </div>

      {/* OOO legend */}
      <div style={{ display:"flex", gap:14, marginBottom:10, flexWrap:"wrap" }}>
        {[
          { color:"#C05040", label:"OOO day" },
          { color:"#4A9A9A", label:"Public holiday" },
          { color:T.accent,  label:"Today" },
        ].map(x => (
          <div key={x.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:T.muted }}>
            <div style={{ width:10, height:10, borderRadius:2, background:x.color+"40", border:`1px solid ${x.color}` }} />
            {x.label}
          </div>
        ))}
        {editMode && <div style={{ fontSize:10, color:T.muted, fontStyle:"italic" }}>Drag bars to move · drag right edge to resize · click to edit</div>}
      </div>

      {/* Gantt grid */}
      {loading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:T.muted, fontSize:13 }}>Loading…</div>
      ) : error ? (
        <div style={{ padding:16, background:"#FCEAE6", borderRadius:10, color:"#8A3828", fontSize:12 }}>Error: {error}</div>
      ) : features.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:200, gap:10, color:T.muted, textAlign:"center" }}>
          <div style={{ fontSize:24 }}>📭</div>
          <div style={{ fontSize:13, fontWeight:700, color:T.text }}>No data yet</div>
          <div style={{ fontSize:11 }}>Run the seed script: <code style={{ background:T.surfaceAlt, padding:"1px 6px", borderRadius:4 }}>node src/lib/seedGantt.mjs</code></div>
        </div>
      ) : (
        <div style={{ overflowX:"auto", border:`1px solid ${T.border}`, borderRadius:12, background:T.surface }}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {/* Day header */}
            <div style={{ background:T.topbar, borderRadius:"12px 12px 0 0", borderBottom:`2px solid ${T.panelBorder}` }}>
              <DayHeaders />
            </div>

            {/* Version groups */}
            <div>
              {[...versionGroups.entries()].map(([version, feats]) => (
                <VersionGroup key={version} version={version} feats={feats} />
              ))}
            </div>
          </DndContext>
        </div>
      )}

      {/* Edit panel */}
      {editTrack && (
        <EditPanel
          track={editTrack.track}
          featureName={editTrack.featureName}
          onUpdate={updateTrack}
          onClose={() => setEditTrack(null)}
          T={T}
        />
      )}
    </>
  );
}
