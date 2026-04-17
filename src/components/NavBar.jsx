import { NavLink } from 'react-router-dom'
import { RefreshCw, Lock } from 'lucide-react'
import { GAMES, BLOCKERS } from '../data/mockData'

function HealthDot() {
  // RED if any blocker >3 days old, AMBER if QA bandwidth warning, else GREEN
  const hasOldBlocker = BLOCKERS.some(b => b.daysBlocked > 3)
  const qaOverloaded = GAMES.filter(g => g.blockedTickets > 0).length >= 2

  const status = hasOldBlocker ? 'red' : qaOverloaded ? 'amber' : 'green'
  const colors = { green: 'bg-green-400', amber: 'bg-amber-400', red: 'bg-red-500' }

  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]} shadow-lg`}
      title={`Division health: ${status.toUpperCase()}`} />
  )
}

export default function NavBar({ lastSynced, onRefresh }) {
  const navItem = 'px-4 py-1.5 rounded-md text-sm font-medium transition-colors'
  const active = 'bg-white/10 text-white'
  const inactive = 'text-slate-400 hover:text-white hover:bg-white/5'

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0f1117]/95 backdrop-blur">
      {/* Left: wordmark */}
      <div className="flex items-center gap-2.5 min-w-[160px]">
        <span className="text-base font-semibold tracking-tight text-white">Chardonnay</span>
        <HealthDot />
      </div>

      {/* Center: nav tabs */}
      <nav className="flex items-center gap-1">
        {[
          { to: '/', label: 'Overview' },
          { to: '/operations', label: 'Operations' },
          { to: '/release', label: 'Release Train' },
          { to: '/team', label: 'Team' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
          >
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/ai"
          className={({ isActive }) => `${navItem} ${isActive ? active : inactive} flex items-center gap-1.5`}
        >
          <Lock size={12} className="opacity-60" />
          AI
        </NavLink>
      </nav>

      {/* Right: sync + avatar */}
      <div className="flex items-center gap-3 min-w-[160px] justify-end">
        <span className="text-xs text-slate-500">Last synced {lastSynced}</span>
        <button onClick={onRefresh}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Refresh">
          <RefreshCw size={14} />
        </button>
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
          DR
        </div>
      </div>
    </header>
  )
}
