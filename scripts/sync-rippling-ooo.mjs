#!/usr/bin/env node
// ── sync-rippling-ooo.mjs ─────────────────────────────────────────────────
// Syncs Rippling approved leave requests → Supabase team_ooo table
// Also seeds public holidays for Barcelona + Kazakhstan
//
// Auth: Bearer token (personal API token from Rippling Settings)
//
// ENDPOINTS USED:
//   GET https://rest.ripplingapis.com/workers/
//       → scope: workers.read
//       → gives us: worker id, name, work_email
//
//   GET https://api.rippling.com/platform/api/leave_requests
//       → scope: leave-requests.read (platform API tier)
//       → gives us: employee id, start_date, end_date, status, type
//
// Required env vars:
//   RIPPLING_API_KEY      — personal Bearer token from Rippling Settings → Integrations → API
//   VITE_SUPABASE_URL     — https://bbzhntajcxdgeskbmbzp.supabase.co
//   SUPABASE_SERVICE_KEY  — service_role key from Supabase Settings → API
// ─────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const RIPPLING_KEY  = process.env.RIPPLING_API_KEY
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  || 'https://bbzhntajcxdgeskbmbzp.supabase.co'
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_KEY) {
  console.error('❌  SUPABASE_SERVICE_KEY is required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Name mapping: Rippling display name → Gantt display name ──────────────
const NAME_MAP = {
  'Didara Pernebayeva':       'Didara',
  'Toni Puig':                'Toni',
  'Antonio Puig':             'Toni',
  'Victor Romero':            'Víctor',
  'Víctor Romero':            'Víctor',
  'Juan Sabater':             'Juan S',
  'Juan Sabater Sanjaume':    'Juan S',
  'Juan Zambrana':            'Juan Z',
  'Srikanth Reddy':           'Srikanth',
  'Yevhenii Siechko':         'Yevhenii',
  'Angel Miladinov':          'Angel',
  'Murat Kacmaz':             'Murat',
  'Henrique Nakajima':        'Henrique',
  'Guillem Urpí Montserrat':  'Guillem',
  'Guillem Montserrat':       'Guillem',
  'Krishnanunni Pillai':      'Krish',
  'Krish Prabha':             'Krish',
  'Andreu Margarit':          'Andreu',
  'Dheeraj Rai':              'Dheeraj',
}

// ── Public holidays ───────────────────────────────────────────────────────
const BCN = ['Toni','Víctor','Juan S','Juan Z','Srikanth','Yevhenii','Angel','Murat','Henrique','Guillem','Krish','Andreu','Dheeraj']
const KAZ = ['Didara']
const ALL = [...BCN, ...KAZ]

const PUBLIC_HOLIDAYS = [
  { date: '2026-05-01', name: 'Labour Day',        people: ALL  },
  { date: '2026-05-07', name: "Defender's Day",    people: KAZ  },
  { date: '2026-05-09', name: 'Victory Day',       people: KAZ  },
  { date: '2026-06-24', name: 'Sant Joan',          people: BCN  },
  { date: '2026-08-15', name: 'Assumption Day',     people: BCN  },
  { date: '2026-09-11', name: "Diada de Catalunya", people: BCN  },
  { date: '2026-12-25', name: 'Christmas Day',      people: ALL  },
  { date: '2026-12-26', name: 'St Stephens Day',    people: BCN  },
]

// ── Rippling API helpers ──────────────────────────────────────────────────
async function ripplingGet(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${RIPPLING_KEY}`,
      Accept: 'application/json',
    }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Rippling ${res.status} at ${url}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

// ── Step 1: Get workers (id → display name mapping) ───────────────────────
async function getWorkerMap() {
  console.log('  👥 Fetching workers from Rippling...')
  const data = await ripplingGet('https://rest.ripplingapis.com/workers/?expand=user')
  const map = {}
  for (const worker of data.results || []) {
    const fullName = worker.name || `${worker.first_name || ''} ${worker.last_name || ''}`.trim()
    const displayName = NAME_MAP[fullName]
    if (displayName) {
      map[worker.id] = { displayName, email: worker.work_email }
    }
  }
  console.log(`  ✓ Mapped ${Object.keys(map).length} team members`)
  return map
}

// ── Step 2: Get approved leave requests ───────────────────────────────────
async function getLeaveRequests(workerMap) {
  console.log('  📅 Fetching leave requests from Rippling...')

  // Try Tier 1 REST API first, fall back to platform API
  let requests = []

  // Try platform API (has leave_requests endpoint)
  try {
    const data = await ripplingGet('https://api.rippling.com/platform/api/leave_requests?status=approved&limit=200')
    requests = data.results || data || []
    console.log(`  ✓ Platform API: found ${requests.length} approved requests`)
  } catch (e) {
    console.log(`  ⚠️  Platform API failed: ${e.message}`)
    console.log('  ℹ️  Leave request sync skipped — will seed public holidays only')
    return []
  }

  // Filter to our team and upcoming dates only
  const cutoff = new Date('2026-04-01')
  const toInsert = []

  for (const req of requests) {
    // Try different field names for the worker ID
    const workerId = req.role || req.worker_id || req.employee_id || req.worker?.id
    const worker = workerMap[workerId]
    if (!worker) continue // Not on our team

    // Skip past requests
    const endDate = new Date(req.end_date || req.endDate || req.end)
    if (endDate < cutoff) continue

    const startDate = req.start_date || req.startDate || req.start
    const endDateStr = req.end_date || req.endDate || req.end
    const typeName = req.leave_type?.name || req.type_name || req.leave_type_name || 'Time off'

    toInsert.push({
      person_name:  worker.displayName,
      person_email: worker.email,
      start_date:   startDate,
      end_date:     endDateStr,
      note:         typeName,
      source:       'rippling',
    })
  }

  console.log(`  ✓ ${toInsert.length} leave requests for our team`)
  return toInsert
}

// ── Step 3: Seed public holidays ──────────────────────────────────────────
async function seedPublicHolidays() {
  console.log('  🏖️  Seeding public holidays...')
  await supabase.from('team_ooo').delete().eq('source', 'public_holiday')

  const rows = []
  for (const h of PUBLIC_HOLIDAYS) {
    for (const person of h.people) {
      rows.push({
        person_name: person,
        start_date:  h.date,
        end_date:    h.date,
        note:        h.name,
        source:      'public_holiday',
      })
    }
  }

  const { error } = await supabase.from('team_ooo').insert(rows)
  if (error) throw error
  console.log(`  ✓ ${PUBLIC_HOLIDAYS.length} holidays seeded (${rows.length} person-days)`)
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔄  Rippling OOO Sync — ' + new Date().toISOString())

  if (!RIPPLING_KEY) {
    console.log('⚠️   No RIPPLING_API_KEY — seeding public holidays only')
    await seedPublicHolidays()
    console.log('\n✅  Done (public holidays only)')
    return
  }

  // Sync leave requests
  try {
    const workerMap = await getWorkerMap()
    const leaveRequests = await getLeaveRequests(workerMap)

    if (leaveRequests.length > 0) {
      await supabase.from('team_ooo').delete().eq('source', 'rippling')
      const { error } = await supabase.from('team_ooo').insert(leaveRequests)
      if (error) throw error
      console.log(`  ✓ ${leaveRequests.length} leave requests written to Supabase`)
    }
  } catch (e) {
    console.error('  ⚠️  Rippling sync error:', e.message)
    console.log('  Continuing with public holidays...')
  }

  await seedPublicHolidays()
  console.log('\n✅  Sync complete')
}

main().catch(e => { console.error('❌', e); process.exit(1) })
