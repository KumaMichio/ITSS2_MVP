# JobMatch JP — API Reference

Base URL: `http://localhost:3001/api`

## Authentication

Endpoints marked **🔒 Protected** require:
```
Authorization: Bearer <JWT token>
```
Tokens are valid for 7 days. Expired/invalid tokens return `401`.

Endpoints marked **🔓 Optional auth** work without a token but return richer data (e.g. `matchScore`) when authenticated.

---

## Auth

### POST /auth/register

Create a new account.

**Request:**
```json
{ "email": "user@example.com", "password": "abc123", "name": "John Doe" }
```

**Response 201:**
```json
{ "token": "<JWT>", "user": { "id": "...", "email": "...", "name": "..." } }
```

**Errors:** `400` invalid data · `409` email already registered

---

### POST /auth/login

**Request:**
```json
{ "email": "demo@jobmatch.jp", "password": "demo123456" }
```

**Response 200:**
```json
{ "token": "<JWT>", "user": { "id": "...", "email": "...", "name": "..." } }
```

**Errors:** `400` missing fields · `401` wrong credentials

---

## Jobs

### GET /jobs 🔓 Optional auth

Returns a paginated list of jobs. When authenticated, each job includes `matchScore`.

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `perPage` | number | 10 | Items per page (max 100) |
| `search` | string | — | Filter by title or company name |
| `type` | string | — | Employment type (Full-time, Part-time, Contract, Remote) |
| `jlpt` | string | — | Required JLPT level (N1–N5) |
| `trustMin` | number | — | Minimum company trust score |

**Response 200:**
```json
{
  "data": [ /* Job[] */ ],
  "total": 32,
  "page": 1,
  "perPage": 10,
  "totalPages": 4
}
```

**Job object:**
```json
{
  "id": "...",
  "title": "Backend Developer",
  "location": "Tokyo",
  "type": "Full-time",
  "salaryMin": 500000,
  "salaryMax": 800000,
  "requireSkills": ["Java", "Spring Boot"],
  "requireJlpt": "N2",
  "requireExp": "3+",
  "requireEdu": "Bachelor's or higher",
  "description": "...",
  "benefits": ["...", "..."],
  "risks": [],
  "postedAt": "2025-05-01T00:00:00.000Z",
  "matchScore": 78,
  "company": {
    "id": "...", "name": "...", "logo": "FJ", "logoColor": "#e11d48",
    "trustScore": 90, "size": ">10k", "founded": 1935,
    "glassdoor": 4.1, "reviewCount": 2100,
    "description": "...", "website": "https://...", "linkedin": "https://..."
  }
}
```

---

### GET /jobs/:id/match 🔒 Protected

Returns match score breakdown for one job vs. the authenticated user's profile.

**Response 200:**
```json
{
  "total": 78,
  "breakdown": {
    "skills": 85,
    "jlpt": 100,
    "location": 100,
    "experience": 70
  }
}
```

---

### GET /jobs/:id/match-explanation 🔒 Protected

Returns a human-readable explanation of why the user matches (or doesn't) this job.

**Response 200:**
```json
{
  "strengths": [
    { "criterion": "skills", "detail": "You have 4 of 5 required skills" },
    { "criterion": "location", "detail": "You are in Tokyo, matching the job location" }
  ],
  "weaknesses": [
    { "criterion": "jlpt", "detail": "This job requires N2; you have N3" }
  ],
  "suggestions": [
    "Study Japanese to reach JLPT N2"
  ],
  "matchedSkills": ["Java", "SQL", "Docker"],
  "missingSkills": ["Kubernetes"]
}
```

---

## Users

### GET /users/me 🔒 Protected

Returns the authenticated user with their profile.

**Response 200:**
```json
{
  "id": "...", "email": "...", "name": "...",
  "profile": {
    "currentTitle": "Backend Developer",
    "skills": ["Java", "SQL"],
    "japaneseLevel": "N3",
    "location": "Tokyo",
    "experienceYears": 3
  }
}
```

---

### PUT /users/me/profile 🔒 Protected

Create or update the user's CV profile (upsert).

**Request:**
```json
{
  "name": "John Doe",
  "currentTitle": "Backend Developer",
  "skills": ["Java", "Spring Boot", "SQL"],
  "japaneseLevel": "N2",
  "location": "Tokyo",
  "experienceYears": 3
}
```

All fields are optional (set to `null` to clear). `name` updates the `User.name` field.

**Response 200:** `{ "ok": true }`

---

## Bookmarks

### GET /bookmarks 🔒 Protected

Returns all bookmarked jobs (full job objects, no pagination).

**Response 200:** `Job[]`

---

### POST /bookmarks/:jobId 🔒 Protected

Add a job to bookmarks. Idempotent — no error if already bookmarked.

**Response 201:** `{ "ok": true }`

---

### DELETE /bookmarks/:jobId 🔒 Protected

Remove a bookmark.

**Response 204:** (no body)

---

## Applications

### GET /applications 🔒 Protected

Returns all jobs the user has applied to.

**Response 200:** `Job[]`

---

### POST /applications/:jobId 🔒 Protected

Apply to a job.

**Response 201:** `{ "ok": true }`

**Errors:** `409` already applied

---

### DELETE /applications/:jobId 🔒 Protected

Withdraw an application.

**Response 204:** (no body)

---

## Dashboard

### GET /dashboard/stats 🔒 Protected

Returns summary stats and top 6 matched jobs for the authenticated user.

**Response 200:**
```json
{
  "avgMatchScore": 54,
  "verifiedCompanies": 18,
  "totalJobs": 32,
  "topMatches": [ /* top 6 Job objects with matchScore */ ]
}
```

---

## Health

### GET /health

**Response 200:** `{ "ok": true }`
