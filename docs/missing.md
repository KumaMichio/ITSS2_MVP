# JobMatch JP — Known Gaps & Remaining Work

## Previously Missing → Now Implemented ✅

| Feature | Status |
|---|---|
| Bookmark UI (icon on cards, saved jobs page) | ✅ Done |
| Match Insights page (`/insights`) | ✅ Done |
| Trust Scores page (`/trust`) | ✅ Done |
| Apply button + POST /applications | ✅ Done |
| Pagination for GET /jobs | ✅ Done |
| Match explanation ("Why you're a match") | ✅ Done |
| Inline validation on Profile form | ✅ Done |
| Expanded mock data (20 companies, 32 jobs) | ✅ Done |
| EN / JA language toggle | ✅ Done |

---

## 1. Technical Issues

### Docker: API cannot reach database (`P1001`)
- **Symptom:** `api` container reports `Can't reach database server at db:5432` even when `db` is healthy.
- **Root cause:** PostgreSQL healthcheck passes via Unix socket before TCP is ready for cross-container connections.
- **Workaround for local dev:** Run only `docker-compose up db -d` and set `DATABASE_URL=postgresql://...@localhost:5433/jobmatch` in `.env`. Run backend with `npm run dev`.
- **Still needs:** Fix `api` container startup so it reliably waits for TCP readiness before connecting.

---

## 2. Logic Gaps

### Match Score not cached
- `GET /dashboard/stats` recalculates `calcMatchScore()` for every job on every request.
- Will become a performance issue as the job count grows.
- **Suggested fix:** Cache scores in Redis or store them per-user in a DB column.

### Location matching is exact string only
- A user selecting "Tokyo" won't match a job listed as "Tokyo (Remote OK)".
- No support for "Remote" preference matching across all locations.

### JLPT default score of 50
- Users without a declared JLPT level receive 50/100 for the JLPT criterion.
- This is an arbitrary value — could mislead users about their actual suitability.

### Trust Score is static
- Calculated once at seed time, never recalculated automatically.
- Consider a scheduled job or recalculating on company data update.

---

## 3. Features Not Yet Built

| Feature | Description |
|---|---|
| **Settings page** (`/settings`) | Route exists, renders `PlaceholderPage`. Should support password change, account info. |
| **Email verification** | No verify-email step on registration |
| **Password reset** | No forgot-password flow |
| **Application status tracking** | Apply records exist but no status (pending / interview / rejected) |
| **Admin panel** | No UI for managing jobs/companies |
| **Notifications** | No push/email alert when a new matching job appears |
| **CV file upload** | Skills entered manually; no PDF/Word parsing |
| **Dark mode** | CSS variables are ready but no toggle exists |
| **Mobile responsive** | Fixed sidebar doesn't work well on small screens |
| **Infinite scroll** | Pagination exists but infinite scroll would improve UX on mobile |

---

## 4. Data Quality

### Seed data is still mock
- All 32 jobs and 20 companies are seeded fixtures, not real listings.
- Job descriptions, benefits, and risks are placeholder text.

### Benefits and risks text is in English only
- The app UI supports EN/JA switching, but job `description`, `benefits`, and `risks` fields stored in the DB are always in English (from seed).
- No per-language content fields in the schema.
