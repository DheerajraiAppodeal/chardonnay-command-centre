export const GAMES = [
  {
    id: 'solitaire',
    name: 'Solitaire',
    pm: 'Srikanth Reddy',
    color: '#378ADD',
    sprintStatus: 'In progress',
    openTickets: 14,
    blockedTickets: 2,
    completion: 68,
    daysToSprintEnd: 3,
    retentionTarget: 'D7 +20% vs baseline',
    nextRelease: '2026-04-30',
    oneLiner: 'Solitaire — Sprint 68% complete — D7 rebuilding from v434 — Release Apr 30',
    velocityTrend: [22, 18, 24, 19],
    crashTrend: [1.2, 0.9, 1.4, 1.1],
  },
  {
    id: 'wordmaker',
    name: 'Word Maker',
    pm: 'Didara Pernebayeva',
    color: '#1D9E75',
    sprintStatus: 'On track',
    openTickets: 8,
    blockedTickets: 1,
    completion: 75,
    daysToSprintEnd: 3,
    retentionTarget: 'D3 +10% vs baseline',
    nextRelease: '2026-04-28',
    oneLiner: 'Word Maker — Sprint on track — Live Ops MVC model active — Release Apr 28',
    velocityTrend: [15, 17, 16, 18],
    crashTrend: [0.4, 0.3, 0.5, 0.2],
  },
  {
    id: 'wordsolitaire',
    name: 'Word Solitaire',
    pm: 'Srikanth Reddy',
    color: '#7F77DD',
    sprintStatus: 'Early stage',
    openTickets: 6,
    blockedTickets: 0,
    completion: 40,
    daysToSprintEnd: 3,
    retentionTarget: 'TBD',
    nextRelease: 'TBD',
    oneLiner: 'Word Solitaire — Early stage — KPIs TBD — Next milestone: first build',
    velocityTrend: [6, 8, 7, 9],
    crashTrend: [0, 0, 0.2, 0],
  },
  {
    id: 'metaplay',
    name: 'MetaPlay',
    pm: 'Giulia Galvani',
    color: '#D85A30',
    sprintStatus: 'Scope TBD',
    openTickets: 4,
    blockedTickets: 1,
    completion: 50,
    daysToSprintEnd: 3,
    retentionTarget: 'TBD',
    nextRelease: '2026-05-15',
    oneLiner: 'MetaPlay — Live Ops integration scoping — Remote config in progress — Release May 15',
    velocityTrend: [5, 6, 5, 7],
    crashTrend: [0.1, 0.2, 0.1, 0.3],
  },
]

export const RESOURCES = [
  {
    id: 'juan',
    name: 'Juan Zambrana',
    role: 'Technical Artist',
    color: '#F59E0B',
    allocation: [
      { gameId: 'solitaire', week: 1 },
      { gameId: 'wordmaker', week: 2 },
    ],
  },
  {
    id: 'kris',
    name: 'Kris Pillai',
    role: 'QA Lead',
    color: '#EF4444',
    allocation: [
      { gameId: 'solitaire', week: 1 },
      { gameId: 'wordmaker', week: 1 },
      { gameId: 'metaplay', week: 2 },
      { gameId: 'wordsolitaire', week: 2 },
    ],
  },
]

export const BLOCKERS = [
  { id: 'CHSOL-142', title: 'Card flip animation glitch on low-end devices', game: 'solitaire', owner: 'Srikanth Reddy', daysBlocked: 4, jiraUrl: 'https://appodeal.atlassian.net/browse/CHSOL-142' },
  { id: 'CHSOL-139', title: 'Daily challenge reward not triggering after ad view', game: 'wordmaker', owner: 'Didara Pernebayeva', daysBlocked: 2, jiraUrl: 'https://appodeal.atlassian.net/browse/CHSOL-139' },
  { id: 'CHSOL-155', title: 'MetaPlay config push blocked pending sign-off', game: 'metaplay', owner: 'Giulia Galvani', daysBlocked: 1, jiraUrl: 'https://appodeal.atlassian.net/browse/CHSOL-155' },
]

