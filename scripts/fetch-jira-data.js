#!/usr/bin/env node
// ── fetch-jira-data.js ────────────────────────────────────────────────────
// Runs daily via GitHub Actions (Mon–Fri 06:00 UTC = 08:00 Madrid)
// Fetches live Jira data → writes src/gameData.js
//
// Required env vars:
//   JIRA_EMAIL      — your Atlassian account email
//   JIRA_API_TOKEN  — from https://id.atlassian.com/manage-profile/security/api-tokens
// ─────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JIRA_BASE  = 'https://appodeal.atlassian.net';
const EMAIL      = process.env.JIRA_EMAIL;
const TOKEN      = process.env.JIRA_API_TOKEN;

if (!EMAIL || !TOKEN) {
  console.error('❌  Set JIRA_EMAIL and JIRA_API_TOKEN environment variables.');
  process.exit(1);
}

const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');

async function jql(query, fields = ['summary','status','assignee','priority','issuetype','fixVersions','labels'], maxResults = 100) {
  const params = new URLSearchParams({
    jql: query,
    maxResults,
    fields: fields.join(','),
  });
  const res = await fetch(`${JIRA_BASE}/rest/api/3/search/jql?${params}`, {
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.issues || [];
}

function pickAssignee(issue) {
  const name = issue.fields?.assignee?.displayName || '';
  if (!name) return 'Unassigned';
  // Shorten to first name only
  return name.split(' ')[0];
}

function pickStatus(issue) {
  return issue.fields?.status?.name || 'Unknown';
}

function isHighPriority(issue) {
  const p = issue.fields?.priority?.name || '';
  return ['Highest','High','Critical','Blocker','P0','P1'].includes(p);
}

async function main() {
  console.log('🔄  Fetching Jira data...');

  const now = new Date();

  // ── WORD MAKER ──────────────────────────────────────────────────────────
  console.log('  📱 Word Maker (WORD)...');

  const wmActive = await jql(
    'project = WORD AND status not in (Done, Released, Closed) AND updated >= -30d ORDER BY updated DESC',
    ['summary','status','assignee','priority','issuetype'],
    50
  );

  const wmReadyForQA = await jql(
    'project = WORD AND status in ("Ready for QA", "QA", "Ready for Testing") ORDER BY updated DESC',
    ['summary','status','assignee'],
    50
  );

  const wmBugs = await jql(
    'project = WORD AND issuetype = Bug AND status not in (Done, Closed) ORDER BY priority ASC, updated DESC',
    ['summary','status','assignee','priority'],
    20
  );

  // ── SOLITAIRE ───────────────────────────────────────────────────────────
  console.log('  🃏 Solitaire (CHSOL)...');

  const solActive = await jql(
    'project = CHSOL AND status not in (Done, Released, Closed) AND updated >= -30d ORDER BY updated DESC',
    ['summary','status','assignee','priority','issuetype'],
    50
  );

  const solReadyForQA = await jql(
    'project = CHSOL AND status in ("Ready for QA", "QA", "Ready for Testing") ORDER BY updated DESC',
    ['summary','status','assignee'],
    50
  );

  const solBugs = await jql(
    'project = CHSOL AND issuetype = Bug AND status not in (Done, Closed) ORDER BY priority ASC, updated DESC',
    ['summary','status','assignee','priority'],
    20
  );

  // ── UNASSIGNED HIGH PRIORITY BUGS ───────────────────────────────────────
  const allBugs = [...wmBugs, ...solBugs];
  const unassignedHigh = allBugs
    .filter(i => !i.fields?.assignee && isHighPriority(i))
    .map(i => ({
      key: i.key,
      summary: i.fields.summary,
      project: i.key.startsWith('WORD') ? 'WORD' : 'CHSOL',
      status: pickStatus(i),
    }));

  // ── FORMAT ACTIVE ISSUES ─────────────────────────────────────────────────
  function formatIssues(issues) {
    return issues.slice(0, 30).map(i => ({
      key: i.key,
      summary: i.fields.summary,
      assignee: pickAssignee(i),
      status: pickStatus(i),
    }));
  }

  const stats = {
    wm:  { activeIssues: wmActive.length,  readyForQA: wmReadyForQA.length  },
    sol: { activeIssues: solActive.length, readyForQA: solReadyForQA.length },
  };

  // ── WRITE gameData.js ────────────────────────────────────────────────────
  const dateStr  = now.toUTCString().replace(/GMT.*/, '').trim();
  const isoStr   = now.toISOString();

  const output = `// AUTO-GENERATED — do not edit manually. Refreshed: ${isoStr}
export const LAST_UPDATED     = "${dateStr}";
export const LAST_UPDATED_ISO = "${isoStr}";
export const GAME_STATS = ${JSON.stringify(stats)};
export const UNASSIGNED_HIGH_BUGS = ${JSON.stringify(unassignedHigh, null, 2)};
export const SOL_ACTIVE  = ${JSON.stringify(formatIssues(solActive), null, 2)};
export const SOL_CRASHES = [];
export const WM_ACTIVE   = ${JSON.stringify(formatIssues(wmActive), null, 2)};
`;

  const outPath = path.join(__dirname, '..', 'src', 'gameData.js');
  fs.writeFileSync(outPath, output, 'utf8');

  console.log(`\n✅  gameData.js updated:`);
  console.log(`    WM  active: ${stats.wm.activeIssues}  |  ready for QA: ${stats.wm.readyForQA}`);
  console.log(`    Sol active: ${stats.sol.activeIssues}  |  ready for QA: ${stats.sol.readyForQA}`);
  console.log(`    Unassigned high bugs: ${unassignedHigh.length}`);
  console.log(`    Written to: ${outPath}`);
}

main().catch(e => {
  console.error('❌ ', e.message);
  process.exit(1);
});
