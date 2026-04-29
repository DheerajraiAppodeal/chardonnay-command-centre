// AI Hub page — What the team can do with AI
// Static reference page — no Jira data needed

export default function AIHub({ T }) {
  const s = {
    page: { padding: '32px 28px 80px', maxWidth: 960, margin: '0 auto', fontFamily: 'inherit' },
    hero: { marginBottom: 36 },
    heroTitle: { fontSize: 28, fontWeight: 700, color: T?.text || '#1E2530', marginBottom: 6, letterSpacing: '-0.02em' },
    heroSub: { fontSize: 13, color: T?.muted || '#5A6172', maxWidth: 620, lineHeight: 1.6 },

    sectionLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: T?.muted || '#5A6172', marginBottom: 14, marginTop: 36, display: 'flex', alignItems: 'center', gap: 10 },
    rule: { flex: 1, height: 1, background: T?.border || '#D8DCE5' },

    // Integration cards
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },
    card: { background: T?.surface || '#fff', border: `1px solid ${T?.border || '#D8DCE5'}`,
      borderRadius: 6, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden' },
    cardAccent: (color) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }),
    cardIcon: { fontSize: 22, marginBottom: 8 },
    cardTitle: { fontSize: 13, fontWeight: 700, color: T?.text || '#1E2530', marginBottom: 4 },
    cardSub: { fontSize: 11, color: T?.muted || '#5A6172', lineHeight: 1.5, marginBottom: 10 },
    cardTag: (color, bg) => ({ display: 'inline-block', fontSize: 9, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px',
      borderRadius: 99, background: bg, color: color, marginRight: 4, marginBottom: 4 }),
    bullet: { fontSize: 11, color: T?.muted || '#5A6172', lineHeight: 1.7,
      paddingLeft: 14, margin: 0, listStyle: 'none' },
    bulletItem: { position: 'relative', paddingLeft: 12 },

    // Skill cards
    skillCard: { background: T?.surface || '#fff', border: `1px solid ${T?.border || '#D8DCE5'}`,
      borderRadius: 6, padding: '18px 20px', borderLeft: `4px solid #1A3A5C` },
    skillTitle: { fontSize: 13, fontWeight: 700, color: '#1A3A5C', marginBottom: 3 },
    skillMeta: { fontSize: 10, color: T?.muted || '#5A6172', marginBottom: 10 },
    codeBlock: { background: T?.surfaceAlt || '#ECEEF3', borderRadius: 4, padding: '10px 12px',
      fontFamily: 'monospace', fontSize: 10, color: T?.text || '#1E2530',
      whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: '8px 0 0' },

    // Value row
    valueRow: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0',
      borderBottom: `1px solid ${T?.border || '#D8DCE5'}` },
    valueIcon: { fontSize: 18, flexShrink: 0, width: 32, textAlign: 'center', paddingTop: 1 },
    valueText: { flex: 1 },
    valueTitle: { fontSize: 12, fontWeight: 700, color: T?.text || '#1E2530', marginBottom: 2 },
    valueSub: { fontSize: 11, color: T?.muted || '#5A6172', lineHeight: 1.5 },

    // Step
    step: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
    stepNum: { width: 24, height: 24, borderRadius: '50%', background: '#1A3A5C',
      color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, marginTop: 1 },
    stepText: { fontSize: 12, color: T?.text || '#1E2530', lineHeight: 1.6, paddingTop: 3 },

    link: { color: '#1A3A5C', textDecoration: 'none', fontWeight: 600 },
    badge: { display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: 10,
      fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  }

  const INTEGRATIONS = [
    {
      icon: '🔵',
      name: 'Claude.ai',
      color: '#CC785C',
      status: 'ready',
      statusLabel: 'Ready to use',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'The main interface. Chat, plan, write, build — all in one place.',
      uses: ['Morning brief', 'Draft Slack updates', 'Spec features', 'Analyse data'],
      howTo: 'Go to claude.ai — log in with your Appodeal Google account.',
    },
    {
      icon: '📋',
      name: 'Jira (via Claude)',
      color: '#0052CC',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude reads your Jira board and creates/updates tickets on your behalf.',
      uses: ['Create tickets from specs', 'Check sprint status', 'Find unassigned bugs', 'Log daily updates'],
      howTo: 'Connect Atlassian at claude.ai → Settings → Integrations.',
    },
    {
      icon: '💬',
      name: 'Slack (via Claude)',
      color: '#611f69',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude reads and drafts Slack messages. Never misses a flag.',
      uses: ['Draft team updates', 'Search past messages', 'Read #chardonnay channels', 'Flag urgent items'],
      howTo: 'Connect Slack at claude.ai → Settings → Integrations.',
    },
    {
      icon: '📅',
      name: 'Google Calendar',
      color: '#4285F4',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude books meetings, checks availability, and adds agendas.',
      uses: ['Book 1:1s with agenda', 'Check team availability', 'Create recurring events', 'Update meeting details'],
      howTo: 'Connect at claude.ai → Settings → Integrations → Google Calendar.',
    },
    {
      icon: '📁',
      name: 'Google Drive',
      color: '#0F9D58',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude reads and creates docs, sheets, and slides.',
      uses: ['Read Didara\'s roadmap sheet', 'Create docs from templates', 'Search files', 'Summarise documents'],
      howTo: 'Connect at claude.ai → Settings → Integrations → Google Drive.',
    },
    {
      icon: '📝',
      name: 'Confluence (via Claude)',
      color: '#0052CC',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude creates and updates Confluence pages directly.',
      uses: ['Create feature docs', 'Update sprint notes', 'Search team knowledge', 'Post meeting summaries'],
      howTo: 'Same Atlassian connection as Jira — already active.',
    },
    {
      icon: '🎙️',
      name: 'Fireflies',
      color: '#FF3B30',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Records your meetings and lets Claude pull transcripts and action items.',
      uses: ['Pull Feature Kickoff notes', 'Extract action items', 'Search past meetings', 'Auto-log decisions'],
      howTo: 'Connect at claude.ai → Settings → Integrations → Fireflies.',
    },
    {
      icon: '📊',
      name: 'Miro (via Claude)',
      color: '#FFD02F',
      status: 'ready',
      statusLabel: 'Connected',
      statusBg: '#E8F5EE',
      statusColor: '#2E8A5A',
      desc: 'Claude can read and create content on your Miro boards.',
      uses: ['Read sprint boards', 'Create diagrams', 'Add data to boards', 'Export board content'],
      howTo: 'Connect at claude.ai → Settings → Integrations → Miro.',
    },
    {
      icon: '🔌',
      name: 'Rippling (coming soon)',
      color: '#888',
      status: 'pending',
      statusLabel: 'Pending access',
      statusBg: '#FBF0E0',
      statusColor: '#9A6010',
      desc: 'Syncs approved time-off to the Live Sprint Gantt automatically.',
      uses: ['Auto OOO stripes on Gantt', 'Holiday detection', 'Resource planning'],
      howTo: 'API access requested — waiting for IT approval.',
    },
  ]

  const SKILLS = [
    {
      title: '☀️ Morning Brief',
      who: 'Everyone · Daily · 30 sec',
      color: '#F4A428',
      prompt: `Morning brief for Chardonnay Gaming — [TODAY'S DATE]

Check Jira and Slack and give me:
🟢 Word Maker — tickets in QA, anything moved to Done
🔵 Solitaire — tickets in QA, anything moved to Done  
⚠️ Flags — anything unassigned P0/P1 or blocking
💬 Slack — any mentions or urgent flags in #chardonnay-product`,
    },
    {
      title: '🐛 Log a Bug',
      who: 'QA · Dev · PM · 5 min saved',
      color: '#A83030',
      prompt: `Create a Jira bug ticket in [CHSOL / WORD]:

What broke: [one sentence]
Steps to reproduce: [numbered list]
Expected: [what should happen]
Actual: [what happened]
Device/version: [model, OS, app version]
Frequency: [Always / Sometimes / Rare]
Priority: [High / Medium / Low]`,
    },
    {
      title: '📄 Spec → Jira Tickets',
      who: 'PMs · Feature kickoffs · 45 min saved',
      color: '#2A7A50',
      prompt: `Spec this feature for [Word Maker / Solitaire] and create Jira tickets:

Feature name: [name]
What the player sees: [2-3 sentences]
Why we're building it: [metric we're targeting]
In scope: [list]
Out of scope: [list]
Dependencies: [blockers or risks]
Target release: [version]

Create: 1 Epic + all Tasks with descriptions and AC.`,
    },
    {
      title: '✍️ Draft a Slack Update',
      who: 'Everyone · Post-kickoff · Post-sprint',
      color: '#611f69',
      prompt: `Draft a Slack update for #chardonnay-product:

Context: [what happened — meeting, decision, sprint end]
Key points: [bullet list of what to communicate]
Any links: [Confluence, Jira, etc.]
Tone: [concise / detailed / celebratory]`,
    },
    {
      title: '📋 Feature Kickoff Notes',
      who: 'Producer · After every kickoff',
      color: '#1A3A5C',
      prompt: `Write up the Feature Kickoff notes for [feature name]:

Features presented: [list]
Risks flagged: [per discipline — Dev / Art / QA]
Open questions: [anything unresolved]
Decisions made: [any confirmed scope or naming]
Next steps: [owner + deadline per action]

Save to observations.md and draft a Confluence page.`,
    },
    {
      title: '🎙️ Pull Meeting Notes from Fireflies',
      who: 'Producer · After any meeting',
      color: '#FF3B30',
      prompt: `Search Fireflies for the [meeting name] on [date].

From the transcript, extract:
- Key decisions made
- Action items with owners
- Risks or blockers mentioned
- Any feature scope changes

Then save decisions to observations.md.`,
    },
  ]

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroTitle}>AI for the Chardonnay Team</div>
        <div style={s.heroSub}>
          What's connected, what it does, and how to use it. Every tool here saves real time — pick one and try it today.
        </div>
      </div>

      {/* Why AI */}
      <div style={{ ...s.sectionLabel }}>
        <span>Why it matters</span>
        <div style={s.rule} />
      </div>
      <div style={{ background: T?.surface || '#fff', border: `1px solid ${T?.border || '#D8DCE5'}`, borderRadius: 6, padding: '4px 0 4px' }}>
        {[
          { icon: '⚡', title: 'Speed up ceremonies', text: 'Feature specs that take 45 minutes take 5. Bug reports that take 10 minutes take 1. Kickoff summaries write themselves.' },
          { icon: '🎯', title: 'One source of truth', text: 'Claude reads Jira, Slack, Fireflies, and Drive at once — no more switching tabs to piece together what\'s happening.' },
          { icon: '🔁', title: 'Reduce sync meetings', text: 'Morning briefs, sprint status, and team updates can all be generated from live data. Fewer meetings, same alignment.' },
          { icon: '🧠', title: 'Institutional memory', text: 'Every kickoff, decision, and risk gets logged. Nothing falls through the cracks after a busy week.' },
        ].map((v, i) => (
          <div key={i} style={{ ...s.valueRow, borderBottom: i < 3 ? `1px solid ${T?.border || '#D8DCE5'}` : 'none', padding: '14px 20px' }}>
            <div style={s.valueIcon}>{v.icon}</div>
            <div style={s.valueText}>
              <div style={s.valueTitle}>{v.title}</div>
              <div style={s.valueSub}>{v.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Integrations */}
      <div style={s.sectionLabel}>
        <span>Integrations — what's connected</span>
        <div style={s.rule} />
      </div>
      <div style={s.grid3}>
        {INTEGRATIONS.map((int, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardAccent(int.color)} />
            <div style={s.cardIcon}>{int.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={s.cardTitle}>{int.name}</div>
              <span style={{ ...s.badge, background: int.statusBg, color: int.statusColor }}>{int.statusLabel}</span>
            </div>
            <div style={s.cardSub}>{int.desc}</div>
            <ul style={s.bullet}>
              {int.uses.map((u, j) => (
                <li key={j} style={{ ...s.bulletItem, '::before': { content: '"→"' } }}>→ {u}</li>
              ))}
            </ul>
            <div style={{ marginTop: 10, padding: '8px 10px', background: T?.surfaceAlt || '#ECEEF3', borderRadius: 4, fontSize: 10, color: T?.muted || '#5A6172', lineHeight: 1.5 }}>
              <strong style={{ color: T?.text || '#1E2530' }}>How to connect: </strong>{int.howTo}
            </div>
          </div>
        ))}
      </div>

      {/* Get started */}
      <div style={s.sectionLabel}>
        <span>Get started in 3 steps</span>
        <div style={s.rule} />
      </div>
      <div style={{ background: T?.surface || '#fff', border: `1px solid ${T?.border || '#D8DCE5'}`, borderRadius: 6, padding: '20px 24px' }}>
        {[
          { text: <span>Go to <a href="https://claude.ai" target="_blank" rel="noreferrer" style={s.link}>claude.ai</a> and sign in with your Appodeal Google account.</span> },
          { text: <span>Go to <strong>Settings → Integrations</strong> and connect: Atlassian (Jira + Confluence), Slack, Google Calendar, Google Drive, Fireflies.</span> },
          { text: <span>Copy one of the skill prompts below and paste it into Claude. Start with the <strong>Morning Brief</strong> — it's the fastest win.</span> },
        ].map((step, i) => (
          <div key={i} style={s.step}>
            <div style={s.stepNum}>{i + 1}</div>
            <div style={s.stepText}>{step.text}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={s.sectionLabel}>
        <span>Ready-to-use prompts — copy and paste</span>
        <div style={s.rule} />
      </div>
      <div style={s.grid2}>
        {SKILLS.map((skill, i) => (
          <div key={i} style={{ ...s.skillCard, borderLeftColor: skill.color }}>
            <div style={s.skillTitle}>{skill.title}</div>
            <div style={s.skillMeta}>{skill.who}</div>
            <div style={s.codeBlock}>{skill.prompt}</div>
          </div>
        ))}
      </div>

      {/* More resources */}
      <div style={s.sectionLabel}>
        <span>More resources</span>
        <div style={s.rule} />
      </div>
      <div style={{ background: T?.surface || '#fff', border: `1px solid ${T?.border || '#D8DCE5'}`, borderRadius: 6, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: '📂 Full skill library', desc: 'Detailed guides for bug reports, feature specs, and Jira ops', link: 'https://github.com/DheerajraiAppodeal/chardonnay-command-centre/tree/main/team-resources/skills' },
          { label: '🗓️ Live Sprint Gantt', desc: 'Real-time sprint timeline — drag bars, see OOO, track all tracks', link: null, action: 'Switch to the Live Sprint tab' },
          { label: '🗺️ Feature Roadmap', desc: 'Full offset pipeline view — Design, Art, Tech Art, Dev, QA', link: null, action: 'Switch to the Roadmap tab' },
          { label: '📖 Anthropic prompting guide', desc: 'How to get the best results from Claude', link: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${T?.border || '#D8DCE5'}` : 'none' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T?.text || '#1E2530', marginBottom: 2 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: T?.muted || '#5A6172' }}>{r.desc}</div>
            </div>
            {r.link && (
              <a href={r.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#1A3A5C', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 16 }}>
                Open →
              </a>
            )}
            {r.action && (
              <span style={{ fontSize: 11, color: T?.muted || '#5A6172', marginLeft: 16, whiteSpace: 'nowrap' }}>{r.action}</span>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
