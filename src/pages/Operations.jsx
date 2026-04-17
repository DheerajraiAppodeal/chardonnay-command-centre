import { useState } from 'react'
import { ChevronDown, ChevronRight, ExternalLink, AlertTriangle, Send } from 'lucide-react'
import { GAMES, BLOCKERS, RESOURCES } from '../data/mockData'

const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]))

function ProgressBar({ pct, color }) {
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function SprintCard({ game }) {
  const [open, setOpen] = useState(true)
  const urgency = game.daysToSprintEnd <= 1 ? 'red' : game.daysToSprintEnd <= 3 ? 'amber' : 'green'
  const urgencyText = { red: 'text-red-400', amber: 'text-amber-400', green: 'text-slate-400' }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-3 hover:border-slate-700 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: game.color }} />
          <span className="font-semibold text-sm text-white">{game.name}</span>
          <span className="text-xs text-slate-500 font-mono">{game.pm}</span>
        </div>
        <div className="flex items-center gap-4">
          {game.blockedTickets > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
              {game.blockedTickets} blocked
            </span>
          )}
          <span className={`text-xs ${urgencyText[urgency]}`}>{game.daysToSprintEnd}d left</span>
          <span className="text-xs text-slate-400">{game.completion}%</span>
          {open ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-800">
          <div className="mt-3 mb-2">
            <ProgressBar pct={game.completion} color={game.color} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-center">
            <div>
              <div className="text-xs text-slate-500">Open tickets</div>
              <div className="text-lg font-bold text-white">{game.openTickets}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Blocked</div>
              <div className={`text-lg font-bold ${game.blockedTickets > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {game.blockedTickets}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Sprint end</div>
              <div className="text-lg font-bold text-white">{game.daysToSprintEnd}d</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Retention target: <span className="text-slate-300">{game.retentionTarget}</span>
          </div>
          {/* TODO: connect to Jira CHSOL board — filter by game label, sprint = active */}
          <div className="mt-2 text-[10px] text-slate-600 italic">TODO: connect to Jira CHSOL board (appodeal.atlassian.net)</div>
        </div>
      )}
    </div>
  )
}

function BlockerTable() {
  const sorted = [...BLOCKERS].sort((a, b) => b.daysBlocked - a.daysBlocked)
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
        <AlertTriangle size={14} className="text-red-400" />
        <span className="text-sm font-semibold text-slate-300">Active blockers</span>
        <span className="ml-auto text-xs text-slate-500">{BLOCKERS.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Ticket', 'Title', 'Game', 'Owner', 'Days blocked', ''].map(h => (
                <th key={h} className="text-left px-4 py-2 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(b => {
              const game = GAME_MAP[b.game]
              const ageColor = b.daysBlocked > 3 ? 'text-red-400' : b.daysBlocked >= 2 ? 'text-amber-400' : 'text-slate-400'
              return (
                <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{b.id}</td>
                  <td className="px-4 py-2.5 text-slate-200 max-w-[220px] truncate">{b.title}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ backgroundColor: game?.color + '22', color: game?.color }}>
                      {game?.name ?? b.game}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">{b.owner}</td>
                  <td className={`px-4 py-2.5 font-bold ${ageColor}`}>{b.daysBlocked}d</td>
                  <td className="px-4 py-2.5">
                    <a href={b.jiraUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors">
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AllocationBar({ resource }) {
  const allWeek1 = resource.allocation.filter(a => a.week === 1)
  const allWeek2 = resource.allocation.filter(a => a.week === 2)
  const isOverloaded = new Set(resource.allocation.filter(a => a.week === 1).map(a => a.gameId)).size > 1

  function Bar({ items, label }) {
    if (items.length === 0) return <div className="text-xs text-slate-600 italic">Unallocated</div>
    return (
      <div>
        <div className="text-[10px] text-slate-600 mb-1">{label}</div>
        <div className="flex rounded overflow-hidden h-5">
          {items.map((item, i) => {
            const game = GAME_MAP[item.gameId]
            return (
              <div key={i} className="flex-1 flex items-center justify-center text-[10px] font-medium"
                style={{ backgroundColor: game?.color + '44', color: game?.color }}>
                {game?.name?.split(' ')[0]}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-sm text-white">{resource.name}</div>
          <div className="text-xs text-slate-500">{resource.role}</div>
        </div>
        {isOverloaded && (
          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle size={11} />Split allocation
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Bar items={allWeek1} label="This sprint" />
        <Bar items={allWeek2} label="Next sprint" />
      </div>
    </div>
  )
}

function SlackDraftModal({ onClose }) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const draft = `*Chardonnay Resource Update — ${today}*

*Juan Zambrana (TA)*
→ Sprint 1: Solitaire  |  Sprint 2: Word Maker
⚠️ Split allocation — please coordinate handover

*Kris Pillai (QA)*
→ Sprint 1: Solitaire + Word Maker  |  Sprint 2: MetaPlay + Word Solitaire
🔴 At capacity across all 4 products — QA hire in progress (EoM)

Questions → @dheeraj.rai`

  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(draft)
    setCopied(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Draft Slack message</h3>
          <span className="text-xs text-slate-500">→ #chardonnay (C07GS984RUG)</span>
        </div>
        <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap font-mono mb-4 max-h-64 overflow-y-auto">{draft}</pre>
        <div className="text-xs text-amber-400 mb-4 flex items-center gap-1.5">
          <AlertTriangle size={12} />
          Review before sending. Copy and paste into Slack manually.
        </div>
        <div className="flex gap-2">
          <button onClick={copy}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {copied ? '✓ Copied to clipboard' : 'Copy to clipboard'}
          </button>
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Operations() {
  const [showSlackDraft, setShowSlackDraft] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left 60% */}
      <div className="flex-[3] min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Operations</h1>
          <span className="text-xs text-slate-500">Sprint health · Jira CHSOL · Board 1860</span>
        </div>

        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Sprint health</h2>
        {GAMES.map(g => <SprintCard key={g.id} game={g} />)}

        <h2 className="text-sm font-semibold text-slate-400 mb-3 mt-5 uppercase tracking-wider">Blockers</h2>
        <BlockerTable />
      </div>

      {/* Right 40% */}
      <div className="flex-[2] min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Shared resources</h2>
          <button
            onClick={() => setShowSlackDraft(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">
            <Send size={12} />
            Send resource update to Slack
          </button>
        </div>

        {RESOURCES.map(r => <AllocationBar key={r.id} resource={r} />)}

        <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">QA bandwidth risk</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kris is the only QA across all 4 products. Any parallel release windows create bottleneck risk.
            Word Maker (Apr 28) and Solitaire (Apr 30) overlap — coordinate with Carlos.
          </p>
          <div className="mt-2 text-xs text-slate-500">
            Hiring status: <span className="text-slate-300 font-medium">1 QA hire in progress — Carlos, EoM target</span>
          </div>
        </div>
      </div>

      {showSlackDraft && <SlackDraftModal onClose={() => setShowSlackDraft(false)} />}
    </div>
  )
}
