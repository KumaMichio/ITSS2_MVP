# JobMatch JP — Project Overview

## Introduction

**JobMatch JP** is a job-matching platform for Vietnamese IT engineers seeking work in Japan. It automatically calculates a **Match Score (%)** between a user's profile and each job posting, and evaluates a **Company Trust Score** to help users make informed decisions.

## Goals

- Help Vietnamese IT engineers find suitable jobs in Japan faster
- Reduce the risk of applying to unreliable companies
- Provide transparent per-criterion match breakdowns with strengths, weaknesses, and improvement suggestions

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Lucide React |
| **State** | Zustand (with localStorage persistence) |
| **HTTP** | Axios |
| **Routing** | React Router v6 |
| **i18n** | Custom hook (`useT`) with EN / JA translations |
| **Backend** | Node.js + Express.js + TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod (backend) + inline client-side (frontend) |
| **DevOps** | Docker + Docker Compose + Nginx |

---

## System Architecture

```
Browser
  │
  ▼
[Frontend - React/Vite]   http://localhost:5173
  │  (Axios + Bearer JWT)
  ▼
[Backend - Express API]   http://localhost:3001/api
  │  (Prisma ORM)
  ▼
[PostgreSQL Database]     localhost:5433  (host port; container port 5432)
```

### Docker Compose (production-like)

```
┌─────────────────────────────────────────┐
│           Docker Network                │
│                                         │
│  [web - Nginx:80]  ──proxy──▶  [api]   │
│                                  │      │
│                              [db:5432]  │
│                                         │
│  Host port mapping:                     │
│    web  → 5173:80                       │
│    api  → 3003:3001                     │
│    db   → 5433:5432                     │
└─────────────────────────────────────────┘
```

> **Local dev:** `.env` must use `localhost:5433` (not 5432) when running the DB via Docker Compose.

---

## Directory Structure

```
ITSS2_mvp/
├── backend/
│   ├── src/
│   │   ├── index.ts               # Express entry point
│   │   ├── routes/
│   │   │   ├── auth.ts            # POST /auth/register, /auth/login
│   │   │   ├── jobs.ts            # GET /jobs (paginated), /jobs/:id/match, /jobs/:id/match-explanation
│   │   │   ├── users.ts           # GET/PUT /users/me/profile
│   │   │   ├── bookmarks.ts       # GET/POST/DELETE /bookmarks/:jobId
│   │   │   ├── applications.ts    # GET/POST/DELETE /applications/:jobId
│   │   │   └── dashboard.ts       # GET /dashboard/stats
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT middleware (authMiddleware + optionalAuth)
│   │   └── lib/
│   │       ├── prisma.ts          # Prisma singleton
│   │       └── matching.ts        # calcMatchScore, calcMatchExplanation, calcTrustScore
│   ├── prisma/
│   │   ├── schema.prisma          # DB schema (User, Profile, Company, Job, Bookmark, Application)
│   │   └── seed.ts                # 20 companies, 32 jobs, 1 demo user
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx       # Login + Register
│   │   │   ├── DashboardPage.tsx  # Home after login (top 6 matches + stats)
│   │   │   ├── JobsPage.tsx       # Job list with search, filters, pagination
│   │   │   ├── ProfilePage.tsx    # Edit CV profile (with inline validation)
│   │   │   ├── BookmarksPage.tsx  # Saved jobs
│   │   │   ├── InsightsPage.tsx   # Skill gap analysis + market intelligence
│   │   │   └── TrustPage.tsx      # Company trust score ranking
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Sidebar + main content wrapper
│   │   │   ├── Sidebar.tsx        # Navigation + language toggle (EN/JA)
│   │   │   ├── JobCard.tsx        # Job list/grid card
│   │   │   ├── JobDetailPanel.tsx # Slide-in detail panel (apply, match explanation)
│   │   │   ├── MatchCircle.tsx    # SVG match % ring
│   │   │   ├── TrustBadge.tsx     # Trust score badge
│   │   │   └── CompanyBadge.tsx   # Company logo badge
│   │   ├── store/useStore.ts      # Zustand: user, token, bookmarks, applications, lang
│   │   ├── lib/
│   │   │   ├── api.ts             # Axios instance with auth interceptor
│   │   │   ├── i18n.ts            # EN / JA translation strings
│   │   │   ├── useT.ts            # useT() hook — returns active translations
│   │   │   └── utils.ts           # formatSalary, timeAgo(lang), matchColor, trustColor
│   │   └── types/index.ts         # TypeScript interfaces
│   └── Dockerfile
│
├── docker-compose.yml
├── docs/                          # Project documentation
└── SETUP.md                       # Setup guide
```

---

## Seed Data

**20 companies / 32 jobs / 1 demo user** are seeded by `prisma/seed.ts`.

| Company | Trust Score |
|---|---|
| Toyota Motor | 100 |
| Recruit Holdings | 92 |
| Sony Corporation | 95 |
| Nintendo Co., Ltd. | 95 |
| Panasonic | 95 |
| Fujitsu Limited | 90 |
| NTT Data | 88 |
| LINE Corporation | 83 |
| CyberAgent, Inc. | 82 |
| Cybozu Inc. | 82 |
| Rakuten, Inc. | 80 |
| Money Forward | 80 |
| Mercari | 80 |
| SmartHR | 78 |
| DeNA | 75 |
| Freee K.K. | 75 |
| SoftBank | 70 |
| Cookpad | 70 |
| GREE, Inc. | 68 |
| Tech Startup XYZ | 10 |

**Demo user:** `demo@jobmatch.jp` / `demo123456`
- Skills: Java, Spring Boot, SQL, Python, Git, Linux, Docker
- JLPT: N3 | Location: Tokyo | Experience: 3 years
