import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { TEAM, GAMES, RESOURCES } from '../data/mockData'

const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]))

function gameLabel(gameId) {
  if (gameId === 'all') return 'All games'
  return GAME_MAP[gameId]?.name ?? gameId
}

function gameColor(gameId) {
  if (gameId === 'all') return '#94A3B8'
  return GAME_MAP[gameId]?.color ?? '#94A3B8'
}

function PersonCard({ person, onFocusEdit }) {
  const [editing, setEditing] = useState(false)
  const [focus, setFocus] = useState(person.focus)

  function save() {
    onFocusEdit(person.id, focus)
    setEditing(false)
  }

  const sharedBadge = person.shared
    ? person.sharedLevel === 'red'
      ? <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">SHARED · CRITICAL</span>
      : <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">SHARED</span>
    : null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ backgroundColor: person.color + '33', border: `2px solid ${person.color}` }}>
          <span style={{ color: person.color }}>{person.initials}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-white text-sm">{person.name}</span>
            {sharedBadge}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{person.role}</div>
        </div>
      </div>

      {/* Game tags */}
      <div className="flex flex-wrap gap-1">
        {person.games.map(gid => (
          <span key={gid}
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: gameColor(gid) + '22', color: gameColor(gid) }}>
            {gameLabel(gid)}
          </span>
        ))}
      </div>

      {/* Sprint focus */}
      <div className="border-t border-slate-800 pt-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Sprint focus</div>
        {editing ? (
          <div className="flex gap-2">
            <input value={focus} onChange={e => setFocus(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-indigo-500"
              onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
            <button onClick={save}
              className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500">Save</button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-slate-300 leading-relaxed">{focus}</p>
            <button onClick={() => setEditing(true)}
              className="text-[10px] text-slate-500 hover:text-slate-300 flex-shrink-0 mt-0.5">edit</button>
          </div>
        )}
      </div>

      {/* Slack */}
      <div className="text-[11px] text-slate-500">
        <span className="font-mono">{person.slack}</span>
      </div>
    </div>
  )
}

// 2-week allocation grid for Juan + Kris
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function AllocationGrid() {
  // week 1 = days 0-4, week 2 = days 5-9
  // Juan: sol wk1, wm wk2 | Kris: sol+wm wk1, meta+ws wk2
  const grid = {
    juan: {
      0: 'solitaire', 1: 'solitaire', 2: 'solitaire', 3: 'solitaire', 4: 'solitaire',
      5: 'wordmaker', 6: 'wordmaker', 7: 'wordmaker', 8: 'wordmaker', 9: 'wordmaker',
    },
    kris: {
      0: 'solitaire', 1: 'wordmaker', 2: 'solitaire', 3: 'wordmaker', 4: 'solitaire',
      5: 'metaplay', 6: 'wordsolitaire', 7: 'metaplay', 8: 'wordsolitaire', 9: 'metaplay',
    },
  }

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Shared Resource Allocation — Next 2 Weeks</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-slate-500 pr-4 py-1 font-medium w-32">Resource</th>
              <th className="text-center text-slate-600 px-2 py-1 font-medium" colSpan={5}>Week 1</th>
              <th className="text-center text-slate-600 px-2 py-1 font-medium" colSpan={5}>Week 2</th>
            </tr>
            <tr>
              <th className="text-left text-slate-500 pr-4 pb-2"></th>
              {DAYS.map((d, i) => (
                <th key={i} className={`text-center text-slate-600 px-2 pb-2 font-normal ${i === 5 ? 'border-l border-slate-700' : ''}`}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map(res => (
              <tr key={res.id} className="border-t border-slate-800">
                <td className="pr-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: res.color }} />
                    <span className="text-slate-300 font-medium">{res.name.split(' ')[0]}</span>
                  </div>
                </td>
                {DAYS.map((_, i) => {
                  const gid = grid[res.id]?.[i]
                  const game = GAME_MAP[gid]
                  return (
                    <td key={i} className={`px-1 py-2 text-center ${i === 5 ? 'border-l border-slate-700' : ''}`}>
                      {gid ? (
                        <div className="w-full rounded text-[10px] font-medium py-0.5 px-1 truncate"
                          style={{ backgroundColor: game?.color + '33', color: game?.color }}>
                          {game?.name?.split(' ')[0] ?? gid}
                        </div>
                      ) : <span className="text-slate-700">—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-400">
          <AlertTriangle size={12} />
          <span>Juan split across 2 games — coordinate sprint start allocation each cycle.</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-red-400">
          <AlertTriangle size={12} />
          <span>Kris covering all 4 products — QA hire in progress (Carlos, EoM target). Bandwidth at risk.</span>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const [team, setTeam] = useState(TEAM)

  function handleFocusEdit(id, newFocus) {
    setTeam(prev => prev.map(p => p.id === id ? { ...p, focus: newFocus } : p))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Team</h1>
          <p className="text-sm text-slate-400 mt-0.5">Chardonnay Gaming division — {team.length} people</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {team.map(person => (
          <PersonCard key={person.id} person={person} onFocusEdit={handleFocusEdit} />
        ))}
      </div>

      <AllocationGrid />
    </div>
  )
}
