// SprintProposal.jsx — Word Maker "How We Work" sprint model
// Accepts T (theme object) as prop

// ── Discipline colour tokens ───────────────────────────────────────────────
const D = {
  design:  { bg:"#EBF4FB", text:"#1A5C8A" },
  art:     { bg:"#FDF0E0", text:"#9A5810" },
  techArt: { bg:"#E4F0E8", text:"#2A6A40" },
  dev:     { bg:"#E8EEF8", text:"#1A3A8A" },
  qa:      { bg:"#F5E8F0", text:"#8A2A60" },
};

// ── Small helpers ──────────────────────────────────────────────────────────
function Sec({ label, T }) {
  return (
    <div style={{
      fontSize:10, fontWeight:700, color:T.faint, letterSpacing:"0.18em",
      textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, marginBottom:20,
    }}>
      {label}
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  );
}

function H2({ children, T }) {
  return (
    <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em", marginBottom:6 }}>
      {children}
    </div>
  );
}

function SectionIntro({ children, T }) {
  return (
    <div style={{ fontSize:12, color:T.muted, marginBottom:22, lineHeight:1.6, maxWidth:680 }}>
      {children}
    </div>
  );
}

// ── Pipeline block ────────────────────────────────────────────────────────
function PBlock({ title, note, d, flex=1, empty=false, red=false }) {
  const bg   = red ? "#FAEAEA" : empty ? "transparent" : D[d].bg;
  const col  = red ? "#A83030" : empty ? "#B0B8C8"     : D[d].text;
  const border = empty ? `1px dashed #D8DCE5` : "none";
  return (
    <div style={{
      flex, borderRadius:6, padding:"8px 11px", background:bg, border,
      display:"flex", flexDirection:"column", justifyContent:"center", minHeight:44,
      opacity: empty ? 0.5 : 1,
    }}>
      {title && <div style={{ fontSize:10, fontWeight:700, color:col, marginBottom:2 }}>{title}</div>}
      {note  && <div style={{ fontSize:9,  color:col, opacity:0.85, lineHeight:1.4 }}>{note}</div>}
    </div>
  );
}

function WeekDivider() {
  return <div style={{ width:2, background:"#D8DCE5", borderRadius:1, alignSelf:"stretch", flexShrink:0 }} />;
}

// ── Pipeline row ──────────────────────────────────────────────────────────
function PRow({ icon, label, who, d, T, children }) {
  return (
    <div style={{
      display:"grid", gridTemplateColumns:"110px 1fr",
      borderBottom:`1px solid ${T.border}`,
    }}>
      <div style={{
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"12px 14px", borderRight:`1px solid ${T.border}`, background:T.surfaceAlt,
      }}>
        <span style={{ fontSize:11, fontWeight:700, color:D[d].text }}>{icon} {label}</span>
        <span style={{ fontSize:9, color:T.faint, marginTop:2 }}>{who}</span>
      </div>
      <div style={{ display:"flex", alignItems:"stretch", padding:"8px 10px", gap:6 }}>
        {children}
      </div>
    </div>
  );
}

