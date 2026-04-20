import { useState, createContext, useContext } from "react";

// ── Theme definitions ──────────────────────────────────────────────────────
const LIGHT = {
  bg:           "#F0F2F5",
  topbar:       "#1E2530",
  topbarBorder: "#2D3545",
  topbarTitle:  "#E8ECF2",
  topbarSub:    "#7B8799",
  navActive:    "#F4A428",
  navActiveBg:  "#2D2A1A",
  surface:      "#FFFFFF",
  surfaceAlt:   "#ECEEF3",
  border:       "#D8DCE5",
  text:         "#1E2530",
  muted:        "#5A6172",
  faint:        "#8B93A8",
  wm:           "#3E9E6A",
  sol:          "#4A7BB5",
  ok:           "#2E8A5A",
  warn:         "#B07020",
  caution:      "#8A3828",
  accent:       "#F4A428",
  badgeBg:      "#FEF5E8",
  badgeText:    "#B07020",
  panelBg:      "#1E2530",
  panelText:    "#E8ECF2",
  panelMuted:   "#7B8799",
  panelAlt:     "#252D3D",
  panelBorder:  "#2D3545",
  isDark:       false,
};

const DARK = {
  bg:           "#0C1017",
  topbar:       "#0A0E14",
  topbarBorder: "#1C2535",
  topbarTitle:  "#E8ECF4",
  topbarSub:    "#4A5570",
  navActive:    "#F4A428",
  navActiveBg:  "#2A2510",
  surface:      "#131924",
  surfaceAlt:   "#1A2130",
  border:       "#222C3D",
  text:         "#DDE2EE",
  muted:        "#8892A8",
  faint:        "#3E4A60",
  wm:           "#4EC994",
  sol:          "#60A8D8",
  ok:           "#3DC97A",
  warn:         "#F4A428",
  caution:      "#F07070",
  accent:       "#F4A428",
  badgeBg:      "#2A2510",
  badgeText:    "#F4A428",
  panelBg:      "#0A0E14",
  panelText:    "#E8ECF4",
  panelMuted:   "#4A5570",
  panelAlt:     "#131924",
  panelBorder:  "#1C2535",
  isDark:       true,
};

const ThemeCtx = createContext(LIGHT);
const useT = () => useContext(ThemeCtx);

// ── Data ───────────────────────────────────────────────────────────────────
const GAMES = [
  { id:"wm",  label:"Word Maker", pm:"Didara Pernebayeva", colorKey:"wm",
    sprintLabel:"1.47.0 – Beginner's Bonus", buildLive:"1.46.0 @ 10% Android",
    retention:"D3 –4% vs baseline", retentionStatus:"on-track", activeIssues:3, retentionPct:46 },
  { id:"sol", label:"Solitaire",  pm:"Srikanth Reddy",     colorKey:"sol",
    sprintLabel:"Active sprint — 5.7.x features", buildLive:"v5.7.0 @ limited rollout",
    retention:"D7 +20% above 8.5–10% baseline", retentionStatus:"in-progress", activeIssues:2, retentionPct:30 },
];

const INITIATIVES = [
  { id:"crashbot",       label:"Claude Crash Analysis Bot",   owner:"Carlos / Yevhenii",    colorKey:"wm",     type:"AI",      status:"Live — automated",
    summary:"Auto-analyses Crashlytics crashes and generates full root cause, reproduction steps, fix + acceptance criteria. Created 8 detailed CHSOL tickets this morning alone.",
    note:"Most technically impressive AI initiative in the division." },
  { id:"darya-bot",      label:"Darya Review Bot",            owner:"Darya Ashurkevich",    colorKey:"wm",     type:"AI",      status:"Live — since Mar 11",
    summary:"Automated Monday store review report on #ch-wordmaker-main. Parses reviews, categorises issues, auto-tags owners.",
    note:"Case study for AI impact tracking." },
  { id:"slack-resource-bot", label:"Slack Resource Allocation Bot", owner:"Dheeraj Rai",   colorKey:"accent", type:"AI",      status:"Planned — Q2",
    summary:"Daily Slack agent posting who is working where each morning. Reads the rotation schedule + any overrides and posts a digest to #ch-chardonnay. Will eventually be live-updated when blockers cause mid-week jumps.",
    note:"Requires: rotation schedule locked in Confluence, Slack webhook, Claude API integration. This is the next AI build after Command Centre." },
  { id:"alt-tester",    label:"ALT Tester Automation",       owner:"Kris Pillai",          colorKey:"sol",    type:"AI",      status:"In progress",
    summary:"Automated test suite for Solitaire using ALT Tester. Framework scoped by Kris. Needs dev to integrate into build pipeline.",
    note:"Dev time not allocated — raise with Carlos." },
  { id:"remote-cfg-ai", label:"Remote Config AI Tool",        owner:"Giulia Galvani",       colorStatic:"#C27A3A", type:"AI", status:"In progress",
    summary:"AI-assisted remote config management using Cursor + Claude for MetaPlay. Targets faster, lower-error config changes.",
    note:"Early stage — no output metrics yet." },
  { id:"command-centre", label:"Command Centre",              owner:"Dheeraj Rai",          colorKey:"accent", type:"AI",      status:"Live — v1.6",
    summary:"This dashboard. Aggregates Jira, Slack, Confluence, analytics. Week 3: live Jira. Week 4: Slack resource agent.",
    note:"Solitaire retention data needs Appodeal analytics connection." },
  { id:"jira-overhaul",  label:"Jira Standards Overhaul",     owner:"Dheeraj Rai",          colorKey:"sol",    type:"Process", status:"Week 3 — planned",
    summary:"Unified Epic → Story → Task structure, templates, description standards, release linking. Solitaire is priority; WM is benchmark.",
    note:"Alignment session with all PMs + Kris needed first." },
  { id:"release-train",  label:"2-Week Release Train",         owner:"Dheeraj + Chardonnay", colorStatic:"#7A6EA8", type:"Process", status:"Proposed",
    summary:"Formalise 2-week cadence: QA gate, rollout %, KPI tracking per release, release notes, hotfix process.",
    note:"PM buy-in not complete." },
  { id:"metaplay",       label:"MetaPlay Live Ops",            owner:"Giulia Galvani",       colorStatic:"#C27A3A", type:"Product", status:"In progress",
    summary:"Live Ops integration. Giulia + Pablo. Release train from May 2026. Block Tok paused — management decision pending.",
    note:"Scope undecided — Solitaire-only or multi-game." },
];

