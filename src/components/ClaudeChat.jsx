import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the Chardonnay Gaming assistant embedded in the Word Maker Command Centre.

TEAM:
- Didara Pernebayeva — PM / Product Owner (Word Maker)
- Toni Puig — Lead Developer (Word Maker, Barcelona)
- Víctor Romero — Developer (Word Maker)
- Juan Sabater — Shared Tech Artist (rotates WM ↔ Sol weekly)
- Juan Zambrana — Full-time Artist (Word Maker)
- Guillem Urpí Montserrat — Artist (Solitaire, also supports WM)
- Krish Prabha — QA Lead (shared)
- Andreu Margarit — QA
- Dheeraj Rai — Producer / Senior PM

CURRENT SPRINT (Apr 28 – May 9, 2026):
- 1.48.0 Word Master Chained Reward: Dev in progress (Toni), QA not started
- 1.49.0 Trivia Levels: Art in progress (Juan Z, delivering Apr 30), Dev starts May 5
- 1.49.0 Album Event: Art in progress (Juan Z + Guillem, delivering Apr 30), Dev starts May 5
- May 1 = Labour Day holiday (Spain + KZ) — no work

RELEASE CADENCE:
- Code freeze: alternates Mon/Fri
- RC build: Wednesday
- Rollout: Thursday
- ≤1 code freeze slip/quarter, 0 P0 escapes, ≥99% crash-free

CEREMONIES (4 total):
- Feature Kickoff: bi-weekly Monday, Didara presents, Dheeraj facilitates
- Bug Triage: weekly Monday, 20 min, Dheeraj + Didara
- Sprint Planning: optional Friday, Toni leads
- Release Check + Rollout: Wed + Thu

KPI TARGETS:
- Trivia Levels: +3pp D3, +2pp D7, +15s avg session
- Album Event: +2pp D3, +2pp D7, +10s avg session

OPEN BUGS:
- WORD-620: Beginner's Bonus popup shown twice — backlog, unassigned
- WORD-612: Firebase 1.46.0 not in Crashlytics — in progress, Toni

Be concise and direct. Answer in context of the team's work. If asked about live Jira status, say you have data as of Apr 30 and suggest checking the Jira board for real-time status.`;

export default function ClaudeChat({ T }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about the Word Maker sprint, team, or features." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const history = messages.filter((m, i) => !(m.role === "assistant" && i === 0));
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: [...history, userMsg],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error — try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div style={{
          position:"fixed", bottom:88, right:24, zIndex:999,
          width:380, height:520,
          background: T?.surface || "#fff",
          border:`1px solid ${T?.border || "#D8DCE5"}`,
          borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
          display:"flex", flexDirection:"column", overflow:"hidden"
        }}>
          <div style={{ padding:"14px 16px", background: T?.topbar || "#1E2530", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>🤖 Chardonnay Assistant</div>
              <div style={{ color: T?.panelMuted || "#7B8799", fontSize:10, marginTop:2 }}>Ask about sprint, features, team</div>
            </div>
            <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", color:"#fff", cursor:"pointer", fontSize:18 }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
            {messages.map((m,i) => (
              <div key={i} style={{
                maxWidth:"85%", padding:"9px 12px",
                borderRadius: m.role==="user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                background: m.role==="user" ? (T?.accent||"#F4A428") : (T?.surfaceAlt||"#ECEEF3"),
                color: m.role==="user" ? "#fff" : (T?.text||"#1E2530"),
                alignSelf: m.role==="user" ? "flex-end" : "flex-start",
                fontSize:12, lineHeight:1.5
              }}>{m.content}</div>
            ))}
            {loading && <div style={{ alignSelf:"flex-start", fontSize:12, color: T?.muted||"#5A6172", padding:"8px 12px" }}>Thinking...</div>}
            <div ref={bottomRef}/>
          </div>
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${T?.border||"#D8DCE5"}`, display:"flex", gap:8 }}>
            <input
              style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`1px solid ${T?.border||"#D8DCE5"}`, fontSize:12, outline:"none", background:T?.surfaceAlt||"#ECEEF3", color:T?.text||"#1E2530" }}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="What's blocking Trivia Levels?"
            />
            <button
              onClick={send} disabled={loading}
              style={{ padding:"8px 14px", borderRadius:8, background:T?.accent||"#F4A428", border:"none", cursor:"pointer", color:"#fff", fontSize:12, fontWeight:700, opacity:loading?0.6:1 }}
            >Send</button>
          </div>
        </div>
      )}
      <button
        onClick={()=>setOpen(o=>!o)}
        title="Ask Claude"
        style={{
          position:"fixed", bottom:24, right:24, zIndex:1000,
          width:52, height:52, borderRadius:"50%",
          background: T?.accent||"#F4A428", border:"none", cursor:"pointer",
          fontSize:22, boxShadow:"0 4px 12px rgba(0,0,0,0.3)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}
      >{open?"×":"🤖"}</button>
    </>
  );
}