// ── Ceremony card ─────────────────────────────────────────────────────────
function CeremonyCard({ title, when, duration, owner, desc, replaces, accentColor, T }) {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`,
      borderLeft:`4px solid ${accentColor}`, borderRadius:"0 10px 10px 0",
      padding:"18px 20px",
    }}>
      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", padding:"2px 8px", borderRadius:99, background:T.surfaceAlt, color:T.muted }}>{when}</span>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", padding:"2px 8px", borderRadius:99, background:T.surfaceAlt, color:T.muted }}>{duration}</span>
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:3 }}>{title}</div>
      <div style={{ fontSize:11, fontWeight:600, color:accentColor, marginBottom:8 }}>{owner}</div>
      <div style={{ fontSize:12, color:T.muted, lineHeight:1.55, marginBottom:10 }}>{desc}</div>
      <div style={{ paddingTop:10, borderTop:`1px solid ${T.border}`, fontSize:11, color:T.muted }}>
        <strong style={{ color:T.text }}>Replaces: </strong>{replaces}
      </div>
    </div>
  );
}

// ── Journey step ──────────────────────────────────────────────────────────
function Step({ num, icon, title, desc, bg, textColor, last }) {
  return (
    <div style={{
      padding:"18px 14px",
      borderRight: last ? "none" : "1px solid #E2DED8",
      background: bg || "transparent",
    }}>
      <div style={{ fontSize:18, marginBottom:7 }}>{icon}</div>
      <div style={{ fontSize:10, fontWeight:700, color:"#6B6560", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Step {num}</div>
      <div style={{ fontSize:12, fontWeight:700, color:textColor || "#1A1A1A", marginBottom:4 }}>{title}</div>
      <div style={{ fontSize:10, color:"#6B6560", lineHeight:1.5 }}>{desc}</div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function SprintProposalPage({ T }) {
  return (
    <div style={{ display:"grid", gap:40, maxWidth:1060 }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{
        background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
        padding:"28px 32px", borderTop:`3px solid ${T.text}`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:T.faint }}>
            Word Maker · Chardonnay Gaming · Appodeal
          </span>
          <span style={{ fontSize:10, color:T.faint }}>Proposal — April 2026 · v1.0</span>
        </div>
        <div style={{ fontSize:32, fontWeight:700, color:T.text, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:10 }}>
          How We Work
        </div>
        <div style={{ fontSize:13, color:T.muted, maxWidth:620, lineHeight:1.6 }}>
          A sprint model designed for a small, fast team where design always leads development, each discipline feeds the next, and alignment never comes at the cost of speed.
        </div>
      </div>

      {/* ── Principles ──────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { icon:"⚡", label:"Fewest Meetings",  desc:"Every ceremony earns its place or it doesn't exist. Four touchpoints total. That's it.",                                       accent:T.text  },
          { icon:"🎯", label:"Clear Direction",  desc:"The whole team knows what we're building and why before a single line of code is written.",                                    accent:"#C8862A" },
          { icon:"🚀", label:"Dev Freedom",      desc:"No artificial stops. If code is ready, it ships. Process wraps around how the team works.",                                    accent:"#2A7A50" },
          { icon:"🔄", label:"Continuous Flow",  desc:"Design, Art, Tech Art, Dev, QA run in offset — each feeds the next. No idle time waiting.",                                   accent:"#5A3A9A" },
        ].map(p => (
          <div key={p.label} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"18px 16px", borderTop:`3px solid ${p.accent}`,
          }}>
            <div style={{ fontSize:20, marginBottom:9 }}>{p.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.text, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{p.label}</div>
            <div style={{ fontSize:11, color:T.muted, lineHeight:1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* ── The Offset Pipeline ─────────────────────────────────────────── */}
      <div>
        <Sec label="The Model" T={T} />
        <H2 T={T}>The Offset Pipeline</H2>
        <SectionIntro T={T}>
          Each discipline runs one step ahead of the next. Design is always speccing the next sprint while Art delivers the current one. Dev starts the moment assets land. QA tests in rolling chunks — not a gate at the end.
        </SectionIntro>

        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          {/* Header */}
          <div style={{
            background:T.panelBg, color:T.panelText,
            fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase",
            padding:"10px 20px", display:"flex", justifyContent:"space-between",
          }}>
            <span>← WEEK 1</span>
            <span>2-WEEK SPRINT</span>
            <span>WEEK 2 →</span>
          </div>

          {/* Design */}
          <PRow icon="🎨" label="Design" who="Didara" d="design" T={T}>
            <PBlock d="design" flex={5} title="Sprint N+1 — Spec Writing" note="Speccing next sprint's features while current sprint builds · Output: PRD → Jira tickets" />
          </PRow>

          {/* Art */}
          <PRow icon="🖌️" label="Art" who="Juan Z + Artists" d="art" T={T}>
            <PBlock d="art" flex={3} title="Sprint N — Assets" note="UI, illustrations, animations for current sprint" />
            <WeekDivider />
            <PBlock d="art" flex={2} title="Polish + N+1 Kickstart" note="Final art polish · Early N+1 explorations" />
          </PRow>

          {/* Tech Art */}
          <PRow icon="⚙️" label="Tech Art" who="Juan S (shared)" d="techArt" T={T}>
            <PBlock empty flex={1} note="Waiting on art" />
            <PBlock d="techArt" flex={2} title="Integration" note="Prefabs, atlases, shaders · Feeds dev branch" />
            <WeekDivider />
            <PBlock d="techArt" flex={2} title="Final Integration + QA Support" note="Asset fixes · QA support · N+1 planning" />
          </PRow>

          {/* Dev */}
          <PRow icon="💻" label="Dev" who="Toni · Víctor · Juan S" d="dev" T={T}>
            <PBlock d="dev" flex={1} title="Setup" note="Branch setup · Tickets self-assigned" />
            <PBlock d="dev" flex={2} title="Core Build" note="Feature dev · PRs merged daily · No ceremony needed" />
            <WeekDivider />
            <PBlock d="dev" flex={1} title="Finish + Polish" note="Feature complete · Edge cases" />
            <PBlock red flex={1} title="❄️ Stabilise" note="Post code-freeze · Bug fixes only" />
          </PRow>

          {/* QA */}
          <PRow icon="✅" label="QA" who="Krish · Andreu" d="qa" T={T}>
            <PBlock empty flex={2} note="Not a gate — starts when first chunk is ready" />
            <PBlock d="qa" flex={1} title="First Chunks" note="Rolling tests as features complete" />
            <WeekDivider />
            <PBlock d="qa" flex={2} title="Full QA Coverage — Rolling" note="P0/P1 blocks release · P2 deferred · Sign-off before RC" />
          </PRow>
        </div>

        <div style={{ marginTop:10, fontSize:11, color:T.muted }}>
          <strong style={{ color:T.text }}>Key insight:</strong> Design never waits for Dev. Dev never waits for a ceremony. QA never reviews everything at the end. Each step feeds the next continuously.
        </div>
      </div>

      {/* ── Ceremonies ──────────────────────────────────────────────────── */}
      <div>
        <Sec label="Ceremonies" T={T} />
        <H2 T={T}>Four Touchpoints. That's It.</H2>
        <SectionIntro T={T}>
          Three are fixed, one is optional. Everything else is handled async — a Slack thread or a Jira comment.
        </SectionIntro>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <CeremonyCard
            title="🚀 Feature Kickoff"
            when="Bi-weekly · Monday"
            duration="30 min"
            owner="Didara presents · Dheeraj facilitates"
            desc="Didara walks the team through 2 upcoming features — what they are, why we're building them, what good looks like. Team stress-tests: scope, risks, art effort, dev complexity, QA needs. Everyone aligned before a single line of code is written."
            replaces="Scattered Slack threads, mid-sprint spec surprises, features that arrive in dev with no context."
            accentColor={T.text}
            T={T}
          />
          <CeremonyCard
            title="🐛 Bug Triage"
            when="Weekly · Monday"
            duration="20 min"
            owner="Dheeraj + Didara run it"
            desc="P0 and P1 bugs only — prioritised by KPI impact, not volume. Is this blocking the release? Does it affect a measurable metric? If yes, it gets assigned. If no, it waits. Fast, focused, no debate about low-severity issues."
            replaces="QA-owned triage that treats all bugs equally and delays releases for non-critical issues."
            accentColor="#C8862A"
            T={T}
          />
          <CeremonyCard
            title="📋 Sprint Planning"
            when="Optional · Friday"
            duration="15 min max"
            owner="Toni leads · Dheeraj manages notes + Jira"
            desc="Only runs when there are tasks to plan. When the team has already self-assigned from a well-written spec, this is 10 minutes or skipped entirely. Toni confirms scope. Dheeraj confirms availability. Done."
            replaces="Long planning sessions for work that's already largely defined before anyone opens a board."
            accentColor="#C8862A"
            T={T}
          />
          <CeremonyCard
            title="🔍→🚀 Release Check + Rollout"
            when="Wednesday + Thursday"
            duration="Release gates"
            owner="Toni + Krish own · Dheeraj monitors"
            desc="Wednesday: RC build, full smoke test. If a P0 exists, the release is held — no exceptions. Thursday: staged rollout, crash-free rate monitored for 24 hours. These are not ceremonies — they are quality gates that never get skipped."
            replaces="Non-negotiable: ≤1 code freeze slip/quarter · 0 P0 escapes · ≥99% crash-free post-rollout."
            accentColor="#2A7A50"
            T={T}
          />
        </div>
      </div>

      {/* ── Feature Journey ──────────────────────────────────────────────── */}
      <div>
        <Sec label="Feature Flow" T={T} />
        <H2 T={T}>A Feature's Journey</H2>
        <SectionIntro T={T}>
          From Didara's idea to the player's hands — every handoff is explicit, every owner is named.
        </SectionIntro>
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(6,1fr)",
          background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden",
        }}>
          <Step num={1} icon="💡" title="Feature Kickoff"  desc="Didara presents vision + why. Team stress-tests. Dheeraj captures risks." />
          <Step num={2} icon="📄" title="Spec + Tickets"   desc="Didara writes PRD. Tickets generated and assigned. Done before sprint starts."       bg={D.design.bg}  textColor={D.design.text}  />
          <Step num={3} icon="🖌️" title="Art + Tech Art"  desc="Artists produce assets. Juan S integrates into engine. Feeds dev branch directly."   bg={D.art.bg}     textColor={D.art.text}     />
          <Step num={4} icon="💻" title="Dev Build"        desc="Toni + team build. PRs merged daily. No ceremony needed — work is already defined."   bg={D.dev.bg}     textColor={D.dev.text}     />
          <Step num={5} icon="✅" title="Rolling QA"       desc="Krish tests chunks as they land. Bugs back same day. P0/P1 only blocks release."      bg={D.qa.bg}      textColor={D.qa.text}      />
          <Step num={6} icon="🚀" title="RC + Rollout"     desc="RC Wednesday. Rollout Thursday. Staged %. Monitor crash-free 24h."                    bg="#E4F5EC"      textColor="#2A7A50" last />
        </div>
      </div>

      {/* ── Role Clarity ─────────────────────────────────────────────────── */}
      <div>
        <Sec label="Role Clarity" T={T} />
        <H2 T={T}>Who Owns What</H2>
        <SectionIntro T={T}>No grey zones. Every decision point has exactly one owner.</SectionIntro>
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", background:T.panelBg, padding:"10px 16px" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.panelMuted }}>Person</div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.panelMuted }}>Owns</div>
          </div>
          {[
            { person:"Didara · PM",        owns:"Product vision · Feature decisions · Experimentation targets · Feature Kickoff content · Final call on what ships" },
            { person:"Dheeraj · Producer", owns:"Sprint planning rhythm · Scope monitoring · TA/QA availability · Bug triage facilitation · Process enforcement · Jira governance" },
            { person:"Toni · Lead Dev",    owns:"Technical execution · Release train · Code freeze decisions · RC build · Architecture · Dev sprint velocity" },
            { person:"Krish · QA Lead",    owns:"Test coverage · QA sign-off · Bug severity classification · Release gate decision · Rolling test coordination" },
            { person:"Juan S · Tech Art",  owns:"Art integration pipeline · Prefabs + atlas setup · Bridges Art → Dev · Rotates WM ↔ Sol weekly" },
          ].map((row, i) => (
            <div key={row.person} style={{
              display:"grid", gridTemplateColumns:"200px 1fr",
              padding:"13px 16px", borderTop:`1px solid ${T.border}`,
              background: i % 2 === 1 ? T.surfaceAlt : T.surface,
            }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{row.person}</div>
              <div style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>{row.owns}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Non-Negotiables ──────────────────────────────────────────────── */}
      <div>
        <Sec label="Non-Negotiables" T={T} />
        <H2 T={T}>The Hard Rules</H2>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[
            { title:"No artificial stops to development",               body:"If code is ready and documented, it ships. A process ceremony is never a reason to hold back working code."                                   },
            { title:"No meeting inflation",                              body:"Every new touchpoint must replace an existing one. The total meeting load does not increase."                                                  },
            { title:"Process adapts to the team — not the other way around", body:"This is a starting point. We pilot it, measure it, and adapt based on what the team actually experiences."                             },
            { title:"No P0 escapes — ever",                             body:"The release gate is non-negotiable. A P0 reaching live players is a process failure regardless of release pressure."                           },
          ].map(nn => (
            <div key={nn.title} style={{
              display:"flex", gap:14, alignItems:"flex-start",
              padding:"12px 16px", background:T.surface,
              border:`1px solid ${T.border}`, borderLeft:"3px solid #A83030",
              borderRadius:"0 8px 8px 0",
            }}>
              <div style={{ fontSize:16, flexShrink:0, marginTop:1 }}>🚫</div>
              <div style={{ fontSize:12, color:T.text, lineHeight:1.55 }}>
                <strong style={{ display:"block", fontWeight:700, marginBottom:2 }}>{nn.title}</strong>
                {nn.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{
        paddingTop:20, borderTop:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between",
        fontSize:10, color:T.faint, letterSpacing:"0.08em", textTransform:"uppercase",
      }}>
        <span>Word Maker Team · Chardonnay Gaming · Appodeal</span>
        <span>Proposal v1.0 · April 2026 · For discussion</span>
      </div>

    </div>
  );
}
