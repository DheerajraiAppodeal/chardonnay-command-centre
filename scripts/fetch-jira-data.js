#!/usr/bin/env node
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

function jiraGet(jql, fields, maxResults = 50) {
  return new Promise((resolve, reject) => {
    const qs = [`jql=${encodeURIComponent(jql)}`,`fields=${fields.join(',')}`,`maxResults=${maxResults}`].join('&');
    const options = { hostname: JIRA_HOST, path: `/rest/api/3/search?${qs}`, method: 'GET', headers: { Authorization: `Basic ${AUTH}`, Accept: 'application/json' } };
    let raw = '';
    const req = https.request(options, (res) => {
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.errorMessages?.length || parsed.errors) reject(new Error(JSON.stringify(parsed)));
          else resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const firstName = (name) => (name ? name.split(' ')[0] : '—');
const truncate  = (s, n)  => (s ? s.substring(0, n) : '');
const ACTIVE_ST = ['In Progress', 'Review', 'Ready for QA'];
const cleanCrash = (s) => s.replace(/\[Crashlytics:[^\]]+\]\s*/gi, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim().substring(0, 55);

async function main() {
  console.log(`\n🔄  Fetching Jira data — ${new Date().toISOString()}\n`);
  const fields = ['summary','status','assignee','priority','labels','issuetype','updated'];
  const solRes  = await jiraGet('project = CHSOL AND status != Done ORDER BY updated DESC', fields, 40);
  console.log(`  ✓ CHSOL: ${solRes.issues?.length ?? 0} issues`);
  const wordRes = await jiraGet('project = WORD AND updated >= -7d ORDER BY updated DESC', fields, 40);
  console.log(`  ✓ WORD:  ${wordRes.issues?.length ?? 0} issues`);

  const solActive = [], solCrashes = [], highBugs = [];
  for (const issue of solRes.issues ?? []) {
    const f = issue.fields, status = f.status?.name ?? 'Backlog', assignee = firstName(f.assignee?.displayName);
    if ((f.labels ?? []).includes('Crashlytics')) {
      solCrashes.push({ id: issue.key, issue: cleanCrash(f.summary), device: 'Multiple', note: truncate(f.summary.replace(/\[Crashlytics:[^\]]+\]/gi,'').trim(), 80) });
    } else {
      solActive.push({ key: issue.key, summary: truncate(f.summary, 72), assignee, status });
    }
    if (f.priority?.name === 'High' && !f.assignee) highBugs.push({ key: issue.key, summary: truncate(f.summary, 72), project: 'CHSOL', status });
  }

  const wmActive = [], wmHighBugs = [];
  for (const issue of wordRes.issues ?? []) {
    const f = issue.fields, status = f.status?.name ?? 'Backlog', assignee = firstName(f.assignee?.displayName);
    wmActive.push({ key: issue.key, summary: truncate(f.summary, 72), assignee, status });
    if (f.priority?.name === 'High' && !f.assignee) wmHighBugs.push({ key: issue.key, summary: truncate(f.summary, 72), project: 'WORD', status });
  }

  const allHighBugs = [...highBugs, ...wmHighBugs];
  const solQaCount  = solActive.filter(t => t.status === 'Ready for QA').length;
  const wmQaCount   = wmActive.filter(t  => t.status === 'Ready for QA').length;
  const now = new Date(), isoNow = now.toISOString();
  const dateLabel = now.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });

  const output = `// AUTO-GENERATED — do not edit manually. Refreshed: ${isoNow}
export const LAST_UPDATED     = "${dateLabel}";
export const LAST_UPDATED_ISO = "${isoNow}";
export const GAME_STATS = { wm: { activeIssues: ${wmActive.filter(t=>ACTIVE_ST.includes(t.status)).length}, readyForQA: ${wmQaCount} }, sol: { activeIssues: ${solActive.filter(t=>ACTIVE_ST.includes(t.status)).length}, readyForQA: ${solQaCount} } };
export const UNASSIGNED_HIGH_BUGS = ${JSON.stringify(allHighBugs, null, 2)};
export const SOL_ACTIVE  = ${JSON.stringify(solActive.slice(0, 12), null, 2)};
export const SOL_CRASHES = ${JSON.stringify(solCrashes.slice(0, 8), null, 2)};
export const WM_ACTIVE   = ${JSON.stringify(wmActive.slice(0, 15), null, 2)};
`;

  const outPath = path.resolve(__dirname, '..', 'src', 'gameData.js');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, 'utf8');
  console.log(`\n✅  Written → ${outPath}\n`);
}

main().catch((err) => { console.error('\n❌ ', err.message ?? err); process.exit(1); });
