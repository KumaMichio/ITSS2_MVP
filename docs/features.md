# JobMatch JP — Implemented Features

## 1. Authentication

### Register
- Fields: email, password (min 6 chars), full name
- Zod validation (backend) + HTML5 required (frontend)
- bcryptjs password hashing (10 rounds)
- Auto-login after successful registration
- Returns JWT valid for 7 days

### Login
- Fields: email + password
- Demo credentials shown: `demo@jobmatch.jp / demo123456`
- Token saved to `localStorage` + Zustand store
- Loads bookmarks and applications in parallel on login
- Redirects to Dashboard on success

### Route Protection
- `PrivateRoute` checks token before rendering
- Axios interceptor auto-adds `Bearer token` to all requests
- On 401 → clears auth state and redirects to `/login`

---

## 2. Internationalisation (EN / JA)

- Language toggle button in sidebar: **Switch to 日本語** / **Switch to English**
- Language persists across sessions via `localStorage`
- All UI strings translated: pages, components, error messages, date labels
- `useT()` hook returns the active translation object from Zustand `lang` state
- `timeAgo()` in `utils.ts` accepts a `lang` param and returns localised relative dates (e.g. "3 weeks ago" / "3週間前")

---

## 3. Dashboard

### Smart Greeting
- "Good morning / afternoon / evening" (or おはようございます / こんにちは / こんばんは) based on hour
- Displays user's first name from Zustand store

### Stats Cards
| Card | Description |
|---|---|
| Avg. Match Score | User's average match % across all jobs |
| Verified Companies | Companies with Trust Score ≥ 70 |
| Total Jobs | Total active job listings |

### Top Matches
- Shows **top 6 jobs** sorted by Match Score descending
- 2-column grid (3-column on xl screens)
- Refresh button to reload stats
- "View all →" link to Jobs page

---

## 4. Job Listings

### Full-text Search
- Search by job title, skill, or company name
- Case-insensitive, server-side
- Fires on input change, resets to page 1

### Filter Panel (left sidebar)
| Filter | Values | Type |
|---|---|---|
| Employment | Full-time, Part-time, Contract, Remote | Checkbox (multi) |
| JLPT Level | N1, N2, N3, N4, N5 | Checkbox (multi) |
| Trust Score | 85+ Verified, 70+ Reliable, All | Radio (single) |

- "Clear filters" button when any filter is active

### Pagination
- 10 jobs per page (server-side with `skip` / `take`)
- Previous / Next buttons + up to 5 page number buttons (smart windowing)
- Filter and search changes reset to page 1
- Response: `{ data, total, page, perPage, totalPages }`

### Sorting
- **Best match:** sort by `matchScore` descending (client-side, scores returned by server via `optionalAuth`)
- **Newest:** sort by `postedAt` descending (client-side)

### Job Card
Each card shows:
- Company logo badge (coloured letter)
- Job title + company name + relative post date (localised)
- Location + employment type + salary (`¥XXXk – ¥YYYk`)
- Up to 3 required skill tags + JLPT level badge
- Trust Score badge (green / blue / grey)
- `⚠ Has risks` / `⚠ リスクあり` warning if present
- Match % ring (green ≥ 80%, amber ≥ 60%, red < 60%)
- Bookmark toggle button (optimistic UI)

---

## 5. Job Detail Panel

Slide-in panel from the right, triggered by clicking any job card.

### Apply Button
- "Apply now" → shows confirmation modal before submitting
- "Applied — Click to cancel" state with one-click unapply
- Optimistic UI: state updates immediately, rolls back on API error
- Persisted in `appliedIds` Zustand set, loaded on login

### Match Breakdown
- Total match % ring
- 4 progress bars: Skills (45%), Japanese/JLPT (30%), Location (15%), Experience (10%)
- Each bar coloured: green ≥ 80%, amber ≥ 60%, red < 60%

### Why You're a Match
- **Strengths** (green checkmarks): what the user has that matches
- **Areas to improve** (red ✕): what is missing
- **Improvement suggestions** (amber box): concrete next steps
- Required skill tags: matched skills highlighted green with ✓ prefix

### Other Sections
- Job description, required skills / JLPT / experience / education
- Benefits list (with checkmarks)
- Risk warnings (red background) if any
- Company info: size, founded, Glassdoor rating, review count, description, website link
- Bookmark toggle in header

---

## 6. CV Profile

### Basic Info
- Full name (required, inline validation)
- Current role (free text)
- Years of experience (integer ≥ 0, inline validation)
- Preferred location (dropdown: 7 Japanese cities)

### Japanese Level
- 5 toggle buttons: N1 → N5
- Single-select; click again to deselect

### Skills
- Existing skills as removable pills (× button)
- Add new skill: free text input + Enter or + button
- 12 quick-add suggestion chips (filtered to unused skills)

### Inline Validation
- Name: required — red border + error text on attempt to save empty
- Experience: must be integer ≥ 0

### Save
- Loading state while saving
- "✓ Saved!" / "✓ 保存しました！" confirmation shown for 2.5 seconds
- Backend errors shown inline

---

## 7. Bookmarks

- Bookmark icon on every `JobCard` and `JobDetailPanel` header
- Optimistic toggle: icon updates instantly, rolls back on API error
- `BookmarksPage` lists all saved jobs
- Empty state with instructions
- List syncs live: removing a bookmark from the detail panel removes it from the saved list immediately

---

## 8. Match Insights (`/insights`)

Client-side analysis of user profile vs. all jobs in the system.

- **Average match score** ring with colour coding and advice text (add skills / profile is competitive)
- **Japanese level status**: user's JLPT vs. highest market requirement, qualified / needs improvement badge
- **Skills to learn**: ranked by job market frequency, with progress bar showing demand %
- **Current skills**: user's matched skills with their market frequency count

---

## 9. Trust Scores (`/trust`)

- Ranked list of all companies by trust score
- Each row: rank, logo, name, size, founded, Glassdoor, score badge, fill bar
- Click any company to see per-criterion score breakdown (age, size, Glassdoor, reviews)
- Right panel shows rating criteria with point allocation when no company is selected

---

## 10. Matching Algorithm

See [algorithms.md](algorithms.md) for full details.

**Summary:** `total = skills×0.45 + jlpt×0.30 + location×0.15 + experience×0.10`

`calcMatchExplanation()` returns:
- `strengths`: array of `{ criterion, detail }` for satisfied criteria
- `weaknesses`: array for unmet criteria
- `suggestions`: string array of actionable advice
- `matchedSkills` / `missingSkills`: skill arrays for UI highlighting

---

## 11. Trust Score

See [algorithms.md](algorithms.md) for full details.

Calculated once at seed time from: company age, headcount, Glassdoor rating, review count, website, LinkedIn presence, risk-free status. Max 100 points.

---

## 12. Infrastructure

### Docker Compose
- 3 services: `db` (Postgres 16), `api` (Express), `web` (Nginx)
- TCP healthcheck on DB before API starts
- Persistent volume for database data
- Nginx as reverse proxy for frontend
- Port mapping: web→5173:80, api→3003:3001, db→5433:5432

### Local Dev
- Frontend: `npm run dev` → `localhost:5173`
- Backend: `npm run dev` → `localhost:3001`
- DB: `docker-compose up db -d` → `localhost:5433`
- `.env` `DATABASE_URL` must use port **5433**
