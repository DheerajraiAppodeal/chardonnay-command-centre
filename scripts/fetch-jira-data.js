#!/usr/bin/env node
/**
 * fetch-jira-data.js  (ES module — works with "type": "module" in package.json)
 * -------------------------------------------------------------------------------
 * Fetches live data from Jira (CHSOL + WORD) and writes src/gameData.js.
 * Called daily by GitHub Actions. Also runnable manually:
 *   JIRA_EMAIL=dheeraj.rai@appodeal.com JIRA_API_TOKEN=xxx node scripts/fetch-jira-data.js
 */

import https    from 'https';
import fs       from 'fs';
import path     from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const JIRA_HOST = 'appodeal.atlassian.net';
const EMAIL     = process.env.JIRA_EMAIL;
const TOKEN     = process.env.JIRA_API_TOKEN;

if (!EMAIL || !TOKEN) {
  console.error('❌  JIRA_EMAIL and JIRA_API_TOKEN must be set');
  process.exit(1);
}

const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');

// ── Jira REST API helper ──────────────────────────────────────────────────
function jiraGet(jql, fields, maxResults = 50) {
  return new Promise((resolve, reject) => {
    const qs = [
      `jql=${encodeURIComponent(jql)}`,
      `fields=${fields.join(',')}`,
      `maxResults=${maxResults}`,
    ].join('&');

    const options = {
      hostname: JIRA_HOST,
      path:     `/rest/api/3/search?${qs}`,
      method:   'GET',
      headers:  { Authorization: `Basic ${AUTH}`, Accept: 'application/json' },
    };

    let raw = '';
    const req = https.request(options, (res) => {
      res.on('data',  (c) => (raw += c));
      res.on('end',   () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.errorMessages?.length || parsed.errors) {
            reject(new Error(JSON.stringify(parsed)));
          } else {
            resolve(parsed);
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────
const firstName  = (name) => (name ? name.split(' ')[0] : '—');
const truncate   = (s, n) => (s ? s.substring(0, n) : '');
const ACTIVE_ST  = ['In Progress', 'Review', 'Ready for QA'];

const cleanCrash = (s) =>
  s.replace(/\[Crashlytics:[^\]]+\]\s*/gi, '')
   .replace(/([a-z])([A-Z])/g, '$1 $2')
   .trim()
   .substring(0, 55);

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔄  Fetching Jira data — ${new Date().toISOString()}\n`);

  const fields = ['summary','status','assignee','priority','labels','issuetype','updated'];

  // CHSOL: all non-Done
  const solRes = await jiraGet(
    'project = CHSOL AND status != Done ORDER BY updated DESC',
    fields, 40
  );
  console.log(`  ✓ CHSOL: ${solRes.issues?.length ?? 0} issues`);

  // WORD: updated in last 7 days
  const wordRes = await jiraGet(
    'project = WORD AND updated >= -7d ORDER BY updated DESC',
    fields, 40
  );
  console.log(`  ✓ WORD:  ${wordRes.issues?.length ?? 0} issues`);

  // ── Parse Solitaire ───────────────────────────────────────────────────
  const solActive  = [];
  const solCrashes = [];
  const highBugs   = [];

  for (const issue of solRes.issues ?? []) {
    const f        = issue.fields;
    const status   = f.status?.name ?? 'Backlog';
    const isCrash  = (f.labels ?? []).includes('Crashlytics');
    const isHigh   = f.priority?.name === 'High';
    const assignee = firstName(f.assignee?.displayName);

    if (isCrash) {
      solCrashes.push({
        id:     issue.key,
        issue:  cleanCrash(f.summary),
        device: 'Multiple',
        note:   truncate(f.summary.replace(/\[Crashlytics:[^\]]+\]/gi,'').trim(), 80),
      });
    } else {
      solActive.push({ key: issue.key, summary: truncate(f.summary, 72), assignee, status });
    }

    if (isHigh && !f.assignee) {
      highBugs.push({ key: issue.key, summary: truncate(f.summary, 72), project: 'CHSOL', status });
    }
  }

  // ── Parse Word Maker ──────────────────────────────────────────────────
  const wmActive   = [];
  const wmHighBugs = [];

  for (const issue of wordRes.issues ?? []) {
    const f        = issue.fields;
    const status   = f.status?.name ?? 'Backlog';
    const assignee = firstName(f.assignee?.displayName);
    wmActive.push({ key: issue.key, summary: truncate(f.summary, 72), assignee, status });

    if (f.priority?.name === 'High' && !f.assignee) {
      wmHighBugs.push({ key: issue.key, summary: truncate(f.summary, 72), project: 'WORD', status });
    }
  }

  const allHighBugs    = [...highBugs, ...wmHighBugs];
  const solActiveCount = solActive.filter((t) => ACTIVE_ST.includes(t.status)).length;
  const solQaCount     = solActive.filter((t) => t.status === 'Ready for QA').length;
  const wmActiveCount  = wmActive.filter((t)  => ACTIVE_ST.includes(t.status)).length;
  const wmQaCount      = wmActive.filter((t)  => t.status === 'Ready for QA').length;

  // ── Generate output ───────────────────────────────────────────────────
  const now       = new Date();
  const isoNow    = now.toISOString();
  const dateLabel = now.toLocaleDateString('en-GB', {
    weekday:'short', day:'numeric', month:'short', year:'numeric',
  });

  const output = `// ───────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Source:    Jira CHSOL + WORD (appodeal.atlassian.net)
// Generator: scripts/fetch-jira-data.js
// Refreshed: ${isoNow}
// ───────────────────────────────────────────────────────────

export const LAST_UPDATED     = "${dateLabel}";
export const LAST_UPDATED_ISO = "${isoNow}";

export const GAME_STATS = {
  wm:  { activeIssues: ${wmActiveCount}, readyForQA: ${wmQaCount}  },
  sol: { activeIssues: ${solActiveCount}, readyForQA: ${solQaCount} },
};

// High-priority unassigned bugs — surfaced in Overview
export const UNASSIGNED_HIGH_BUGS = ${JSON.stringify(allHighBugs, null, 2)};

// Solitaire active sprint tickets (non-crash, non-Done)
export const SOL_ACTIVE = ${JSON.stringify(solActive.slice(0, 12), null, 2)};

// Solitaire Crashlytics crash tickets
export const SOL_CRASHES = ${JSON.stringify(solCrashes.slice(0, 8), null, 2)};

// Word Maker recent tickets (last 7 days)
export const WM_ACTIVE = ${JSON.stringify(wmActive.slice(0, 15), null, 2)};
`;

  const outPath = path.resolve(__dirname, '..', 'src', 'gameData.js');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, 'utf8');

  console.log(`\n✅  Written → ${outPath}`);
  console.log(`    SOL: ${solActive.length} active | ${solCrashes.length} crashes | ${highBugs.length} high unassigned`);
  console.log(`    WM:  ${wmActive.length} active | ${wmQaCount} ready for QA\n`);
}

main().catch((err) => {
  console.error('\n❌  Fetch failed:', err.message ?? err);
  process.exit(1);
});
