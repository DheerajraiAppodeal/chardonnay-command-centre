# Chardonnay Gaming — Team Context
**Last updated:** 2026-04-21
**Load this at the start of any Claude session about the team or games.**

---

## Division Overview

**Company:** Appodeal  
**Division:** Chardonnay Gaming  
**CPO:** Jordi Pulles  
**Head of Dev:** Carlos Person  
**Sr. Project Manager:** Dheeraj Rai  

**Active games:** Word Maker, Solitaire (Klondike)  
**Initiative:** MetaPlay Live Ops (not a game — infrastructure project)

---

## The Team

### Leadership
| Name | Role | Notes |
|------|------|-------|
| Jordi Pulles | CPO | Async-preferred. Fridays EOW + Mondays plan via Slack |
| Carlos Person | Head of Dev | Key contact for all dev decisions |
| Dheeraj Rai | Sr. Project Manager | Owns Jira governance, operational rhythm, resource allocation |

### Word Maker
| Name | Role | Location |
|------|------|----------|
| Didara Pernebayeva | Product Manager | Remote — Kazakhstan |
| Toni Puig | Lead Developer | Barcelona |
| Víctor Romero | Developer | Barcelona |
| Juan Sabater | Developer / TA | Barcelona |

### Solitaire
| Name | Role |
|------|------|
| Srikanth Reddy | Product Manager |
| Yevhenii Siechko | Tech Lead |
| Angel Miladinov | Developer |
| Murat Kacmaz | Developer |
| Henrique Nakajima | Artist |
| Guillem Urpí Montserrat | Artist |

### MetaPlay
| Name | Role |
|------|------|
| Giulia Galvani | PM / SPM |
| Pablo | Developer |

### Shared Resources (rotation — see Team page in dashboard)
| Name | Role | Note |
|------|------|------|
| Juan Zambrana | Technical Artist | Rotates WM ↔ Sol weekly. Bottleneck. |
| Krish Prabha | QA Lead | Rotates WM ↔ Sol weekly. Single point of failure. |
| Andreu Margarit | QA | Supports overflow |

---

## Games Status

### Word Maker
- **Platform:** Android (live)
- **Q2 OKR:** ≥20% relative D3 retention uplift vs v1.45.0
- **Baseline D3:** 11.1% (Mar 30–Apr 5, locked)
- **Current sprint:** 1.47.0 — Beginner's Bonus
- **Live build:** 1.46.0 @ 10% Android rollout
- **Store rating:** 3.9/5 (↓ from 4.3 — store issues active)
- **Jira project:** `WORD`

### Solitaire (Klondike)
- **Platform:** Android
- **Firebase project:** `klondike-solitaire-46f14`
- **Versions active:** v4.3.4 (139K users — legacy), v5.6.0, v5.7.0 (latest)
- **Crash-free rate:** 99.55% (Apr 10–17, all versions)
- **Current sprint:** 5.7.x features — Level Up Screen, Results Screen, Coins meta
- **Jira project:** `CHSOL` (Board 1860)

---

## Key Slack Channels

| Channel | Purpose |
|---------|---------|
| #chardonnay-product | Main product channel — Jordi, all PMs, Dheeraj |
| #chardonnay-general | General team channel |
| #ch-wordmaker-main | Word Maker team + Darya store review bot |
| #chardonnay_tech | Technical discussions |

---

## AI Initiatives Running

| Initiative | Owner | Status |
|-----------|-------|--------|
| Claude Crash Analysis Bot | Carlos / Yevhenii | Live — auto-generates CHSOL crash tickets from Crashlytics |
| Darya Review Bot | Darya Ashurkevich | Live — weekly store review summaries to #ch-wordmaker-main |
| Command Centre Dashboard | Dheeraj | Live — chardonnay-command-centre.vercel.app |
| Daily Jira Refresh | GitHub Actions | Live — 8am Madrid, Mon–Fri |
| ALT Tester Automation | Krish Prabha | In progress |
| Remote Config AI Tool | Giulia | In progress |

---

## Important Operational Rules

1. **Conservative data sharing:** Never share AI impact results until 4+ weeks of stable data
2. **Shared resource priority:** Juan + Krish rotate weekly. Override only for Critical/High blockers — PM coordinates with Dheeraj first
3. **QA gate:** Nothing ships without Krish sign-off on Ready for QA tickets
4. **Jira owner:** Dheeraj owns all Jira governance — raise structure questions with him, not directly with devs
5. **Retention benchmark note:** Word Maker D7 hard gate is **15%** (not 10% — override confirmed)
