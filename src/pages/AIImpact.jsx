import { useState } from 'react'
import { Lock, Plus, Copy, Check, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { AI_INITIATIVES, AI_BASELINE_METRICS } from '../data/mockData'

const CORRECT_PIN = '2604'

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin === CORRECT_PIN) {
      onUnlock()
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Lock size={28} className="text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-white">AI Impact</h1>
        <p className="text-sm text-slate-400 text-center max-w-xs">
          This section is restricted to Dheeraj only until the data is ready for broader sharing.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col items-center gap-3">
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          maxLength={4}
          className={`w-32 text-center text-xl font-mono tracking-widest bg-slate-900 border rounded-xl px-4 py-3 text-white outline-none transition-colors
            ${error ? 'border-red-500 animate-pulse' : 'border-slate-700 focus:border-indigo-500'}`}
          autoFocus
        />
        <button type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          Unlock
        </button>
        {error && <p className="text-xs text-red-400">Incorrect PIN</p>}
      </form>
    </div>
  )
}

function BaselineSection({ metrics, onSetBaseline }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-300">Section 1 — Baseline</h2>
        <p className="text-xs text-slate-500 mt-1">Set once in Week 1, locked after confirmation. These become the comparison point for all AI impact measurement.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Metric', 'Unit', 'Baseline value', 'Date set', 'Source', ''].map(h => (
                <th key={h} className="text-left px-4 py-2 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <MetricRow key={m.id} metric={m} onSetBaseline={onSetBaseline} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricRow({ metric, onSetBaseline }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')
  const [source, setSource] = useState('')

  function lock() {
    if (!val) return
    onSetBaseline(metric.id, val, source)
    setEditing(false)
  }

  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3 text-slate-200 font-medium">{metric.label}</td>
      <td className="px-4 py-3 text-slate-500">{metric.unit}</td>
      <td className="px-4 py-3">
        {metric.baseline
          ? <span className="text-green-400 font-mono font-bold">{metric.baseline}</span>
          : editing
            ? <input value={val} onChange={e => setVal(e.target.value)}
                className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-white outline-none focus:border-indigo-500"
                placeholder="value" autoFocus />
            : <span className="text-slate-600 italic">Not set</span>
        }
      </td>
      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
        {metric.lockedAt ?? '—'}
      </td>
      <td className="px-4 py-3">
        {metric.baseline
          ? <span className="text-slate-500 text-[11px]">{metric.source ?? 'Manual'}</span>
          : editing
            ? <input value={source} onChange={e => setSource(e.target.value)}
                className="w-28 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-white outline-none focus:border-indigo-500"
                placeholder="source" />
            : <span className="text-slate-700">—</span>
        }
      </td>
      <td className="px-4 py-3">
        {metric.baseline ? (
          <span className="text-[10px] text-green-400/60">🔒 Locked {metric.lockedAt}</span>
        ) : editing ? (
          <div className="flex gap-1">
            <button onClick={lock}
              className="text-xs px-2 py-0.5 bg-green-600 hover:bg-green-500 text-white rounded">Lock</button>
            <button onClick={() => setEditing(false)}
              className="text-xs px-2 py-0.5 text-slate-500 hover:text-white">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}
            className="text-xs px-2 py-0.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded">
            Set baseline
          </button>
        )}
      </td>
    </tr>
  )
}