export const TEAM = [
  { id: 'dheeraj', name: 'Dheeraj Rai', initials: 'DR', role: 'Senior PM', games: ['all'], color: '#6366F1', slack: '@dheeraj.rai', focus: 'Building Command Centre + team onboarding', shared: false },
  { id: 'srikanth', name: 'Srikanth Reddy', initials: 'SR', role: 'PM', games: ['solitaire', 'wordsolitaire'], color: '#378ADD', slack: '@srikanth.reddy', focus: 'Solitaire rebuild v434 — Word Solitaire scoping', shared: false },
  { id: 'didara', name: 'Didara Pernebayeva', initials: 'DP', role: 'PM (Remote — KZ)', games: ['wordmaker'], color: '#1D9E75', slack: '@didara.pernebayeva', focus: 'Word Maker Live Ops — MVC model rollout', shared: false },
  { id: 'giulia', name: 'Giulia Galvani', initials: 'GG', role: 'PM', games: ['metaplay'], color: '#D85A30', slack: '@giulia.galvani', focus: 'MetaPlay Live Ops integration — remote config', shared: false },
  { id: 'carlos', name: 'Carlos Person', initials: 'CP', role: 'Head of Development', games: ['all'], color: '#94A3B8', slack: '@carlos.person', focus: 'QA hire (EoM target) — resource allocation', shared: false },
  { id: 'juan', name: 'Juan Zambrana', initials: 'JZ', role: 'Technical Artist', games: ['wordmaker', 'solitaire'], color: '#F59E0B', slack: '@juan.zambrana', focus: 'Asset production — split across WM + Solitaire', shared: true, sharedLevel: 'amber' },
  { id: 'kris', name: 'Kris Pillai', initials: 'KP', role: 'QA Lead', games: ['solitaire', 'wordmaker', 'wordsolitaire', 'metaplay'], color: '#EF4444', slack: '@krishnanunni.pillai', focus: 'QA across all 4 products — bandwidth critical', shared: true, sharedLevel: 'red' },
  { id: 'pablo', name: 'Pablo', initials: 'PB', role: 'Developer', games: ['metaplay'], color: '#D85A30', slack: '@pablo', focus: 'MetaPlay feature dev — remote config pipeline', shared: false },
]

export const RELEASE_MILESTONES = [
  { gameId: 'solitaire',     devComplete: '2026-04-25', qaGate: '2026-04-28', release: '2026-04-30', version: '1.4.35', qaStatus: 'In QA', pm: 'Srikanth Reddy', criteria: { devComplete: true, qaSignoff: false, rolloutDefined: true, kpisDefined: true, pmApproved: false } },
  { gameId: 'wordmaker',     devComplete: '2026-04-24', qaGate: '2026-04-26', release: '2026-04-28', version: '2.1.8',  qaStatus: 'Ready', pm: 'Didara Pernebayeva', criteria: { devComplete: true, qaSignoff: true, rolloutDefined: true, kpisDefined: true, pmApproved: true } },
  { gameId: 'wordsolitaire', devComplete: 'TBD',        qaGate: 'TBD',        release: 'TBD',        version: '0.1.0', qaStatus: 'Not started', pm: 'Srikanth Reddy', criteria: { devComplete: false, qaSignoff: false, rolloutDefined: false, kpisDefined: false, pmApproved: false } },
  { gameId: 'metaplay',      devComplete: '2026-05-10', qaGate: '2026-05-12', release: '2026-05-15', version: '1.0.4', qaStatus: 'Scheduled', pm: 'Giulia Galvani', criteria: { devComplete: false, qaSignoff: false, rolloutDefined: true, kpisDefined: false, pmApproved: false } },
]

export const AI_INITIATIVES = [
  {
    id: 'gi-001',
    person: 'Giulia Galvani',
    initiative: 'Remote config management',
    tool: 'Cursor + Claude',
    started: '2026-04-01',
    outputMetric: 'Config change time',
    before: 'TBD',
    after: 'TBD',
    delta: '—',
    status: 'In progress',
  },
]

export const AI_BASELINE_METRICS = [
  { id: 'release-velocity',  label: 'Release velocity',   unit: 'days (feat → release train)', baseline: null, lockedAt: null, current: null },
  { id: 'crash-rate',        label: 'Crash rate',          unit: '% crashes / release (3-rel avg)', baseline: null, lockedAt: null, current: null },
  { id: 'qa-cycle',          label: 'QA cycle time',       unit: 'days (build-ready → QA sign-off)', baseline: null, lockedAt: null, current: null },
  { id: 'ta-throughput',     label: 'TA throughput',        unit: 'assets / sprint', baseline: null, lockedAt: null, current: null },
  { id: 'pm-spec-time',      label: 'PM spec time',         unit: 'days (idea → sprint-ready)', baseline: null, lockedAt: null, current: null },
]