const TEAM = [
  { initials:"DR", name:"Dheeraj Rai",         role:"Sr. Project Manager", game:"All",        gameId:"all",    focus:"Division-wide" },
  { initials:"JP", name:"Jordi Pulles",         role:"CPO",                 game:"All",        gameId:"all",    focus:"Division-wide" },
  { initials:"CP", name:"Carlos Person",        role:"Head of Dev",         game:"All",        gameId:"all",    focus:"Division-wide" },
  { initials:"DP", name:"Didara Pernebayeva",   role:"Product Manager",     game:"Word Maker", gameId:"wm",     focus:"Word Maker full-time", remote:true },
  { initials:"SR", name:"Srikanth Reddy",       role:"Product Manager",     game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"GG", name:"Giulia Galvani",       role:"PM / SPM",            game:"MetaPlay",   gameId:"init",   focus:"MetaPlay initiative" },
  { initials:"TP", name:"Toni Puig",            role:"Lead Dev",            game:"Word Maker", gameId:"wm",     focus:"Word Maker full-time" },
  { initials:"VR", name:"Víctor Romero",        role:"Developer",           game:"Word Maker", gameId:"wm",     focus:"Word Maker full-time" },
  { initials:"JS", name:"Juan Sabater",         role:"Dev / TA",            game:"Word Maker", gameId:"wm",     focus:"Word Maker full-time" },
  { initials:"YS", name:"Yevhenii Siechko",     role:"Tech Lead",           game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"AM", name:"Angel Miladinov",      role:"Developer",           game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"MK", name:"Murat Kacmaz",         role:"Developer",           game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"HN", name:"Henrique Nakajima",    role:"Artist",              game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"GM", name:"Guillem Montserrat",   role:"Artist",              game:"Solitaire",  gameId:"sol",    focus:"Solitaire full-time" },
  { initials:"JZ", name:"Juan Zambrana",        role:"Technical Artist",    game:"WM + Sol",   gameId:"shared", badge:"shared",     focus:"This week: Word Maker", rotation:true },
  { initials:"KP", name:"Kris Pillai",          role:"QA Lead",             game:"WM + Sol",   gameId:"shared", badge:"bottleneck", focus:"This week: Word Maker", rotation:true },
  { initials:"AN", name:"Andreu Margarit",      role:"QA",                  game:"WM + Sol",   gameId:"shared", focus:"WM primary · Sol support" },
];

// ── Weekly rotation schedule (shared resources: Juan Z + Kris) ────────────
const RESOURCE_SCHEDULE = [
  { week:"Apr 20–25",   primary:"wm",  status:"current", label:"This week"  },
  { week:"Apr 27–May 2",primary:"sol", status:"next",    label:"Next week"  },
  { week:"May 5–9",     primary:"wm",  status:"future",  label:""           },
  { week:"May 12–16",   primary:"sol", status:"future",  label:""           },
  { week:"May 19–23",   primary:"wm",  status:"future",  label:""           },
  { week:"May 26–30",   primary:"sol", status:"future",  label:""           },
];

const WM_ROADMAP = [
  { version:"1.46.0", milestone:"M7",  month:"Apr", feature:"Collectible Event (Gems/Lanterns/Chain Tiles)", target:"D1–D3 retention", status:"live"    },
  { version:"1.47.0", milestone:"M8",  month:"Apr", feature:"Jigsaw Puzzle + feature foreshadowing",         target:"D2–D3 retention", status:"active"  },
  { version:"1.48.0", milestone:"M9",  month:"May", feature:"Word Master Chained Reward",                    target:"D1–D3 retention", status:"next"    },
  { version:"1.49.0", milestone:"M10", month:"Jun", feature:"Breather Levels — new gameplay mode",           target:"D3–D7 retention", status:"planned" },
  { version:"1.50.0", milestone:"M11", month:"Jun", feature:"Meta progress + FTUE polish",                   target:"D1→D3–D7 uplift", status:"planned" },
];

const WM_ISSUES = [
  { desc:"App must reload after every ad",              version:"v1.40.1", owners:"Roman + Viktor"  },
  { desc:"App freezes on puzzle, force-close required",  version:"v1.39.2", owners:"Kris + Andreu"  },
  { desc:"Deceptive cross-promo redirect",              version:"v1.40.1", owners:"Unassigned"      },
];

const SOL_VERSIONS = [
  { v:"v4.3.4", users:"139,070", winRate:"99.9%", avgWin:"2.9m", kind:"old", note:"Old build — root cause of QA multi-version burden" },
  { v:"v5.6.0", users:"6,901",   winRate:"94.9%", avgWin:"2.8m", kind:"mid", note:"New rebuild — 60–70% feature complete"              },
  { v:"v5.7.0", users:"2,378",   winRate:"94.4%", avgWin:"2.8m", kind:"new", note:"Just released — Crashlytics stable (Apr 18)"         },
];

