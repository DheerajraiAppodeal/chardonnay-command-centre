import { useState } from "react";
import { FEATURE_ROADMAP } from "../roadmapData.js";
import { getOOOPeopleOnDate, getPublicHolidayOnDate, TEAM_OOO } from "../teamAvailability.js";

// ── Date Math ─────────────────────────────────────────────────────────────
const PROJECT_START = new Date("2026-04-21");
const ALL_DAYS = [];
{ let d = new Date(PROJECT_START);
  while (ALL_DAYS.length < 50) {
    if (d.getDay() !== 0 && d.getDay() !== 6) ALL_DAYS.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
}
const TODAY     = new Date("2026-04-23");
const TODAY_IDX = ALL_DAYS.findIndex(d => d.toISOString().slice(0,10) === TODAY.toISOString().slice(0,10));
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES   = ["Mon","Tue","Wed","Thu","Fri"];
const fmt = d => `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;

const WEEK_GROUPS = [];
for (let w = 0; w < 10; w++) {
  const days = ALL_DAYS.slice(w*5, w*5+5);
  WEEK_GROUPS.push({ weekIdx: w, label: `${MONTH_SHORT[days[0].getMonth()]} W${Math.ceil(days[0].getDate()/7)}`, days });
}

// ── Layout ────────────────────────────────────────────────────────────────
const DAY_W       = 38;
const LABEL_W     = 140;
const ROW_H       = 26;
const GROUP_H     = 32;
const FEAT_H      = 28;
const TRACK_GAP   = 2;
const WINDOW_DAYS = 20;

// ── Status + track ────────────────────────────────────────────────────────
const S = {
  "not-started": { label:"Not started", bar:"#D8DCE5", text:"#8B93A8" },
  "in-progress":  { label:"In progress", bar:"#4A7BB5", text:"#4A7BB5" },
  "review":       { label:"Review",      bar:"#F4A428", text:"#B07020" },
  "done":         { label:"Done",        bar:"#3E9E6A", text:"#2E8A5A" },
  "blocked":      { label:"Blocked",     bar:"#C05040", text:"#8A3828" },
  "live":         { label:"Live",        bar:"#3E9E6A", text:"#2E8A5A" },
};
const TRACKS = ["design","art","techArt","dev","qa"];
const TRACK_META = {
  design:  { label:"Design",   color:"#7A6EA8" },
  art:     { label:"Art",      color:"#E8922A" },
  techArt: { label:"Tech Art", color:"#5A8F6A" },
  dev:     { label:"Dev",      color:"#4A7BB5" },
  qa:      { label:"QA",       color:"#B05080" },
};

// ── OOO helpers ───────────────────────────────────────────────────────────
function dayInfo(absIdx) {
  if (absIdx < 0 || absIdx >= ALL_DAYS.length) return { ooo:[], holidays:[] };
  const ds = ALL_DAYS[absIdx].toISOString().slice(0,10);
  return { ooo: getOOOPeopleOnDate(ds), holidays: getPublicHolidayOnDate(ds) };
}

// ── Status pill ───────────────────────────────────────────────────────────
function Pill({ label, color, small }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      fontSize: small?9:10, fontWeight:700,
      padding: small?"1px 5px":"2px 8px", borderRadius:99,
      background: color+"20", color, whiteSpace:"nowrap",
    }}>
      <span style={{ width:4, height:4, borderRadius:"50%", background:color, flexShrink:0 }} />
      {label}
    </span>
  );
}

// ── Version group header ──────────────────────────────────────────────────
function VersionHeader({ label, color, features, T, windowStart, expanded, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display:"flex", alignItems:"center", height:GROUP_H, cursor:"pointer",
      background: T.isDark?"#0F1520":"#F7F8FA",
      borderTop:`2px solid ${color}`, borderBottom:`1px solid ${T.border}`,
    }}>
      <div style={{ width:LABEL_W, flexShrink:0, paddingLeft:12, display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:10, color:T.faint }}>{expanded?"▾":"▸"}</span>
        <span style={{ fontSize:11, fontWeight:700, color, letterSpacing:"-0.01em" }}>{label}</span>
        <span style={{ fontSize:9, color:T.faint }}>({features.length})</span>
      </div>
      <div style={{ flex:1, position:"relative", height:"100%", overflow:"hidden" }}>
        {features.length > 0 && (() => {
          const allDays = features.flatMap(f =>
            TRACKS.flatMap(t => {
              const td = f.tracks[t]; if (!td||td.status==="not-started") return [];
              return [td.weekStart*5, td.weekEnd*5];
            })
          );
          if (!allDays.length) return null;
          const minD = Math.min(...allDays), maxD = Math.max(...allDays);
          const left = (minD-windowStart)*DAY_W, width=(maxD-minD)*DAY_W;
          if (width<=0) return null;
          return (
            <div style={{
              position:"absolute", left:Math.max(0,left),
              width:Math.min(width, WINDOW_DAYS*DAY_W-Math.max(0,left)),
              top:8, height:GROUP_H-16,
              background:color+"28", borderRadius:4, border:`1px solid ${color}44`,
              pointerEvents:"none",
            }} />
          );
        })()}
      </div>
    </div>
  );
}

// ── Feature row ───────────────────────────────────────────────────────────
function FeatureRow({ feature, vColor, T, windowStart, visibleDays, isSelected, onSelect }) {
  const hasRisk = feature.risks?.length > 0;
  return (
    <div style={{ borderBottom:`1px solid ${T.isDark?"#141C28":"#F0F2F5"}` }}>
      {/* Feature name row */}
      <div onClick={() => onSelect(isSelected?null:feature.id)} style={{
        display:"flex", alignItems:"center", height:FEAT_H, cursor:"pointer",
        background: isSelected ? vColor+"12" : "transparent",
      }}>
        <div style={{ width:LABEL_W, flexShrink:0, paddingLeft:20, display:"flex", alignItems:"center", gap:5, overflow:"hidden" }}>
          {hasRisk && <span style={{ fontSize:9, color:"#C05040", flexShrink:0 }}>⚠</span>}
          <span style={{ fontSize:11, fontWeight:700, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {feature.name}
          </span>
        </div>
        <div style={{ flex:1, position:"relative", height:"100%" }}>
          {(() => {
            const all = TRACKS.flatMap(t => { const td=feature.tracks[t]; if(!td||td.status==="not-started") return []; return [td.weekStart*5, td.weekEnd*5]; });
            if (!all.length) return null;
            const left=(Math.min(...all)-windowStart)*DAY_W, width=(Math.max(...all)-Math.min(...all))*DAY_W;
            if (width<=0) return null;
            return <div style={{ position:"absolute", left:Math.max(0,left)+2, width:Math.max(4,width-4), top:"50%", transform:"translateY(-50%)", height:3, borderRadius:99, background:vColor+"40", pointerEvents:"none" }} />;
          })()}
        </div>
      </div>

      {/* Track rows */}
      {TRACKS.map(track => {
        const td = feature.tracks[track] || { status:"not-started" };
        const st = S[td.status] || S["not-started"];
        const tm = TRACK_META[track];
        const people = td.people || [];
        const active = td.status !== "not-started";
        const dayStart = td.weekStart*5, dayEnd = td.weekEnd*5;
        const leftPx = (dayStart-windowStart)*DAY_W;
        const widthPx = Math.max((dayEnd-dayStart)*DAY_W, active?DAY_W:0);
        const cl = Math.max(0,leftPx), cr = Math.min(WINDOW_DAYS*DAY_W, leftPx+widthPx);
        const cw = cr-cl;
        const visible = active && cw>0;

        // OOO overlap check
        let oooWarn = 0;
        if (active) {
          for (let d=Math.max(dayStart,windowStart); d<Math.min(dayEnd,windowStart+WINDOW_DAYS); d++) {
            const { ooo } = dayInfo(d);
            if (people.some(p=>ooo.includes(p))) oooWarn++;
          }
        }

        return (
          <div key={track} style={{ display:"flex", alignItems:"center", height:ROW_H, marginBottom:TRACK_GAP }}>
            <div style={{ width:LABEL_W, flexShrink:0, paddingLeft:28, display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:1, background:tm.color, opacity:0.7, flexShrink:0 }} />
              <span style={{ fontSize:9, color:T.faint, fontWeight:600 }}>{tm.label}</span>
              {oooWarn>0 && active && (
                <span style={{ fontSize:8, color:"#C05040", fontWeight:700 }}>⚠{oooWarn}d</span>
              )}
            </div>
            <div style={{ flex:1, position:"relative", height:"100%" }}>
              {visible && (
                <div style={{
                  position:"absolute", left:cl+2, width:cw-4,
                  top:3, height:ROW_H-6,
                  background:st.bar, borderRadius:4, opacity:0.88,
                  display:"flex", alignItems:"center", paddingLeft:6,
                  overflow:"hidden", boxShadow:`0 1px 3px ${st.bar}44`,
                }}>
                  {cw>44 && people.length>0 && <span style={{ fontSize:9, color:"#fff", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{people.slice(0,2).join(", ")}</span>}
                  {cw<=44 && cw>10 && <span style={{ fontSize:9, color:"#fff" }}>{td.status==="done"?"✓":td.status==="review"?"↻":td.status==="blocked"?"!":"▶"}</span>}
                </div>
              )}
              {td.status==="not-started" && <div style={{ position:"absolute", left:4, top:"50%", transform:"translateY(-50%)", fontSize:8, color:T.faint, fontStyle:"italic", opacity:0.5 }}>—</div>}
            </div>
          </div>
        );
      })}

      {/* Risk note */}
      {feature.risks?.length > 0 && (
        <div style={{ display:"flex", marginTop:2, marginBottom:4 }}>
          <div style={{ width:LABEL_W, flexShrink:0 }} />
          <div style={{ fontSize:9, color:"#C05040", fontWeight:600 }}>⚠ {feature.risks[0].substring(0,90)}{feature.risks[0].length>90?"…":""}</div>
        </div>
      )}
    </div>
  );
}

// ── By Person / Resource view ─────────────────────────────────────────────
function ResourceView({ features, T, windowStart, visibleDays }) {
  const personMap = {};
  features.forEach(feat => {
    TRACKS.forEach(track => {
      const td = feat.tracks[track];
      if (!td||td.status==="not-started") return;
      (td.people||[]).forEach(person => {
        if (!personMap[person]) personMap[person] = [];
        personMap[person].push({ feat, track, td });
      });
    });
  });
  Object.keys(TEAM_OOO).forEach(p => { if (!personMap[p]) personMap[p]=[]; });
  const people = Object.entries(personMap).sort(([a],[b])=>a.localeCompare(b));

  return (
    <div>
      {people.map(([person, assignments]) => {
        const load = assignments.filter(a=>["in-progress","review"].includes(a.td.status)).length;
        const lc = load<=1?"#3E9E6A":load===2?"#F4A428":"#C05040";
        return (
          <div key={person} style={{ borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", height:FEAT_H }}>
              <div style={{ width:LABEL_W, flexShrink:0, paddingLeft:12, display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:lc+"25", border:`1.5px solid ${lc}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:9, fontWeight:700, color:lc }}>{person.charAt(0)}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:T.text }}>{person}</span>
                {load>0 && <span style={{ fontSize:9, fontWeight:700, color:lc, background:lc+"20", padding:"1px 5px", borderRadius:99 }}>{load} active</span>}
              </div>
              <div style={{ flex:1, position:"relative", height:FEAT_H }}>
                {visibleDays.map((_, i) => {
                  const { ooo, holidays } = dayInfo(windowStart+i);
                  if (!ooo.includes(person)) return null;
                  return (
                    <div key={i} style={{
                      position:"absolute", left:i*DAY_W+2, width:DAY_W-4, top:4, height:FEAT_H-8,
                      background: holidays.length?"#4A9A9A30":"#C0504025",
                      border:`1px solid ${holidays.length?"#4A9A9A":"#C05040"}44`,
                      borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <span style={{ fontSize:8, color:holidays.length?"#4A9A9A":"#C05040" }}>{holidays.length?"🏖":"OOO"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {assignments.map((a,i) => {
              const st=S[a.td.status]||S["not-started"], tm=TRACK_META[a.track];
              const lp=(a.td.weekStart*5-windowStart)*DAY_W, wp=Math.max((a.td.weekEnd-a.td.weekStart)*5*DAY_W,DAY_W);
              const cl=Math.max(0,lp), cr=Math.min(WINDOW_DAYS*DAY_W,lp+wp), cw=cr-cl;
              if (cw<=0) return null;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", height:ROW_H, marginBottom:TRACK_GAP }}>
                  <div style={{ width:LABEL_W, flexShrink:0, paddingLeft:42 }}>
                    <span style={{ fontSize:9, color:tm.color, fontWeight:600 }}>{tm.label}</span>
                    <span style={{ fontSize:9, color:T.faint }}> — {a.feat.name}</span>
                  </div>
                  <div style={{ flex:1, position:"relative", height:"100%" }}>
                    <div style={{ position:"absolute", left:cl+2, width:cw-4, top:3, height:ROW_H-6, background:st.bar, borderRadius:4, opacity:0.85, display:"flex", alignItems:"center", paddingLeft:6, overflow:"hidden" }}>
                      {cw>50 && <span style={{ fontSize:9, color:"#fff", fontWeight:700, whiteSpace:"nowrap" }}>{a.feat.version} · {a.feat.name.substring(0,18)}</span>}
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

// ── Detail side panel ─────────────────────────────────────────────────────
function DetailPanel({ feature, vColor, T, onClose }) {
  if (!feature) return null;
  const st = S[feature.status]||S["not-started"];
  return (
    <div style={{ width:260, flexShrink:0, background:T.panelBg, border:`1px solid ${T.panelBorder}`, borderRadius:12, padding:"16px 14px", alignSelf:"start", position:"sticky", top:80, maxHeight:"calc(100vh - 120px)", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.panelText, marginBottom:3 }}>{feature.name}</div>
          {feature.subtitle && <div style={{ fontSize:10, color:T.panelMuted }}>{feature.subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.panelMuted, cursor:"pointer", fontSize:16 }}>×</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {[{l:"Version",v:feature.version||"—"},{l:"Target",v:feature.targetMonth||"—"},{l:"KPI",v:feature.kpiTarget||"—"},{l:"Status",v:st.label}].map(x=>(
          <div key={x.l}>
            <div style={{ fontSize:9, fontWeight:700, color:T.panelMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2 }}>{x.l}</div>
            <div style={{ fontSize:11, color:T.panelText }}>{x.v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:9, fontWeight:700, color:T.panelMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Tracks</div>
      {TRACKS.map(track => {
        const td=feature.tracks[track]||{status:"not-started"};
        const tm=TRACK_META[track], s=S[td.status]||S["not-started"];
        const pct=td.status==="done"||td.status==="live"?100:td.status==="review"?80:td.status==="in-progress"?50:td.status==="blocked"?20:0;
        return (
          <div key={track} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:10, fontWeight:700, color:tm.color }}>{tm.label}</span>
              <Pill label={s.label} color={s.text} small />
            </div>
            <div style={{ height:4, borderRadius:99, background:T.isDark?"#1C2535":"#E8ECF2", marginBottom:3 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:s.bar, borderRadius:99 }} />
            </div>
            {(td.people||[]).length>0 && <div style={{ fontSize:9, color:T.panelMuted }}>{td.people.join(", ")}</div>}
            {td.note && <div style={{ fontSize:9, color:s.text, marginTop:1, fontStyle:"italic" }}>{td.note}</div>}
          </div>
        );
      })}
      {feature.risks?.length>0 && (
        <>
          <div style={{ fontSize:9, fontWeight:700, color:"#C05040", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:12, marginBottom:6 }}>Risks</div>
          {feature.risks.map((r,i)=><div key={i} style={{ fontSize:9, color:"#C05040", background:"#FCEAE6", padding:"5px 8px", borderRadius:6, marginBottom:4, lineHeight:1.4 }}>⚠ {r}</div>)}
        </>
      )}
      {feature.jiraEpic && (
        <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${T.panelBorder}` }}>
          <a href={`https://appodeal.atlassian.net/browse/${feature.jiraEpic}`} target="_blank" rel="noreferrer" style={{ fontSize:10, color:"#60A8D8", textDecoration:"none", fontWeight:700 }}>↗ {feature.jiraEpic} in Jira</a>
        </div>
      )}
    </div>
  );
}

// ── OOO summary strip ─────────────────────────────────────────────────────
function OOOStrip({ windowStart, T }) {
  const alerts = [];
  WEEK_GROUPS.forEach(wg => {
    const relDays = Array.from({length:5},(_,i)=>wg.weekIdx*5+i).filter(d=>d>=windowStart&&d<windowStart+WINDOW_DAYS);
    if (!relDays.length) return;
    const oooSet=new Set(), holSet=new Set();
    relDays.forEach(d=>{ const {ooo,holidays}=dayInfo(d); ooo.forEach(p=>oooSet.add(p)); holidays.forEach(h=>holSet.add(h.name)); });
    if (oooSet.size||holSet.size) alerts.push({ label:wg.label, ooo:[...oooSet], holidays:[...holSet] });
  });
  if (!alerts.length) return null;
  return (
    <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", background:T.isDark?"#0C1420":"#F0F6FF", border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 14px", fontSize:9 }}>
      <span style={{ fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em", flexShrink:0 }}>🗓 OOO this window</span>
      {alerts.map((a,i)=>(
        <span key={i} style={{ color:T.muted }}>
          <span style={{ fontWeight:700, color:T.text }}>{a.label}:</span>
          {a.holidays.map(h=><span key={h} style={{ color:"#4A9A9A", marginLeft:4 }}>🏖 {h}</span>)}
          {a.ooo.length>0 && <span style={{ color:"#C05040", marginLeft:4 }}>OOO — {a.ooo.join(", ")}</span>}
        </span>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function RoadmapPage({ T }) {
  const [game, setGame]         = useState("wm");
  const [windowStart, setWindowStart] = useState(Math.max(0,TODAY_IDX-2));
  const [viewMode, setViewMode]  = useState("features");
  const [collapsed, setCollapsed] = useState({});
  const [versionFilter, setVersionFilter] = useState("all");
  const [selected, setSelected]  = useState(null);
  const [showOOO, setShowOOO]    = useState(true);

  const features  = FEATURE_ROADMAP[game]||[];
  const gameColor = game==="wm"?T.wm:T.sol;
  const versionGroups = features.reduce((acc,f)=>{ const k=f.version||"Other"; if(!acc[k]) acc[k]=[]; acc[k].push(f); return acc; },{});
  const versions = Object.keys(versionGroups);
  const VERSION_COLORS = ["#4A7BB5","#3E9E6A","#7A6EA8","#C27A3A","#B05080","#4A9A9A","#C05040"];
  const vCM = {}; versions.forEach((v,i)=>{ vCM[v]=VERSION_COLORS[i%VERSION_COLORS.length]; });

  const filteredGroups = versionFilter==="all" ? versionGroups : { [versionFilter]: versionGroups[versionFilter]||[] };
  const selectedFeature = selected ? features.find(f=>f.id===selected) : null;

  const visibleDays = ALL_DAYS.slice(windowStart, windowStart+WINDOW_DAYS);
  const canPrev = windowStart>0, canNext = windowStart+WINDOW_DAYS<ALL_DAYS.length;
  const totalFeats = Object.values(filteredGroups).flat().length;
  const inProgress = features.filter(f=>["in-progress","live"].includes(f.status)).length;
  const atRisk     = features.filter(f=>f.risks?.length>0).length;

  const visibleWeeks = [];
  visibleDays.forEach((_,i)=>{
    const absIdx=windowStart+i, wk=Math.floor(absIdx/5);
    if (!visibleWeeks.length||visibleWeeks[visibleWeeks.length-1].weekIdx!==wk) visibleWeeks.push({weekIdx:wk,count:1,label:WEEK_GROUPS[wk]?.label||""});
    else visibleWeeks[visibleWeeks.length-1].count++;
  });

  return (
    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:12 }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { v:features.length, l:"Q2 Features",  s:game==="wm"?"Word Maker":"Solitaire", ck:"accent" },
            { v:inProgress,      l:"In Progress",  s:"Active features",                    ck:"ok"     },
            { v:atRisk,          l:"At Risk",       s:"Blockers or flags", ck:atRisk>0?"caution":"ok" },
            { v:WEEK_GROUPS[Math.floor(TODAY_IDX/5)]?.label||"—", l:"Current Week", s:fmt(TODAY), ck:"sol" },
          ].map(k=>(
            <div key={k.l} style={{ background:T.surface, border:`1px solid ${T.border}`, borderTop:`3px solid ${T[k.ck]}`, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:700, color:T[k.ck], lineHeight:1.2 }}>{k.v}</div>
              <div style={{ fontSize:10, fontWeight:700, color:T.muted, margin:"2px 0", textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.l}</div>
              <div style={{ fontSize:9, color:T.faint }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {["wm","sol"].map(g=>(
            <button key={g} onClick={()=>{ setGame(g); setSelected(null); setVersionFilter("all"); }} style={{
              padding:"5px 14px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
              border:`1.5px solid ${game===g?(g==="wm"?T.wm:T.sol):T.border}`,
              background:game===g?(g==="wm"?T.wm:T.sol)+"18":T.surface,
              color:game===g?(g==="wm"?T.wm:T.sol):T.muted,
            }}>{g==="wm"?"Word Maker":"Solitaire"}</button>
          ))}
          <div style={{width:1,height:18,background:T.border}}/>
          {[{id:"features",label:"⊟ Features"},{id:"resources",label:"👥 By Person"}].map(v=>(
            <button key={v.id} onClick={()=>setViewMode(v.id)} style={{
              padding:"5px 14px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
              border:`1.5px solid ${viewMode===v.id?T.accent:T.border}`,
              background:viewMode===v.id?T.navActiveBg:T.surface,
              color:viewMode===v.id?T.accent:T.muted,
            }}>{v.label}</button>
          ))}
          <button onClick={()=>setShowOOO(v=>!v)} style={{
            padding:"5px 14px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
            border:`1.5px solid ${showOOO?T.accent:T.border}`,
            background:showOOO?T.navActiveBg:T.surface, color:showOOO?T.accent:T.muted,
          }}>🏖 OOO</button>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            <button onClick={()=>setWindowStart(Math.max(0,windowStart-WINDOW_DAYS))} disabled={!canPrev}
              style={{ padding:"4px 10px", fontSize:11, fontWeight:700, borderRadius:6, cursor:canPrev?"pointer":"default", border:`1px solid ${T.border}`, background:T.surface, color:canPrev?T.text:T.faint }}>← Prev</button>
            <button onClick={()=>setWindowStart(Math.max(0,TODAY_IDX-2))}
              style={{ padding:"4px 10px", fontSize:11, fontWeight:700, borderRadius:6, cursor:"pointer", border:`1.5px solid ${T.accent}`, background:T.navActiveBg, color:T.accent }}>Today</button>
            <button onClick={()=>setWindowStart(Math.min(ALL_DAYS.length-WINDOW_DAYS,windowStart+WINDOW_DAYS))} disabled={!canNext}
              style={{ padding:"4px 10px", fontSize:11, fontWeight:700, borderRadius:6, cursor:canNext?"pointer":"default", border:`1px solid ${T.border}`, background:T.surface, color:canNext?T.text:T.faint }}>Next →</button>
          </div>
        </div>

        {/* Version pills */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
          <button onClick={()=>setVersionFilter("all")} style={{ padding:"2px 10px", fontSize:9, fontWeight:700, borderRadius:99, cursor:"pointer", border:`1px solid ${versionFilter==="all"?gameColor:T.border}`, background:versionFilter==="all"?gameColor+"18":T.surface, color:versionFilter==="all"?gameColor:T.faint }}>All</button>
          {versions.map(v=>(
            <button key={v} onClick={()=>setVersionFilter(v)} style={{ padding:"2px 10px", fontSize:9, fontWeight:700, borderRadius:99, cursor:"pointer", border:`1px solid ${versionFilter===v?vCM[v]:T.border}`, background:versionFilter===v?vCM[v]+"18":T.surface, color:versionFilter===v?vCM[v]:T.faint }}>
              <span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:vCM[v],marginRight:4 }} />{v}
            </button>
          ))}
          <span style={{ fontSize:9, color:T.faint, marginLeft:4 }}>{totalFeats} features</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
            {Object.entries(S).map(([st,s])=>(
              <div key={st} style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, color:T.faint }}>
                <div style={{ width:10, height:6, borderRadius:2, background:s.bar }}/>{s.label}
              </div>
            ))}
          </div>
        </div>

        {/* OOO strip */}
        {showOOO && <OOOStrip windowStart={windowStart} T={T} />}

        {/* Timeline */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
          {/* Week header */}
          <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, background:T.isDark?"#0C1220":"#F4F6F9" }}>
            <div style={{ width:LABEL_W, flexShrink:0, padding:"5px 12px", fontSize:9, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em", borderRight:`1px solid ${T.border}` }}>Feature / Track</div>
            <div style={{ flex:1, display:"flex" }}>
              {visibleWeeks.map((wg,i)=>(
                <div key={i} style={{ width:wg.count*DAY_W, flexShrink:0, padding:"5px 8px", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:wg.weekIdx===Math.floor(TODAY_IDX/5)?T.accent:T.faint, borderLeft:`1px solid ${T.border}` }}>
                  {wg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Day header */}
          <div style={{ display:"flex", borderBottom:`2px solid ${T.border}`, background:T.isDark?"#0C1220":"#F4F6F9" }}>
            <div style={{ width:LABEL_W, flexShrink:0, borderRight:`1px solid ${T.border}` }} />
            <div style={{ flex:1, display:"flex" }}>
              {visibleDays.map((day,i)=>{
                const absIdx=windowStart+i, isToday=absIdx===TODAY_IDX, isMon=i%5===0;
                const {holidays}=dayInfo(absIdx), isHol=holidays.length>0;
                return (
                  <div key={i} style={{ width:DAY_W, flexShrink:0, textAlign:"center", padding:"3px 2px", borderLeft:isMon?`1.5px solid ${T.border}`:`1px solid ${T.isDark?"#1A2535":"#ECEEF2"}`, background:isHol?"rgba(74,154,154,0.1)":isToday?"rgba(244,164,40,0.12)":"transparent" }}>
                    <div style={{ fontSize:8, color:isHol?"#4A9A9A":isToday?T.accent:T.faint, fontWeight:isToday?700:400 }}>{DAY_NAMES[i%5]}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:isHol?"#4A9A9A":isToday?T.accent:T.text }}>{day.getDate()}</div>
                    {isHol && <div style={{ fontSize:7, color:"#4A9A9A", lineHeight:1.1 }}>{holidays[0].name.substring(0,6)}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div style={{ position:"relative" }}>
            {/* Today highlight */}
            {TODAY_IDX>=windowStart && TODAY_IDX<windowStart+WINDOW_DAYS && (
              <div style={{ position:"absolute", left:LABEL_W+(TODAY_IDX-windowStart)*DAY_W, top:0, bottom:0, width:DAY_W, background:"rgba(244,164,40,0.04)", pointerEvents:"none", zIndex:0 }}>
                <div style={{ position:"absolute", top:0, left:0, bottom:0, width:2, background:T.accent, opacity:0.5 }} />
              </div>
            )}
            {/* OOO + holiday column tints */}
            {visibleDays.map((_,i)=>{
              const {ooo,holidays}=dayInfo(windowStart+i);
              const isHol=holidays.length>0;
              if (!isHol&&!ooo.length) return null;
              return <div key={i} style={{ position:"absolute", left:LABEL_W+i*DAY_W, top:0, bottom:0, width:DAY_W, background:isHol?"rgba(74,154,154,0.06)":"rgba(192,80,64,0.04)", pointerEvents:"none" }} />;
            })}

            {viewMode==="features" ? (
              Object.entries(filteredGroups).map(([version,feats])=>{
                const vColor=vCM[version]||gameColor, isCol=collapsed[version];
                return (
                  <div key={version}>
                    <VersionHeader label={version} color={vColor} features={feats} T={T} windowStart={windowStart} expanded={!isCol} onToggle={()=>setCollapsed(c=>({...c,[version]:!c[version]}))} />
                    {!isCol && feats.map(f=>(
                      <FeatureRow key={f.id} feature={f} vColor={vColor} T={T} windowStart={windowStart} visibleDays={visibleDays} isSelected={selected===f.id} onSelect={setSelected} />
                    ))}
                  </div>
                );
              })
            ) : (
              <ResourceView features={Object.values(filteredGroups).flat()} T={T} windowStart={windowStart} visibleDays={visibleDays} />
            )}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedFeature && <DetailPanel feature={selectedFeature} vColor={vCM[selectedFeature.version]||gameColor} T={T} onClose={()=>setSelected(null)} />}
    </div>
  );
}
