#!/usr/bin/env node
// sync-rippling-ooo.mjs
// Fetches approved time-off from Rippling and upserts into Supabase team_ooo table.
// Also seeds public holidays for Barcelona + Kazakhstan teams.
// Run manually: node scripts/sync-rippling-ooo.mjs
// Run via GitHub Actions: .github/workflows/sync-rippling-ooo.yml (every Monday 7am UTC)

import { createClient } from '@supabase/supabase-js'

const RIPPLING_KEY = process.env.RIPPLING_API_KEY
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Name mapping — Rippling full names → Gantt display names
const NAME_MAP = {
  'Didara Pernebayeva':      'Didara',
  'Toni Puig':               'Toni',
  'Victor Romero':           'Víctor',
  'Juan Sabater':            'Juan S',
  'Juan Zambrana':           'Juan Z',
  'Srikanth Reddy':          'Srikanth',
  'Yevhenii Siechko':        'Yevhenii',
  'Angel Miladinov':         'Angel',
  'Murat Kacmaz':            'Murat',
  'Henrique Nakajima':       'Henrique',
  'Guillem Urpí Montserrat': 'Guillem',
  'Krishnanunni Pillai':     'Krish',
  'Andreu Margarit':         'Andreu',
  'Dheeraj Rai':             'Dheeraj',
}

async function main() {
  if (!RIPPLING_KEY) {
    console.log('ℹ️  No RIPPLING_API_KEY — skipping Rippling sync, seeding public holidays only')
    await seedPublicHolidays()
    return
  }

  // Fetch approved time-off from Rippling
  const res = await fetch('https://app.rippling.com/api/time_off/requests?status=approved', {
    headers: { Authorization: `Bearer ${RIPPLING_KEY}` },
  })
  if (!res.ok) {
    console.error(`❌ Rippling API error: ${res.status} ${res.statusText}`)
    process.exit(1)
  }
  const data = await res.json()

  // Delete existing Rippling-sourced entries then re-insert
  const { error: delErr } = await supabase.from('team_ooo').delete().eq('source', 'rippling')
  if (delErr) { console.error('❌ Delete rippling rows:', delErr.message); process.exit(1) }

  let synced = 0
  for (const req of data.results || []) {
    const name = NAME_MAP[req.employee?.name] || req.employee?.name
    if (!name) continue
    const { error } = await supabase.from('team_ooo').insert({
      person_name:  name,
      person_email: req.employee?.work_email,
      start_date:   req.start_date,
      end_date:     req.end_date,
      note:         req.type?.name || 'Time off',
      source:       'rippling',
    })
    if (error) console.warn(`  ⚠️  ${name}: ${error.message}`)
    else synced++
  }
  console.log(`✅ Synced ${synced} time-off requests from Rippling`)

  await seedPublicHolidays()
}

async function seedPublicHolidays() {
  // Delete old public holiday rows then re-seed
  const { error: delErr } = await supabase.from('team_ooo').delete().eq('source', 'public_holiday')
  if (delErr) { console.error('❌ Delete public_holiday rows:', delErr.message); process.exit(1) }

  const BARCELONA = ['Toni','Víctor','Juan S','Juan Z','Srikanth','Yevhenii','Angel','Murat','Henrique','Guillem','Krish','Andreu','Dheeraj']
  const KAZAKHSTAN = ['Didara']
  const ALL_TEAM  = [...BARCELONA, ...KAZAKHSTAN]

  const holidays = [
    // Shared
    { date: '2026-05-01', name: 'Labour Day',       people: ALL_TEAM },
    // Barcelona / Spain
    { date: '2026-06-24', name: 'Sant Joan',         people: BARCELONA },
    // Kazakhstan — Didara
    { date: '2026-05-07', name: "Defender's Day",    people: KAZAKHSTAN },
    { date: '2026-05-09', name: 'Victory Day',       people: KAZAKHSTAN },
  ]

  let seeded = 0
  for (const h of holidays) {
    for (const person of h.people) {
      const { error } = await supabase.from('team_ooo').insert({
        person_name: person,
        start_date:  h.date,
        end_date:    h.date,
        note:        h.name,
        source:      'public_holiday',
      })
      if (error) console.warn(`  ⚠️  ${person} ${h.date}: ${error.message}`)
      else seeded++
    }
  }
  console.log(`✅ Seeded ${seeded} public holiday rows`)
}

main().catch(e => { console.error(e); process.exit(1) })