const SOL_CRASHES = [
  { id:"CHSOL-1366", issue:"libil2cpp.so SIGTRAP",          device:"Motorola moto g pure",  note:"Ad WebView corrupting IL2CPP on low-RAM device"      },
  { id:"CHSOL-1365", issue:"libc.so fatal crash",           device:"Motorola moto g series",note:"Ad WebView / Appodeal bridge on low-RAM devices"      },
  { id:"CHSOL-1364", issue:"MainBoostersUnlockTracker NRE", device:"Multiple",              note:"Migration runs before Initialize — order bug"          },
  { id:"CHSOL-1363", issue:"AutoCompleteService NRE",       device:"Multiple",              note:"StageManager null on offline cold-start"               },
  { id:"CHSOL-1362", issue:"ANR — WebView freeze",          device:"OnePlus DE2118",        note:"11 notifications + SessionProgression on main thread"  },
  { id:"CHSOL-1361", issue:"CardItem card cycle crash",     device:"Multiple",              note:"Rapid replay creates card chain loop"                  },
];

const SOL_ACTIVE = [
  { key:"CHSOL-1367", summary:"[Art] Level Up Screen",                       assignee:"Henrique", status:"In Progress"   },
  { key:"CHSOL-1329", summary:"[Art] Results screen",                        assignee:"Henrique", status:"Review"        },
  { key:"CHSOL-1357", summary:"[Dev] Journey to live ops system",            assignee:"Angel",    status:"In Progress"   },
  { key:"CHSOL-1344", summary:"[Dev] Coins between cards — shuffle/magic",   assignee:"Angel",    status:"Review"        },
  { key:"CHSOL-1312", summary:"[Dev] Logic for coins behind cards",           assignee:"Angel",    status:"Ready for QA"  },
  { key:"CHSOL-1352", summary:"Keep infinite time on game relaunch",          assignee:"Murat",    status:"Ready for QA"  },
  { key:"CHSOL-1345", summary:"[Bug] Card to pile instead of foundation",     assignee:"Murat",    status:"Ready for QA"  },
  { key:"CHSOL-1355", summary:"Left hand mode UI broken ⚠ HIGH — unassigned",assignee:"—",        status:"Backlog"       },
  { key:"CHSOL-1358", summary:"[Code] New quest popup design",                assignee:"Murat",    status:"Backlog"       },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function useColor(colorKey, colorStatic) {
  const T = useT();
  if (colorStatic) return colorStatic;
  return T[colorKey] || T.accent;
}

function Dot({ colorKey, colorStatic, size=8 }) {
  const color = useColor(colorKey, colorStatic);
  return <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:color, flexShrink:0 }} />;
}

function Badge({ label, bg, text }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:99, background:bg, color:text, whiteSpace:"nowrap", letterSpacing:"0.02em" }}>
      {label}
    </span>
  );
}

function Card({ children, style={} }) {
  const T = useT();
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px", transition:"background 0.25s, border-color 0.25s", ...style }}>
      {children}
    </div>
  );
}

