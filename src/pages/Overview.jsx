import { useState } from 'react'
import { Copy, Check, Pencil, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { GAMES, BLOCKERS } from '../data/mockData'

function HealthBadge() {
  const hasOldBlocker = BLOCKERS.some(b => b.daysBlocked > 3)
  const qaOverloaded = GAMES.filter(g => g.blockedTickets > 0).length >= 2

  const status = hasOldBlocker ? 'RED' : qaOverloaded ? 'AMBER' : 'GREEN'
  const styles = {
    GREEN: 'bg-green-500/10 text-green-400 border-green-500/30',
    AMBER: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    RED:   'bg-red-500/10 text-red-400 border-red-500/30',
  }
  const reason = hasOldBlocker
    ? `Blocker >3 days: ${BLOCKERS.find(b => b.daysBlocked > 3)?.id}`
    : qaOverloaded ? 'QA bandwidth warning: multiple products in-flight'
    : 'No active blockers · QA load nominal'

  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${styles[status]} mb-6`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${status === 'GREEN' ? 'bg-green-400' : status === 'AMBER' ? 'bg-amber-400' : 'bg-red-500'} animate-pulse`} />
        <span className="font-bold text-base">{status}</span>
      </div>
      <span className="text-sm opacity-80">— {reason}</span>
    </div>
  )
}

function StatCard({ label, value, sub, editable, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  function save() {
    onEdit?.(val)
    setEditing(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-1 hover:border-slate-700 transition-colors">
      <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
      {editing ? (
        <div className="flex gap-2 mt-1">
          <input value={val} onChange={e => setVal(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-lg font-bold text-white outline-none focus:border-indigo-500"
            onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
          <button onClick={save} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">OK</button>
        </div>
      ) : (
        <div className="flex items-end gap-2 mt-1">
          <span className="text-2xl font-bold text-white">{val}</span>
          {editable && (
            <button onClick={() => setEditing(true)} className="mb-0.5 text-slate-600 hover:text-slate-400">
              <Pencil size={12} />
            </button>
          )}
        </div>
      )}
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-800">
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Sparkline({ data, color }) {
  const max = Math.max(...data, 0.1)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 28, pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2)
        const y = h - pad - ((v - min) / range) * (h - pad * 2)
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      })}
    </svg>
  )
}

function GameOneLiner({ game }) {
  const [text, setText] = useState(game.oneLiner)
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800 last:border-0">
      <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: game.color }} />
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-indigo-500"
              onKeyDown={e => { if (e.key === 'Enter') setEditing(false) }} autoFocus />
            <button onClick={() => setEditing(false)} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">OK</button>
          </div>
        ) : (
          <p className="text-sm text-slate-300">{text}</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => setEditing(!editing)} className="text-slate-600 hover:text-slate-400 p-1">
          <Pencil size={11} />
        </button>
        <CopyButton text={text} />
      </div>
    </div>
  )
}

export default function Overview() {
  const totalOpen = GAMES.reduce((s, g) => s + g.openTickets, 0)
  const totalBlocked = GAMES.reduce((s, g) => s + g.blockedTickets, 0)
  const nextRelease = GAMES
    .filter(g => g.nextRelease !== 'TBD')
    .sort((a, b) => new Date(a.nextRelease) - new Date(b.nextRelease))[0]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Management signal layer — for Jordi → Ana briefings</p>
        </div>
        <div className="text-xs text-slate-600">Apr 17, 2026</div>
      </div>

      <HealthBadge />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active games" value={GAMES.length} sub="in pipeline" editable />
        <StatCard label="Next release" value={nextRelease?.name ?? '—'}
          sub={nextRelease?.nextRelease ?? ''} editable />
        <StatCard label="Open blockers" value={totalBlocked}
          sub={`${totalOpen} open tickets total`} editable />
        <StatCard label="AI initiatives" value="1" sub="In progress · 1 team member" editable />
      </div>

      {/* Game one-liners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-300">Game status — copy-ready</h2>
            <span className="text-[10px] text-slate-600">Click edit to override · Copy for mgmt report</span>
          </div>
          <div className="mt-2">
            {GAMES.map(g => <GameOneLiner key={g.id} game={g} />)}
          </div>
        </div>

        {/* Sparklines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Weekly trends — last 4 sprints</h2>
          <div className="space-y-5">
            {GAMES.map(g => (
              <div key={g.id} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <div className="text-xs font-medium text-slate-300">{g.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{g.sprintStatus}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] text-slate-600 mb-1">Velocity</div>
                    <Sparkline data={g.velocityTrend} color={g.color} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-600 mb-1">Crash %</div>
                    <Sparkline data={g.crashTrend} color="#EF4444" />
                    {/* TODO: connect to Grafana/Sentry when available */}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-slate-400">
                    {g.velocityTrend[g.velocityTrend.length - 1] >= g.velocityTrend[g.velocityTrend.length - 2]
                      ? <TrendingUp size={14} className="text-green-400 inline" />
                      : <TrendingDown size={14} className="text-red-400 inline" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">v{g.velocityTrend[g.velocityTrend.length-1]}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <AlertTriangle size={11} className="text-amber-400" />
              Crash rate source: TODO — connect Grafana/Sentry when available
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
