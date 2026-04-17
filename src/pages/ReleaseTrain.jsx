import { useState } from 'react'
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react'
import { GAMES, RELEASE_MILESTONES, RESOURCES } from '../data/mockData'

const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]))

const TODAY = new Date('2026-04-17')
const WEEK_START = new Date('2026-04-13')

function dayOffset(dateStr) {
  if (!dateStr || dateStr === 'TBD') return null
  return Math.round((new Date(dateStr) - WEEK_START) / 86400000)
}

function formatDate(d) {
  if (!d || d === 'TBD') return 'TBD'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// 4-week timeline: 28 days from WEEK_START
const TOTAL_DAYS = 28
const WEEKS = [0, 7, 14, 21]

function TimelineLane({ milestone }) {
  const game = GAME_MAP[milestone.gameId]
  const dc = dayOffset(milestone.devComplete)
  const qa = dayOffset(milestone.qaGate)
  const rel = dayOffset(milestone.release)

  function pct(day) {
    if (day === null) return null
    return Math.max(0, Math.min(100, (day / TOTAL_DAYS) * 100))
  }

  const todayPct = (Math.round((TODAY - WEEK_START) / 86400000) / TOTAL_DAYS) * 100
  const qaOverloaded = RESOURCES[1].allocation.filter(a => a.week === 1).length > 2

  return (
    <div className="relative flex items-center gap-3 py-3 border-b border-slate-800/60 last:border-0">
      {/* Game label */}
      <div className="w-28 flex-shrink-0 text-right">
        <span className="text-xs font-medium" style={{ color: game?.color }}>{game?.name}</span>
        <div className="text-[10px] text-slate-600">{milestone.pm}</div>
      </div>

      {/* Bar area */}
      <div className="flex-1 relative h-8">
        {/* Today line */}
        <div className="absolute top-0 bottom-0 w-px bg-white/20 z-10"
          style={{ left: `${todayPct}%` }}>
          <div className="absolute -top-5 -translate-x-1/2 text-[9px] text-white/40 whitespace-nowrap">today</div>
        </div>

        {/* Week gridlines */}
        {WEEKS.map((w, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-slate-800"
            style={{ left: `${(w / TOTAL_DAYS) * 100}%` }} />
        ))}

        {/* Connection line between milestones */}
        {dc !== null && rel !== null && (
          <div className="absolute top-1/2 -translate-y-px h-0.5 bg-slate-700"
            style={{ left: `${pct(dc)}%`, right: `${100 - pct(rel)}%` }} />
        )}

        {/* Dev Complete node */}
        {dc !== null && (
          <Tooltip label={`Dev complete: ${formatDate(milestone.devComplete)}`}>
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-slate-900 -translate-x-1/2 cursor-pointer"
              style={{ left: `${pct(dc)}%`, borderColor: game?.color }} />
          </Tooltip>
        )}

        {/* QA Gate node */}
        {qa !== null && (
          <Tooltip label={`QA gate: ${formatDate(milestone.qaGate)}${qaOverloaded ? ' ⚠️ QA overloaded' : ''}`}>
            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded -translate-x-1/2 cursor-pointer flex items-center justify-center`}
              style={{ left: `${pct(qa)}%`, backgroundColor: qaOverloaded ? '#EF4444' : game?.color }}>
              <div className="w-2 h-2 bg-slate-900 rounded-sm" />
            </div>
          </Tooltip>
        )}

        {/* Release node */}
        {rel !== null && (
          <Tooltip label={`Release: ${formatDate(milestone.release)} — v${milestone.version}`}>
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -translate-x-1/2 cursor-pointer"
              style={{ left: `${pct(rel)}%`, backgroundColor: game?.color }}>
            </div>
          </Tooltip>
        )}

        {/* TBD placeholder */}
        {dc === null && (
          <div className="absolute inset-0 flex items-center">
            <span className="text-xs text-slate-700 italic">No dates set — early stage</span>
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="w-20 flex-shrink-0 text-right">
        <StatusBadge status={milestone.qaStatus} />
      </div>
    </div>
  )
}

function Tooltip({ label, children }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
          bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 whitespace-nowrap shadow-xl">
          {label}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    'Ready':       'bg-green-500/20 text-green-400 border-green-500/30',
    'In QA':       'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Scheduled':   'bg-slate-700/50 text-slate-400 border-slate-600',
    'Not started': 'bg-slate-800 text-slate-600 border-slate-700',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${map[status] ?? 'bg-slate-800 text-slate-500'}`}>
      {status}
    </span>
  )
}

const CRITERIA_LABELS = {
  devComplete: 'Dev complete',
  qaSignoff: 'QA sign-off',
  rolloutDefined: 'Rollout % defined (10–30%)',
  kpisDefined: 'KPIs defined for this release',
  pmApproved: 'PM approved',
}

function ReleaseRow({ milestone }) {
  const [open, setOpen] = useState(false)
  const game = GAME_MAP[milestone.gameId]
  const passed = Object.values(milestone.criteria).filter(Boolean).length
  const total = Object.values(milestone.criteria).length

  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-800/30 transition-colors text-left">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: game?.color }} />
        <span className="flex-1 text-sm font-medium text-white">{game?.name}</span>
        <span className="text-xs text-slate-500 font-mono">v{milestone.version}</span>
        <StatusBadge status={milestone.qaStatus} />
        <span className="text-xs text-slate-400 w-16 text-right">{formatDate(milestone.release)}</span>
        <span className="text-xs text-slate-500">{milestone.pm}</span>
        <span className="text-xs text-slate-600">{passed}/{total}</span>
        {open ? <ChevronDown size={13} className="text-slate-500 flex-shrink-0" /> : <ChevronRight size={13} className="text-slate-500 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-10 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(milestone.criteria).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${val ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-600'}`}>
                {val ? '✓' : '○'}
              </div>
              <span className={val ? 'text-slate-300' : 'text-slate-500'}>{CRITERIA_LABELS[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReleaseTrain() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Release Train</h1>
          <p className="text-xs text-slate-500 mt-0.5">4-week outlook · hover nodes for detail · click to edit dates</p>
        </div>
        <div className="text-xs text-slate-600">Week of Apr 13 → May 10</div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 overflow-x-auto">
        {/* Week headers */}
        <div className="flex ml-[7.5rem] mb-1">
          {['Week 1 — Apr 13', 'Week 2 — Apr 20', 'Week 3 — Apr 27', 'Week 4 — May 4'].map((w, i) => (
            <div key={i} className="flex-1 text-[10px] text-slate-600 font-medium text-center border-l border-slate-800 pl-2">
              {w}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3 ml-[7.5rem] text-[10px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-slate-400 bg-slate-900" />
            Dev complete
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-900 rounded-sm" />
            </div>
            QA gate
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-slate-400" />
            Release
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-900 rounded-sm" />
            </div>
            QA overloaded
          </div>
        </div>

        <div className="min-w-[600px]">
          {RELEASE_MILESTONES.map(m => <TimelineLane key={m.gameId} milestone={m} />)}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400">
          <AlertTriangle size={11} />
          WM (Apr 28) and Solitaire (Apr 30) share QA window — Kris at max capacity. Coordinate with Carlos.
        </div>
        <div className="mt-1 text-[10px] text-slate-600 italic">TODO: sync milestone dates with Jira milestones — appodeal.atlassian.net/browse/CHSOL</div>
      </div>

      {/* Releases table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">Upcoming releases</h2>
          <span className="text-xs text-slate-600">Click a row to see release criteria checklist</span>
        </div>
        <div>
          {[...RELEASE_MILESTONES]
            .sort((a, b) => {
              if (a.release === 'TBD') return 1
              if (b.release === 'TBD') return -1
              return new Date(a.release) - new Date(b.release)
            })
            .map(m => <ReleaseRow key={m.gameId} milestone={m} />)}
        </div>
      </div>
    </div>
  )
}