function Sec({ label }) {
  const T = useT();
  return <div style={{ fontSize:10, fontWeight:700, color:T.faint, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>{label}</div>;
}

function Bar({ pct, colorKey, h=6 }) {
  const T = useT();
  const color = T[colorKey] || T.accent;
  return (
    <div style={{ background:T.surfaceAlt, borderRadius:99, height:h, overflow:"hidden" }}>
      <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.4s ease" }} />
    </div>
  );
}

function DarkPanel({ children, style={} }) {
  const T = useT();
  return (
    <div style={{ background:T.panelBg, borderRadius:12, padding:"14px 18px", border:`1px solid ${T.panelBorder}`, transition:"background 0.25s", ...style }}>
      {children}
    </div>
  );
}

function StatusBadge({ s }) {
  const T = useT();
  const map = {
    "In Progress": [T.isDark ? "#1A2840" : "#EEF4FB", T.sol],
    "Review":      [T.isDark ? "#221A38" : "#F3F0FA", T.isDark ? "#A08AE0" : "#6B52A8"],
    "Ready for QA":[T.badgeBg, T.warn],
    "Backlog":     [T.surfaceAlt, T.faint],
    "Done":        [T.isDark ? "#0E2A1C" : "#E8F5EE", T.ok],
  };
  const [bg, txt] = map[s] || [T.surfaceAlt, T.faint];
  return <Badge label={s} bg={bg} text={txt} />;
}

function ThemeToggle({ isDark, onToggle }) {
  const T = useT();
  return (
    <button onClick={onToggle} style={{
      display:"flex", alignItems:"center", gap:8, padding:"5px 12px",
      borderRadius:99, border:`1px solid ${T.topbarBorder}`,
      background: isDark ? "#252D3D" : "#2D3545",
      cursor:"pointer", transition:"all 0.2s", flexShrink:0,
    }}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3.5" stroke={isDark ? T.faint : T.accent} strokeWidth="1.5"/>
        {[0,45,90,135,180,225,270,315].map(a => {
          const r = a * Math.PI / 180;
          const x1 = 8 + 5.5 * Math.cos(r), y1 = 8 + 5.5 * Math.sin(r);
          const x2 = 8 + 7   * Math.cos(r), y2 = 8 + 7   * Math.sin(r);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isDark ? T.faint : T.accent} strokeWidth="1.5" strokeLinecap="round"/>;
        })}
      </svg>
      <div style={{ width:32, height:18, borderRadius:99, background: isDark ? T.accent : "#3A4558", position:"relative", transition:"background 0.25s" }}>
        <div style={{ position:"absolute", top:3, left: isDark ? 15 : 3, width:12, height:12, borderRadius:"50%", background:"#ffffff", transition:"left 0.2s ease", boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }} />
      </div>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M13 9.5A6 6 0 0 1 6.5 3c0-.3 0-.6.03-.9A6.5 6.5 0 1 0 13.9 9.97c-.3.03-.6.03-.9.03v-.5z" stroke={isDark ? T.accent : T.faint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ── Pages ──────────────────────────────────────────────────────────────────
function OverviewPage() {
  const T = useT();
  return (
    <div style={{ display:"grid", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { v:"2",      l:"Active games",       s:"Word Maker · Solitaire"                    },
          { v:"9",      l:"Initiatives",        s:"5 AI · 2 process · 1 product + CC"         },
          { v:"5",      l:"Open blockers",      s:"QA bandwidth · TA priority · MetaPlay scope"},
          { v:"v5.7.0", l:"Sol latest build",   s:"Crashlytics stable · rolling out"           },
        ].map(s => (
          <div key={s.l} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", textAlign:"center", transition:"background 0.25s" }}>
            <div style={{ fontSize:26, fontWeight:700, color:T.text, lineHeight:1.15, letterSpacing:"-0.02em" }}>{s.v}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, margin:"3px 0 2px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.l}</div>
            <div style={{ fontSize:10, color:T.faint }}>{s.s}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:12 }}>
        <Card>
          <Sec label="Game status — Apr 20 2026" />
          {GAMES.map((g, i) => (
            <div key={g.id} style={{ paddingBottom:12, marginBottom:i<1?12:0, borderBottom:i<1?`1px solid ${T.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <div style={{ width:3, minHeight:36, borderRadius:2, background:T[g.colorKey], flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:T.text }}>{g.label}</span>
                    <span style={{ fontSize:11, color:T.faint }}>— {g.pm}</span>
                    <div style={{ marginLeft:"auto" }}>
                      {g.activeIssues > 0
                        ? <Badge label={`${g.activeIssues} issues`} bg={T.isDark?"#2A1A18":"#FCEAE6"} text={T.caution} />
                        : <Badge label="Clear" bg={T.isDark?"#0E2A1C":"#E8F5EE"} text={T.ok} />}
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:T.muted }}>{g.sprintLabel} · {g.buildLive}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:4, padding:"10px 12px", background:T.surfaceAlt, borderRadius:8, borderLeft:"3px solid #C27A3A" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:1 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.text }}>MetaPlay Live Ops</span>
              <Badge label="Initiative — not a game" bg={T.badgeBg} text={T.badgeText} />
            </div>
            <div style={{ fontSize:11, color:T.faint }}>Giulia + Pablo · Scope TBD · May release train</div>
          </div>
        </Card>
        <div style={{ display:"grid", gap:12 }}>
          <DarkPanel>
            <Sec label="Division health" />
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:11, height:11, borderRadius:"50%", background:T.accent }} />
              <span style={{ fontWeight:700, fontSize:14, color:T.panelText }}>Amber — action required</span>
            </div>
            <div style={{ fontSize:12, color:T.panelMuted, lineHeight:1.6 }}>
              QA stretched across 3 workstreams. Shared TA lacks priority framework. 139K users on old v4.3.4 creating multi-version QA burden. Release train not yet formalised.
            </div>
          </DarkPanel>
          <Card>
            <Sec label="Priority actions this week" />
            {[
              "QA priority order — 3 workstreams (Dheeraj + Carlos)",
              "TA sync — Srikanth + Didara + Juan",
              "Assign CHSOL-1355 (left hand mode, High priority)",
              "WM store issues — ad reload + freeze (3 critical)",
              "Baseline metrics conversation with Jordi",
            ].map((a, i) => (
              <div key={i} style={{ display:"flex", gap:10, fontSize:12, color:T.muted, marginBottom:7 }}>
                <span style={{ color:T.accent, fontWeight:700, flexShrink:0 }}>→</span>
                <span style={{ lineHeight:1.4 }}>{a}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Card>
        <Sec label="Shared resources — current allocation" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {[
            { name:"Juan Zambrana — Technical Artist", alloc:[{l:"Word Maker",k:"wm",w:50},{l:"Solitaire",k:"sol",w:50}], issue:"This week: Word Maker · Next week: Solitaire" },
            { name:"Kris Pillai — QA Lead", alloc:[{l:"WM",k:"wm",w:33},{l:"Solitaire",k:"sol",w:34},{l:"MetaPlay",s:"#C27A3A",w:33}], issue:"This week: Word Maker · Next week: Solitaire · MetaPlay as needed" },
          ].map(r => (
            <div key={r.name}>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:7 }}>{r.name}</div>
              <div style={{ display:"flex", borderRadius:7, overflow:"hidden", height:24, marginBottom:6 }}>
                {r.alloc.map(a => (
                  <div key={a.l} style={{ width:`${a.w}%`, background:a.s || T[a.k], display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:9, color:"white", fontWeight:700 }}>{a.l}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:T.ok, fontWeight:600 }}>{r.issue}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WordMakerPage() {
  const T = useT();
  return (
    <div style={{ display:"grid", gap:16 }}>
      <DarkPanel style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:12, height:12, borderRadius:"50%", background:T.wm }} />
        <div>
          <div style={{ fontWeight:700, fontSize:16, color:T.panelText }}>Word Maker</div>
          <div style={{ fontSize:12, color:T.panelMuted }}>PM: Didara Pernebayeva · Remote (Kazakhstan) · Android · Live product</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <Badge label="Live" bg={T.isDark?"#0E2A1C":"#E8F5EE"} text={T.ok} />
          <Badge label="Q2 experiment programme" bg={T.navActiveBg} text={T.accent} />
        </div>
      </DarkPanel>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { v:"–4% vs baseline", l:"D3 retention",  s:"On track → target +20%", ck:"ok" },
          { v:"2 / 7",          l:"Experiments",    s:"On track for EOQ2",      ck:"ok" },
          { v:"3.9 / 5",        l:"Store rating",   s:"↓ from 4.3 last week",   ck:"warn" },
          { v:"1.46.0",         l:"Live build",     s:"10% Android rollout",     ck:"accent" },
        ].map(k => (
          <Card key={k.l} style={{ textAlign:"center", borderTop:`3px solid ${T[k.ck]}` }}>
            <div style={{ fontSize:20, fontWeight:700, color:T[k.ck], lineHeight:1.2, marginTop:4 }}>{k.v}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, margin:"3px 0", textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.l}</div>
            <div style={{ fontSize:10, color:T.faint }}>{k.s}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:12 }}>
        <Card>
          <Sec label="Q2 OKR — D3 retention programme" />
          <div style={{ fontSize:12, color:T.muted, marginBottom:14, lineHeight:1.6 }}>
            ≥20% relative D3 uplift vs v1.45.0. Baseline: <strong style={{color:T.text}}>11.1% D3</strong> (Mar 30–Apr 5, locked). Target: ≥13.3%. Sergey Orlov validates all cohorts before any external communication.
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginBottom:5 }}>
              <span>D3 journey (–13% baseline → +20% target)</span>
              <span style={{ color:T.ok, fontWeight:700 }}>On track</span>
            </div>
            <Bar pct={46} colorKey="ok" h={8} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.faint, marginTop:3 }}>
              <span>–13%</span><span>Now: –4%</span><span>+20%</span>
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginBottom:5 }}>
              <span>Experiment progress</span><span style={{ color:T.ok, fontWeight:700 }}>2 / 7</span>
            </div>
            <Bar pct={28} colorKey="wm" h={8} />
          </div>
          <div style={{ padding:"9px 12px", background:T.surfaceAlt, borderRadius:8, fontSize:11, color:T.muted, borderLeft:`3px solid ${T.accent}` }}>
            ARPU D1/D7 down ~30% vs baseline — expected. Retention is the Q2 priority.
          </div>
        </Card>
        <div style={{ display:"grid", gap:12 }}>
          <Card>
            <Sec label="Sprint 1.47.0 — Beginner's Bonus" />
            {[
              { t:"Art assets delivered — Juan Zambrana", done:true  },
              { t:"Prefabs — Juan Sabater (PR open)",     done:true  },
              { t:"Logic build — Toni Puig",              done:false },
              { t:"Firebase spec confirmed — Didara",     done:true  },
              { t:"Word Master spec clarifications",       done:false },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:8, fontSize:11, color:T.muted, marginBottom:7 }}>
                <span style={{ color:item.done ? T.ok : T.faint, fontWeight:700, flexShrink:0 }}>{item.done ? "✓" : "·"}</span>
                <span>{item.t}</span>
              </div>
            ))}
          </Card>
          <Card>
            <Sec label="Store issues — Apr 20 (Darya bot)" />
            {WM_ISSUES.map((iss, i) => (
              <div key={i} style={{ display:"flex", gap:9, marginBottom:8 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:T.caution, marginTop:3, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:11, color:T.text, fontWeight:600 }}>{iss.desc}</div>
                  <div style={{ fontSize:10, color:T.faint }}>{iss.version} · {iss.owners}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Card>
        <Sec label="Q2 Roadmap — M7 to M11" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {WM_ROADMAP.map(r => {
            const topColor = r.status==="live" ? T.ok : r.status==="active" ? T.accent : T.border;
            return (
              <div key={r.version} style={{ padding:"12px 14px", borderRadius:10, background:T.surfaceAlt, border:`1px solid ${T.border}`, borderTop:`3px solid ${topColor}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:topColor }}>{r.month}</span>
                  <span style={{ fontSize:10, color:T.faint }}>{r.version}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:4 }}>{r.milestone}</div>
                <div style={{ fontSize:10, color:T.muted, lineHeight:1.45, marginBottom:6 }}>{r.feature}</div>
                <div style={{ fontSize:10, color:T.faint, fontStyle:"italic", marginBottom:6 }}>↑ {r.target}</div>
                {r.status==="live"   && <Badge label="Live"      bg={T.isDark?"#0E2A1C":"#E8F5EE"} text={T.ok} />}
                {r.status==="active" && <Badge label="In sprint" bg={T.badgeBg}                    text={T.warn} />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SolitairePage() {
  const T = useT();
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ display:"grid", gap:16 }}>
      <DarkPanel style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:12, height:12, borderRadius:"50%", background:T.sol }} />
        <div>
          <div style={{ fontWeight:700, fontSize:16, color:T.panelText }}>Solitaire — Klondike</div>
          <div style={{ fontSize:12, color:T.panelMuted }}>PM: Srikanth Reddy · Tech Lead: Yevhenii Siechko · Firebase: klondike-solitaire-46f14</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <Badge label="Active" bg={T.isDark?"#1A2840":"#EEF4FB"} text={T.sol} />
          <Badge label="v5.7.0 rolling" bg={T.navActiveBg} text={T.accent} />
        </div>
      </DarkPanel>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { v:"99.55%", l:"Crash-free users", s:"All versions (Apr 10–17)",        ck:"ok"   },
          { v:"139K",   l:"Old build users",  s:"v4.3.4 still active — QA burden", ck:"warn" },
          { v:"94.4%",  l:"v5.7.0 win rate",  s:"Stable — can increase rollout",   ck:"ok"   },
          { v:"7",      l:"Open Jira",        s:"3 Ready for QA · 2 In Progress",  ck:"sol"  },
        ].map(k => (
          <Card key={k.l} style={{ textAlign:"center", borderTop:`3px solid ${T[k.ck]}` }}>
            <div style={{ fontSize:20, fontWeight:700, color:T[k.ck], lineHeight:1.2, marginTop:4 }}>{k.v}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, margin:"3px 0", textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.l}</div>
            <div style={{ fontSize:10, color:T.faint }}>{k.s}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"flex", gap:6 }}>
        {["overview","versions","jira","crashes"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"5px 16px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
            border:`1.5px solid ${tab===t ? T.accent : T.border}`,
            background: tab===t ? T.navActiveBg : T.surface,
            color: tab===t ? T.accent : T.muted, transition:"all 0.15s",
          }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Card>
            <Sec label="Current state" />
            {[
              ["Build",        "Rebuilding from v434. 1 feature at a time (no full refactor)"],
              ["Sprint cycle", "Friday → Thursday. Srikanth owns backlog"],
              ["Culture",      "Speed over quality. Validate in market first. Async"],
              ["Rollout",      "10–30% process defined but inconsistently applied"],
              ["Retro",        "Monthly (not sprint-aligned)"],
              ["Jira",         "CHSOL · Board 1860 · Task creation inconsistent"],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", gap:12, marginBottom:8 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.text, minWidth:80, flexShrink:0 }}>{l}</div>
                <div style={{ fontSize:11, color:T.muted, lineHeight:1.5 }}>{v}</div>
              </div>
            ))}
          </Card>
          <div style={{ display:"grid", gap:12 }}>
            <Card>
              <Sec label="Active sprint features" />
              {["Level Up Screen — Henrique (In Progress)","Results Screen — Henrique (Review)","Journey / live ops — Angel (In Progress)","Coins behind cards — Angel (Ready for QA)","Timer Booster — Srikanth flagged positive engagement","Quest popup Phase 2 — Murat (In Progress)"].map((s,i) => (
                <div key={i} style={{ display:"flex", gap:8, fontSize:11, color:T.muted, marginBottom:6 }}>
                  <span style={{ color:T.sol, fontWeight:700 }}>·</span><span>{s}</span>
                </div>
              ))}
            </Card>
            <Card>
              <Sec label="Team" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                {[["Srikanth","PM"],["Yevhenii","Tech Lead"],["Angel","Dev"],["Murat","Dev"],["Henrique","Artist"],["Guillem","Artist"]].map(([n,r]) => (
                  <div key={n} style={{ fontSize:11, color:T.muted }}>
                    <span style={{ fontWeight:700, color:T.text }}>{n}</span> · {r}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab==="versions" && (
        <Card>
          <Sec label="Version landscape — Apr 13–20 · US Android" />
          <div style={{ padding:"9px 12px", background:T.badgeBg, borderRadius:8, fontSize:11, color:T.badgeText, marginBottom:14, borderLeft:`3px solid ${T.accent}` }}>
            139,070 users still on v4.3.4. Root cause of QA's multi-version burden. v5.7.0 Crashlytics stable — Yevhenii green-lit rollout increase Apr 18.
          </div>
          <div style={{ display:"grid", gap:10 }}>
            {SOL_VERSIONS.map(v => {
              const leftColor = v.kind==="old" ? T.warn : v.kind==="new" ? T.ok : T.sol;
              const bg = v.kind==="old" ? T.badgeBg : v.kind==="new" ? (T.isDark?"#0E2A1C":"#E8F5EE") : T.surfaceAlt;
              return (
                <div key={v.v} style={{ display:"grid", gridTemplateColumns:"90px 100px 90px 80px 1fr", gap:14, alignItems:"center", padding:"11px 14px", background:bg, borderRadius:10, border:`1px solid ${T.border}`, borderLeft:`3px solid ${leftColor}` }}>
                  <div style={{ fontWeight:700, fontSize:14, color:T.text }}>{v.v}</div>
                  <div style={{ fontSize:12, color:T.text, fontWeight:600 }}>{v.users}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{v.winRate} win</div>
                  <div style={{ fontSize:11, color:T.muted }}>{v.avgWin} avg</div>
                  <div style={{ fontSize:10, color:v.kind==="old" ? T.warn : v.kind==="new" ? T.ok : T.muted, fontStyle:"italic" }}>{v.note}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:12, fontSize:11, color:T.muted }}>
            Crash-free rate all versions Apr 10–17: <strong style={{color:T.ok}}>99.55% users · 99.73% sessions</strong>
          </div>
        </Card>
      )}
      {tab==="jira" && (
        <Card>
          <Sec label="Active CHSOL tickets — Apr 20" />
          <div style={{ display:"grid", gap:8 }}>
            {SOL_ACTIVE.map(t => (
              <div key={t.key} style={{ display:"grid", gridTemplateColumns:"110px 1fr 100px 130px", gap:12, alignItems:"center", padding:"8px 12px", background:T.surfaceAlt, borderRadius:8, borderLeft:`2px solid ${T.sol}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.accent }}>{t.key}</div>
                <div style={{ fontSize:11, color:T.text }}>{t.summary}</div>
                <div style={{ fontSize:10, color:T.muted }}>{t.assignee}</div>
                <StatusBadge s={t.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
      {tab==="crashes" && (
        <Card>
          <Sec label="Crashlytics — v5.7.0 · Claude AI crash bot · Apr 20" />
          <div style={{ padding:"9px 12px", background:T.isDark?"#0E2A1C":"#E8F5EE", borderRadius:8, fontSize:11, color:T.ok, marginBottom:14, borderLeft:`3px solid ${T.ok}` }}>
            Claude AI crash bot auto-generated 8 tickets this morning with full root cause, reproduction steps, fix and acceptance criteria.
          </div>
          <div style={{ display:"grid", gap:9 }}>
            {SOL_CRASHES.map(c => (
              <div key={c.id} style={{ padding:"10px 14px", background:T.surfaceAlt, borderRadius:10, borderLeft:`2px solid ${T.sol}` }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:2 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:T.accent }}>{c.id}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{c.issue}</span>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{c.note}</div>
                    <div style={{ fontSize:10, color:T.faint, marginTop:1 }}>Device: {c.device}</div>
                  </div>
                  <StatusBadge s="Backlog" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function InitiativesPage() {
  const T = useT();
  const [filter, setFilter] = useState("All");
  const types = ["All","AI","Process","Product"];
  const filtered = filter==="All" ? INITIATIVES : INITIATIVES.filter(i => i.type===filter);
  const typeMeta = t => ({
    "AI":      { bg: T.isDark?"#0E2A1C":"#E8F5EE", text:T.ok   },
    "Process": { bg: T.isDark?"#1A2840":"#EEF4FB", text:T.sol  },
    "Product": { bg: T.badgeBg, text:T.badgeText },
  }[t] || { bg:T.surfaceAlt, text:T.muted });
  return (
    <div style={{ display:"grid", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {types.slice(1).map(t => {
          const m = typeMeta(t);
          return (
            <Card key={t} style={{ textAlign:"center", borderTop:`3px solid ${m.text}` }}>
              <div style={{ fontSize:28, fontWeight:700, color:m.text, marginTop:4 }}>{INITIATIVES.filter(i=>i.type===t).length}</div>
              <div style={{ fontSize:11, fontWeight:700, color:T.muted, margin:"3px 0", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t} initiatives</div>
            </Card>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:6 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding:"5px 16px", fontSize:11, fontWeight:700, borderRadius:99, cursor:"pointer",
            border:`1.5px solid ${filter===t ? T.accent : T.border}`,
            background: filter===t ? T.navActiveBg : T.surface,
            color: filter===t ? T.accent : T.muted, transition:"all 0.15s",
          }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gap:10 }}>
        {filtered.map(init => {
          const color = init.colorStatic || T[init.colorKey] || T.accent;
          const m = typeMeta(init.type);
          return (
            <div key={init.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderLeft:`3px solid ${color}`, borderRadius:"0 12px 12px 0", padding:"14px 18px", display:"grid", gridTemplateColumns:"200px 1fr 165px", gap:16, alignItems:"start", transition:"background 0.25s" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                  <Dot colorStatic={color} size={9} />
                  <span style={{ fontWeight:700, fontSize:13, color:T.text }}>{init.label}</span>
                </div>
                <div style={{ marginBottom:5 }}>
                  <Badge label={`${init.type} initiative`} bg={m.bg} text={m.text} />
                </div>
                <div style={{ fontSize:11, color:T.faint }}>Owner: {init.owner}</div>
              </div>
              <div>
                <div style={{ fontSize:12, color:T.muted, lineHeight:1.55, marginBottom:6 }}>{init.summary}</div>
                {init.note && <div style={{ fontSize:11, color:T.faint, fontStyle:"italic" }}>{init.note}</div>}
              </div>
              <div>
                <Badge
                  label={init.status}
                  bg={init.status.includes("Live") ? (T.isDark?"#0E2A1C":"#E8F5EE") : init.status.includes("progress") ? (T.isDark?"#1A2840":"#EEF4FB") : T.surfaceAlt}
                  text={init.status.includes("Live") ? T.ok : init.status.includes("progress") ? T.sol : T.muted}
                />
              </div>
            </div>
          );
        })}
      </div>
      <DarkPanel>
        <Sec label="AI baseline — week 1 anchor (Apr 2026)" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:12 }}>
          {[
            ["Release velocity",  "TBD — confirm with Jordi this week"],
            ["Crash-free rate",   "99.55% all versions (Apr 10–17) — anchor confirmed"],
            ["QA cycle time",     "TBD — no formal measure yet"],
            ["TA throughput",     "TBD — Juan tracking starts now"],
            ["PM spec time",      "TBD — confirm with Didara + Srikanth"],
          ].map(([m,b]) => (
            <div key={m} style={{ padding:"10px 12px", background:T.panelAlt, borderRadius:10, borderTop:`2px solid ${T.accent}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.accent, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m}</div>
              <div style={{ fontSize:11, color:T.panelMuted, lineHeight:1.4 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:"8px 12px", background:T.panelAlt, borderRadius:8, fontSize:11, color:T.panelMuted, borderLeft:`3px solid ${T.accent}` }}>
          Set baseline with Jordi this week. Conservative rule: share results only after 4+ weeks of stable data.
        </div>
      </DarkPanel>
    </div>
  );
}

// ── Team page — full resource schedule view ────────────────────────────────
function TeamPage() {
  const T = useT();
  const gColor = id => ({ wm:T.wm, sol:T.sol, init:"#C27A3A", shared:T.accent, all:T.muted }[id] || T.faint);

  const currentWeek = RESOURCE_SCHEDULE.find(w => w.status==="current");
  const currentColor = currentWeek ? T[currentWeek.primary] : T.wm;
  const currentLabel = currentWeek?.primary === "wm" ? "Word Maker" : "Solitaire";

  return (
    <div style={{ display:"grid", gap:16 }}>

      {/* ── THIS WEEK callout ── */}
      <div style={{ background:T.topbar, borderRadius:12, padding:"18px 22px", border:`1px solid ${T.panelBorder}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:T.panelMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>Shared resources — this week</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:12, height:12, borderRadius:"50%", background:currentColor }} />
            <span style={{ fontSize:18, fontWeight:700, color:T.panelText }}>Apr 20–25 · {currentLabel}</span>
          </div>
          {[
            { initials:"JZ", name:"Juan Zambrana", role:"Technical Artist", thisWeek:currentLabel },
            { initials:"KP", name:"Kris Pillai",   role:"QA Lead",          thisWeek:currentLabel },
          ].map(p => (
            <div key={p.initials} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:currentColor+"30", border:`2px solid ${currentColor}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:11, fontWeight:700, color:currentColor }}>{p.initials}</span>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:T.panelText }}>{p.name}</div>
                <div style={{ fontSize:10, color:T.panelMuted }}>{p.role} · Primary: {p.thisWeek}</div>
              </div>
              <div style={{ marginLeft:"auto" }}>
                <Badge label={`On ${p.thisWeek}`} bg={currentColor+"30"} text={currentColor} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:T.panelMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>Override rule</div>
          <div style={{ fontSize:12, color:T.panelMuted, lineHeight:1.6, marginBottom:10 }}>
            Juan + Kris stay on their primary project for the full week. They jump to the other project <strong style={{color:T.accent}}>only for Critical or High priority blockers</strong> — and only if the PM co-ordinates with Dheeraj first.
          </div>
          <div style={{ fontSize:12, color:T.panelMuted, lineHeight:1.5 }}>
            Mid-week jumps get logged here and fed into the Slack Resource Bot when it launches.
          </div>
          <div style={{ marginTop:10, padding:"7px 10px", background:T.panelAlt, borderRadius:8, fontSize:11, color:T.accent, borderLeft:`2px solid ${T.accent}` }}>
            Coming soon: daily Slack digest auto-posting who is working where → see Initiatives page
          </div>
        </div>
      </div>

      {/* ── 6-week rotation calendar ── */}
      <Card>
        <Sec label="6-week rotation calendar — Juan Zambrana & Kris Pillai" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:12 }}>
          {RESOURCE_SCHEDULE.map(w => {
            const isCurrent = w.status==="current";
            const isNext    = w.status==="next";
            const wColor    = T[w.primary];
            const wLabel    = w.primary==="wm" ? "Word Maker" : "Solitaire";
            return (
              <div key={w.week} style={{
                borderRadius:10, padding:"10px 12px", textAlign:"center",
                background: isCurrent ? wColor+"18" : T.surfaceAlt,
                border: `1px solid ${isCurrent ? wColor : T.border}`,
                borderTop:`3px solid ${isCurrent ? wColor : isNext ? T.faint : T.border}`,
              }}>
                {w.label && <div style={{ fontSize:9, fontWeight:700, color: isCurrent ? wColor : T.faint, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{w.label}</div>}
                <div style={{ width:28, height:28, borderRadius:"50%", background:wColor+(isCurrent?"":"40"), margin:"0 auto 6px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:9, color: isCurrent ? "#fff" : wColor, fontWeight:700 }}>{w.primary==="wm" ? "WM" : "SOL"}</span>
                </div>
                <div style={{ fontSize:11, fontWeight:700, color: isCurrent ? T.text : T.muted }}>{wLabel}</div>
                <div style={{ fontSize:9, color:T.faint, marginTop:3 }}>{w.week}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}><Dot colorKey="wm" size={8} />Word Maker weeks</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}><Dot colorKey="sol" size={8} />Solitaire weeks</div>
          <div style={{ marginLeft:"auto", fontSize:11, color:T.faint }}>Andreu Margarit follows WM primary, supports Sol on overflow</div>
        </div>
      </Card>

      {/* ── Full team directory ── */}
      <Card>
        <Sec label="Full team directory" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {TEAM.map(p => {
            const c = gColor(p.gameId);
            return (
              <div key={p.initials} style={{ background:T.surfaceAlt, borderRadius:10, padding:"12px 14px", border:`1px solid ${T.border}`, borderTop:`2px solid ${c}` }}>
                <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:8 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:T.surface, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${c}`, flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:c }}>{p.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{p.name}</div>
                    <div style={{ fontSize:10, color:T.faint }}>{p.role}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:T.muted, marginBottom:6, lineHeight:1.4 }}>{p.focus}</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {p.remote  && <Badge label="Remote"      bg={T.surface}    text={T.muted}   />}
                  {p.badge==="shared"     && <Badge label="Shared"     bg={T.badgeBg}    text={T.warn}    />}
                  {p.badge==="bottleneck" && <Badge label="Bottleneck" bg={T.isDark?"#2A1A18":"#FCEAE6"} text={T.caution} />}
                  {p.rotation && <Badge label="On rotation" bg={T.accent+"20"} text={T.accent} />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"overview",    label:"Overview"     },
  { id:"wordmaker",   label:"Word Maker"   },
  { id:"solitaire",   label:"Solitaire"    },
  { id:"initiatives", label:"Initiatives"  },
  { id:"team",        label:"Team"         },
];

export default function App() {
  const [tab, setTab]     = useState("overview");
  const [isDark, setDark] = useState(false);
  const T = isDark ? DARK : LIGHT;
  const pages = {
    overview:    <OverviewPage />,
    wordmaker:   <WordMakerPage />,
    solitaire:   <SolitairePage />,
    initiatives: <InitiativesPage />,
    team:        <TeamPage />,
  };
  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:T.bg, minHeight:"100vh", paddingBottom:48, transition:"background 0.25s" }}>
        <div style={{ background:T.topbar, borderBottom:`1px solid ${T.topbarBorder}`, padding:"0 28px", position:"sticky", top:0, zIndex:100, transition:"background 0.25s" }}>
          <div style={{ display:"flex", alignItems:"center", height:56, gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent }} />
              <span style={{ fontWeight:700, fontSize:15, color:T.topbarTitle, letterSpacing:"-0.02em" }}>Chardonnay</span>
              <span style={{ fontSize:13, color:T.topbarSub }}>Command Centre</span>
            </div>
            <div style={{ display:"flex", gap:3, marginLeft:28 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding:"6px 16px", fontSize:12, fontWeight:700, border:"none", cursor:"pointer", borderRadius:8,
                  background: tab===t.id ? T.navActiveBg : "transparent",
                  color:      tab===t.id ? T.accent       : T.topbarSub,
                  transition:"all 0.15s",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:11, color:T.topbarSub }}>Mon Apr 20, 2026 · v1.6</span>
              <ThemeToggle isDark={isDark} onToggle={() => setDark(d => !d)} />
            </div>
          </div>
        </div>
        <div style={{ padding:"24px 28px", maxWidth:1120, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:16, marginBottom:22, flexWrap:"wrap", alignItems:"center" }}>
            {[{c:T.wm,l:"Word Maker"},{c:T.sol,l:"Solitaire"},{c:"#C27A3A",l:"MetaPlay (initiative)"}].map(x => (
              <div key={x.l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}>
                <Dot colorStatic={x.c} size={9} />{x.l}
              </div>
            ))}
            <div style={{ marginLeft:"auto", fontSize:11, color:T.faint }}>Week 2 · Onboarding · Observation phase</div>
          </div>
          {pages[tab]}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
