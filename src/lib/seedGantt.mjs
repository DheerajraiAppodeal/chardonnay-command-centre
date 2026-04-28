#!/usr/bin/env node
// ── Seed Gantt database from current roadmapData.js ──────────────────────────
// Run ONCE after schema.sql has been executed in the Supabase SQL editor:
//
//   VITE_SUPABASE_URL=https://bbzhntajcxdgeskbmbzp.supabase.co \
//   VITE_SUPABASE_ANON_KEY=<your-anon-key> \
//   node src/lib/seedGantt.mjs
//
// Safe to re-run — deletes existing data for the affected games first.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('❌  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running.')
  process.exit(1)
}

const sb = createClient(url, key)

// ── Seed data — mirrors src/roadmapData.js ────────────────────────────────────
const FEATURES = {
  wm: [
    {
      id_key: 'wm-m7', game: 'wm', version: '1.46.0', name: 'Collectible Event',
      subtitle: 'Gems / Lanterns / Chain Tiles', kpi_target: 'D1–D3 retention uplift',
      status: 'live', sprint_week_start: 0, risks: [],
      tracks: [
        { track:'design',  status:'done', note:'Spec finalised',       week_start:0, week_end:1, people:['Didara'] },
        { track:'art',     status:'done', note:'Assets delivered',     week_start:0, week_end:1, people:['Juan Z'] },
        { track:'techArt', status:'done', note:'Integration complete', week_start:1, week_end:2, people:['Juan S'] },
        { track:'dev',     status:'done', note:'Live @ 10% Android',   week_start:1, week_end:2, people:['Toni','Víctor'] },
        { track:'qa',      status:'done', note:'Signed off',           week_start:2, week_end:2, people:['Krish'] },
      ],
    },
    {
      id_key: 'wm-m8', game: 'wm', version: '1.47.0', name: "Beginner's Bonus",
      subtitle: 'Jigsaw Puzzle + feature foreshadowing', kpi_target: 'D2–D3 retention uplift',
      status: 'in-progress', sprint_week_start: 0, risks: ['11 QA tickets unassigned — Krish not yet briefed'],
      tracks: [
        { track:'design',  status:'done',        note:'Spec complete',           week_start:0, week_end:1, people:['Didara'] },
        { track:'art',     status:'done',        note:'Assets delivered',        week_start:0, week_end:1, people:['Juan Z'] },
        { track:'techArt', status:'done',        note:'Prefabs created',         week_start:1, week_end:2, people:['Juan S'] },
        { track:'dev',     status:'review',      note:'11 tickets Ready for QA', week_start:1, week_end:2, people:['Toni','Víctor'] },
        { track:'qa',      status:'not-started', note:'Tickets unassigned ⚠️',   week_start:2, week_end:3, people:['Krish'] },
      ],
    },
    {
      id_key: 'wm-m9', game: 'wm', version: '1.48.0', name: 'Word Master Chained Reward',
      subtitle: '', kpi_target: 'D1–D3 retention uplift',
      status: 'planned', sprint_week_start: 2, risks: [],
      tracks: [
        { track:'design',  status:'in-progress', note:'Spec in progress', week_start:2, week_end:3, people:['Didara'] },
        { track:'art',     status:'not-started', note:'',                  week_start:3, week_end:4, people:['Juan Z'] },
        { track:'techArt', status:'not-started', note:'',                  week_start:4, week_end:5, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'',                  week_start:4, week_end:6, people:['Toni','Víctor'] },
        { track:'qa',      status:'not-started', note:'',                  week_start:6, week_end:7, people:['Krish'] },
      ],
    },
    {
      id_key: 'wm-trivia-levels', game: 'wm', version: '1.49.0', name: 'Trivia Levels',
      subtitle: 'New breather game mode — trivia Q&A every 5 levels', kpi_target: '+3pp D3 · +2pp D7 · +15s avg session',
      status: 'in-progress', sprint_week_start: 1,
      risks: ['Level System rebuild is out of scope','10 themed levels at launch — English only'],
      tracks: [
        { track:'design',  status:'in-progress', note:'Spec in progress — done by end of week',     week_start:1, week_end:2, people:['Didara'] },
        { track:'art',     status:'in-progress', note:'Art sprint planned Apr 27 — delivering Wed', week_start:1, week_end:2, people:['Juan Z'] },
        { track:'techArt', status:'not-started', note:'Starts when art assets land',                 week_start:2, week_end:3, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'Next sprint — picks up May 5',                week_start:2, week_end:4, people:['Toni','Víctor'] },
        { track:'qa',      status:'not-started', note:'',                                            week_start:4, week_end:5, people:['Krish'] },
      ],
    },
    {
      id_key: 'wm-album-event', game: 'wm', version: '1.49.0', name: 'Album Event',
      subtitle: '1-week seasonal event — collect stickers, fill albums, win grand prize',
      kpi_target: '+2pp D3 · +2pp D7 · +10s avg session vs baseline',
      status: 'in-progress', sprint_week_start: 1,
      risks: ['Art cadence risk — 6 badges + Grand Prize per event weekly','Timer/FOMO mechanics need clear spec'],
      tracks: [
        { track:'design',  status:'in-progress', note:'Spec in progress — done start of next week', week_start:1, week_end:2, people:['Didara'] },
        { track:'art',     status:'in-progress', note:'Art sprint planned Apr 27 — delivering Wed', week_start:1, week_end:2, people:['Juan Z','Guillem'] },
        { track:'techArt', status:'not-started', note:'Starts when art assets land',                 week_start:2, week_end:3, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'Next sprint — picks up May 5',                week_start:2, week_end:4, people:['Toni','Víctor'] },
        { track:'qa',      status:'not-started', note:'',                                            week_start:4, week_end:5, people:['Krish','Andreu'] },
      ],
    },
    {
      id_key: 'wm-m11', game: 'wm', version: '1.50.0', name: 'Meta Progress + FTUE Polish',
      subtitle: '', kpi_target: 'D1→D3–D7 uplift',
      status: 'planned', sprint_week_start: 7, risks: [],
      tracks: [
        { track:'design',  status:'not-started', note:'', week_start:7, week_end:8, people:['Didara'] },
        { track:'art',     status:'not-started', note:'', week_start:8, week_end:9, people:['Juan Z'] },
        { track:'techArt', status:'not-started', note:'', week_start:8, week_end:9, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'', week_start:8, week_end:9, people:['Toni','Víctor'] },
        { track:'qa',      status:'not-started', note:'', week_start:9, week_end:9, people:['Krish'] },
      ],
    },
  ],
  sol: [
    {
      id_key: 'sol-5.8.0-game-end', game: 'sol', version: 'v5.8.0', name: 'Game End Flow Ph1',
      subtitle: 'v5.8.0 · Apr 23', kpi_target: 'D1 retention',
      status: 'in-progress', sprint_week_start: 0, risks: [],
      tracks: [
        { track:'design',  status:'done',        note:'Spec complete', week_start:0, week_end:1, people:['Srikanth'] },
        { track:'art',     status:'done',        note:'Assets ready',  week_start:0, week_end:1, people:['Henrique'] },
        { track:'techArt', status:'done',        note:'',              week_start:0, week_end:1, people:['Juan S'] },
        { track:'dev',     status:'review',      note:'Ready for QA',  week_start:0, week_end:1, people:['Angel','Murat'] },
        { track:'qa',      status:'in-progress', note:'Krish testing', week_start:1, week_end:2, people:['Krish'] },
      ],
    },
    {
      id_key: 'sol-5.8.0-ftue', game: 'sol', version: 'v5.8.0', name: 'FTUE Changes',
      subtitle: 'v5.8.0 · Apr 23', kpi_target: 'D1 retention',
      status: 'in-progress', sprint_week_start: 0, risks: [],
      tracks: [
        { track:'design',  status:'done',        note:'Spec complete',      week_start:0, week_end:1, people:['Srikanth'] },
        { track:'art',     status:'done',        note:'UI assets complete', week_start:0, week_end:1, people:['Guillem'] },
        { track:'techArt', status:'done',        note:'',                   week_start:0, week_end:1, people:['Juan S'] },
        { track:'dev',     status:'review',      note:'Ready for QA',       week_start:0, week_end:1, people:['Yevhenii','Murat'] },
        { track:'qa',      status:'in-progress', note:'Active testing',     week_start:1, week_end:2, people:['Krish','Andreu'] },
      ],
    },
    {
      id_key: 'sol-5.9.0-economy', game: 'sol', version: 'v5.9.0', name: 'Economy Revamp Phase 1',
      subtitle: 'v5.9.0 · Apr 30 — Critical path', kpi_target: 'Monetisation',
      status: 'in-progress', sprint_week_start: 1,
      risks: ['CRITICAL PATH — Coins, Store, Spin Wheel, Boosters all depend on this.'],
      tracks: [
        { track:'design',  status:'done',        note:'Critical path',                        week_start:0, week_end:1, people:['Srikanth'] },
        { track:'art',     status:'in-progress', note:'Economy UI assets',                    week_start:1, week_end:2, people:['Henrique','Guillem'] },
        { track:'techArt', status:'not-started', note:'',                                     week_start:2, week_end:3, people:['Juan S'] },
        { track:'dev',     status:'in-progress', note:'P1 — all downstream depends on this', week_start:1, week_end:2, people:['Yevhenii','Angel'] },
        { track:'qa',      status:'not-started', note:'',                                     week_start:2, week_end:3, people:['Krish'] },
      ],
    },
    {
      id_key: 'sol-6.0.0-economy-p2', game: 'sol', version: 'v6.0.0', name: 'Economy Revamp Phase 2',
      subtitle: 'v6.0.0 · May 14', kpi_target: 'Monetisation',
      status: 'planned', sprint_week_start: 3, risks: [],
      tracks: [
        { track:'design',  status:'not-started', note:'',                   week_start:3, week_end:4, people:['Srikanth'] },
        { track:'art',     status:'not-started', note:'',                   week_start:4, week_end:5, people:['Henrique','Guillem'] },
        { track:'techArt', status:'not-started', note:'',                   week_start:5, week_end:6, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'Depends on Phase 1', week_start:4, week_end:6, people:['Yevhenii','Angel'] },
        { track:'qa',      status:'not-started', note:'',                   week_start:6, week_end:7, people:['Krish'] },
      ],
    },
    {
      id_key: 'sol-6.1.0-spin-wheel', game: 'sol', version: 'v6.1.0', name: 'Win Streak — Spin Wheel',
      subtitle: 'v6.1.0 · May 28', kpi_target: 'Monetisation · Retention',
      status: 'planned', sprint_week_start: 5, risks: [],
      tracks: [
        { track:'design',  status:'not-started', note:'', week_start:5, week_end:6, people:['Srikanth'] },
        { track:'art',     status:'not-started', note:'', week_start:6, week_end:7, people:['Henrique'] },
        { track:'techArt', status:'not-started', note:'', week_start:7, week_end:8, people:['Juan S'] },
        { track:'dev',     status:'not-started', note:'', week_start:6, week_end:8, people:['Angel','Murat'] },
        { track:'qa',      status:'not-started', note:'', week_start:8, week_end:9, people:['Krish'] },
      ],
    },
  ],
}

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  const games = ['wm', 'sol']

  for (const game of games) {
    // Delete existing data for this game (cascades to sprint_tracks)
    const { error: delErr } = await sb.from('sprint_features').delete().eq('game', game)
    if (delErr) { console.error(`❌ Delete ${game}:`, delErr.message); process.exit(1) }
    console.log(`🗑  Cleared existing ${game} features`)

    for (const f of FEATURES[game]) {
      const { tracks, id_key, ...featureData } = f

      // Insert feature
      const { data: feat, error: fErr } = await sb
        .from('sprint_features')
        .insert(featureData)
        .select()
        .single()
      if (fErr) { console.error(`❌ Insert feature ${f.name}:`, fErr.message); process.exit(1) }

      // Insert tracks
      const trackRows = tracks.map(t => ({ ...t, feature_id: feat.id }))
      const { error: tErr } = await sb.from('sprint_tracks').insert(trackRows)
      if (tErr) { console.error(`❌ Insert tracks for ${f.name}:`, tErr.message); process.exit(1) }

      console.log(`✅ ${f.game.toUpperCase()} · ${f.version} · ${f.name}`)
    }
  }

  console.log('\n🎉 Seed complete! Open the Gantt tab in the dashboard.')
  process.exit(0)
}

seed()