function CurrentSection({ metrics }) {
  // No actual current data yet — show placeholders
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-300">Section 2 — Current</h2>
        <p className="text-xs text-slate-500 mt-1">Auto-updated each sprint. Conservative display: if delta &gt;40% in first 4 weeks, shows 40% + "(stabilising)".</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Metric', 'Baseline', 'Current', 'Delta', ''].map(h => (
                <th key={h} className="text-left px-4 py-2 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.id} className="border-b border-slate-800/50">
                <td className="px-4 py-3 text-slate-200">{m.label}</td>
                <td className="px-4 py-3 text-slate-500 font-mono">{m.baseline ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 font-mono">—</td>
                <td className="px-4 py-3 text-slate-600 italic text-[11px]">Awaiting baseline</td>
                <td className="px-4 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InitiativesLog({ initiatives, onAdd }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ person: '', initiative: '', tool: '', started: '', outputMetric: '', before: '', after: '', status: 'In progress' })

  function submit() {
    if (!form.person || !form.initiative) return
    onAdd({ ...form, id: `gi-${Date.now()}`, delta: '—' })
    setAdding(false)
    setForm({ person: '', initiative: '', tool: '', started: '', outputMetric: '', before: '', after: '', status: 'In progress' })
  }

  const STATUS_COLORS = {
    'In progress': 'bg-blue-500/20 text-blue-400',
    'Complete': 'bg-green-500/20 text-green-400',
    'Paused': 'bg-slate-700 text-slate-400',
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">Section 3 — AI Initiatives Log</h2>
          <p className="text-xs text-slate-500 mt-1">Track what each team member is doing with AI tooling and the measured impact.</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
          <Plus size={12} />Add initiative
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Person', 'Initiative', 'Tool', 'Started', 'Output metric', 'Before', 'After', 'Delta', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-slate-500 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initiatives.map(i => (
              <tr key={i.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">{i.person}</td>
                <td className="px-4 py-3 text-slate-300">{i.initiative}</td>
                <td className="px-4 py-3 text-slate-400 font-mono">{i.tool}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{i.started}</td>
                <td className="px-4 py-3 text-slate-400">{i.outputMetric}</td>
                <td className="px-4 py-3 text-slate-500 font-mono">{i.before}</td>
                <td className="px-4 py-3 text-slate-500 font-mono">{i.after}</td>
                <td className="px-4 py-3 font-mono">
                  {i.delta === '—' ? <span className="text-slate-600">—</span> :
                    parseFloat(i.delta) > 0
                      ? <span className="text-green-400">↑{i.delta}</span>
                      : <span className="text-red-400">↓{i.delta}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${STATUS_COLORS[i.status] ?? 'bg-slate-700 text-slate-400'}`}>
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adding && (
        <div className="border-t border-slate-800 p-4 bg-slate-800/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {[
              { key: 'person', label: 'Person' },
              { key: 'initiative', label: 'Initiative' },
              { key: 'tool', label: 'Tool' },
              { key: 'started', label: 'Started' },
              { key: 'outputMetric', label: 'Output metric' },
              { key: 'before', label: 'Before' },
              { key: 'after', label: 'After' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none">
                {['In progress', 'Complete', 'Paused'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={submit}
              className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded">Add</button>
            <button onClick={() => setAdding(false)}
              className="text-xs px-3 py-1.5 text-slate-500 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ManagementStory({ metrics, initiatives }) {
  const [copied, setCopied] = useState(false)
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const activeCount = initiatives.filter(i => i.status === 'In progress').length

  const story = `As of ${today}, AI assistance has contributed to:
• Release velocity: baseline not yet set — measurement in progress
• QA cycle time: baseline not yet set — measurement in progress
• TA throughput: baseline not yet set — measurement in progress
• ${activeCount} team member(s) have active AI initiatives
• Case study: Giulia Galvani — Remote config management via Cursor + Claude (In progress)
• Trend: Initialising — Week 1 baseline collection underway`

  function copy() {
    navigator.clipboard.writeText(story)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">Section 4 — Management Story</h2>
          <p className="text-xs text-slate-500 mt-1">Auto-generated. Copy for Jordi briefing or export to PDF.</p>
        </div>
        <button onClick={copy}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors
            ${copied ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy to clipboard'}
        </button>
      </div>
      <pre className="bg-slate-800 rounded-lg p-4 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
        {story}
      </pre>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
        <AlertTriangle size={11} className="text-amber-400" />
        Conservative display rule active: any delta &gt;40% in first 4 weeks will show as 40% + "(stabilising)"
      </div>
    </div>
  )
}

export default function AIImpact() {
  const [unlocked, setUnlocked] = useState(false)
  const [metrics, setMetrics] = useState(AI_BASELINE_METRICS)
  const [initiatives, setInitiatives] = useState(AI_INITIATIVES)

  function handleSetBaseline(id, value, source) {
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    setMetrics(prev => prev.map(m => m.id === id
      ? { ...m, baseline: value, lockedAt: now, source }
      : m
    ))
  }

  function handleAddInitiative(init) {
    setInitiatives(prev => [...prev, init])
  }

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            AI Impact
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Restricted
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Dheeraj only · Unlocks for Jordi when baseline data is ready</p>
        </div>
        <button onClick={() => setUnlocked(false)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800">
          <Lock size={12} />Lock
        </button>
      </div>

      <BaselineSection metrics={metrics} onSetBaseline={handleSetBaseline} />
      <CurrentSection metrics={metrics} />
      <InitiativesLog initiatives={initiatives} onAdd={handleAddInitiative} />
      <ManagementStory metrics={metrics} initiatives={initiatives} />
    </div>
  )
}
