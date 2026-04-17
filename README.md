# Chardonnay Gaming Command Centre

Operational intelligence dashboard for the Chardonnay Gaming division at Appodeal.

## Stack

- React 19 + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Lucide React (icons)
- No backend — mock data in `src/data/mockData.js`

## Run locally

```bash
cd command-centre
npm install
npm run dev
# → http://localhost:5173
```

## Build for production

```bash
npm run build
# Output: dist/
```

## Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. No env vars required (all data is mock or MCP-sourced client-side)

Or drag-and-drop the `dist/` folder at netlify.com/drop.

## Pages

| Route | Page | Audience |
|-------|------|----------|
| `/` | Overview | Jordi → Ana briefings |
| `/operations` | Operations | Dheeraj, Carlos, PMs |
| `/release` | Release Train | Everyone |
| `/team` | Team | Team reference |
| `/ai` | AI Impact | Dheeraj only (PIN: see BUILD-LOG) |

## Connecting live data

See `BUILD-LOG.md` for what needs connecting and how.
Key: update `src/data/mockData.js` arrays as Jira/Grafana come online.

## Editable fields

- **Overview**: stat cards, game one-liners (click pencil icon)
- **Team**: sprint focus per person (click "edit")
- **Operations**: resource allocation notes
- **AI Impact**: baseline values (lock once set), initiatives log (add button)
