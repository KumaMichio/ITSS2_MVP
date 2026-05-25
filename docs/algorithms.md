# JobMatch JP — Matching & Trust Score Algorithms

**File:** `backend/src/lib/matching.ts`

---

## 1. Match Score (`calcMatchScore`)

Calculates fit between a user profile and a job posting. Returns an integer **0–100**.

### Input

| Parameter | Type | Description |
|---|---|---|
| `userSkills` | `string[]` | User's declared skills |
| `userJlpt` | `string \| null` | User's JLPT level (N1–N5) |
| `userLocation` | `string \| null` | User's preferred city |
| `userExpYears` | `number \| null` | Years of experience |
| `job.requireSkills` | `string[]` | Skills the job requires |
| `job.requireJlpt` | `string \| null` | JLPT the job requires |
| `job.requireExp` | `string \| null` | Required experience e.g. `"2+"` |
| `job.location` | `string` | Job's city |

### Formula

```
total = round(
  skills_score   × 0.45 +
  jlpt_score     × 0.30 +
  location_score × 0.15 +
  exp_score      × 0.10
)
total = clamp(total, 0, 100)
```

### Component Details

#### Skills (45%)
```
If job has no required skills → 100
Otherwise:
  matched = skills required by job that user has (case-insensitive)
  skills_score = round(matched / total_required × 100)
```
Example: job requires `[Java, Spring Boot, SQL]`, user has `[Java, SQL, Python]` → matched 2 → **67**

---

#### Japanese / JLPT (30%)
```
Rank: N1=1, N2=2, N3=3, N4=4, N5=5  (lower number = higher level)

Job has no JLPT requirement          → 100
User has JLPT declared:
  userRank <= reqRank  (meets or exceeds)  → 100
  userRank >  reqRank  (below requirement) → round(reqRank / userRank × 100)
User has no JLPT declared            → 50  (neutral default)
```
Example: user N3 (rank 3), job requires N2 (rank 2) → 3 > 2 → `round(2/3×100)` = **67**

---

#### Location (15%)
```
User has no location declared → 70  (neutral default)
User location == job location → 100 (exact match, case-insensitive)
User location ≠  job location → 60  (different city)
```

---

#### Experience (10%)
```
Job has no experience requirement → 70  (neutral default)
User has no experience declared   → 70  (neutral default)
Both present:
  reqYears = parseInt(job.requireExp)   // "2+" → 2
  userExpYears >= reqYears → 100
  userExpYears <  reqYears → round(userExpYears / reqYears × 100)
```
Example: user 1 year, job requires "2+" → `round(1/2×100)` = **50**

---

### Output

```typescript
{
  total: number,        // 0–100
  breakdown: {
    skills: number,     // 0–100
    jlpt: number,       // 0–100 (or 50 if no JLPT)
    location: number,   // 60, 70, or 100
    experience: number  // 70 or calculated
  }
}
```

---

## 2. Match Explanation (`calcMatchExplanation`)

Generates a human-readable explanation of why a user matches (or doesn't match) a job. Called by `GET /jobs/:id/match-explanation`.

### Input
Same as `calcMatchScore` plus the pre-calculated `breakdown` scores.

### Output

```typescript
{
  strengths:     Array<{ criterion: string; detail: string }>
  weaknesses:    Array<{ criterion: string; detail: string }>
  suggestions:   string[]
  matchedSkills: string[]   // skills user has that job requires
  missingSkills: string[]   // skills job requires that user lacks
}
```

### Logic

| Criterion | Strength condition | Weakness condition |
|---|---|---|
| Skills | ≥ 1 matched skill | missing skills exist |
| JLPT | score = 100 (meets requirement) | score < 100 and job has JLPT req |
| Location | exact match | different city |
| Experience | meets or exceeds requirement | below requirement |

Suggestions are generated for each weakness:
- Missing skills → "Consider adding X, Y, Z to your profile"
- JLPT gap → "Study Japanese to reach JLPT NX"
- Location mismatch → "The role is in X — update your preferred location"
- Experience gap → "This role requires N+ years of experience"

---

## 3. Trust Score (`calcTrustScore`)

Evaluates company trustworthiness. Runs **once at seed time**. Returns integer **0–100**.

### Scoring Table

| Criterion | Max | Scoring Detail |
|---|---|---|
| **Company age** | 20 | > 30 yrs: 20 \| 10–30 yrs: 15 \| 5–10 yrs: 10 \| 1–5 yrs: 5 |
| **Headcount** | 25 | >100k: 25 \| >10k: 20 \| >5k: 18 \| >1k: 15 \| else: 5 |
| **Review count** | 20 | >1000: 20 \| >100: 15 \| >10: 10 \| >0: 5 |
| **Glassdoor** | 20 | ≥ 4.0: 20 \| ≥ 3.5: 15 \| ≥ 3.0: 10 \| < 3.0: 5 |
| **Website** | 5 | Has website: +5 |
| **LinkedIn** | 5 | Has LinkedIn: +5 |
| **No risks** | 5 | `risks` array empty: +5 |
| **Total** | **100** | `min(sum, 100)` |

---

## 4. Display Colours

### Match Score
| Score | Colour | Meaning |
|---|---|---|
| ≥ 80% | Green `#16a34a` | High fit |
| 60–79% | Amber `#d97706` | Moderate fit |
| < 60% | Red `#dc2626` | Low fit |

### Trust Score
| Score | Badge colour | Icon | Label |
|---|---|---|---|
| ≥ 85 | Green | ShieldCheck | Verified |
| 70–84 | Blue | Shield | Reliable |
| < 70 | Grey | ShieldAlert | — |

---

## 5. Known Limitations

1. **No score caching** — `calcMatchScore` runs on every Dashboard load for all jobs in memory.
2. **Trust Score is static** — calculated once at seed, never auto-updated.
3. **JLPT default 50** — arbitrary neutral value when user hasn't declared a level.
4. **Exact location match only** — no "Remote" preference or proximity logic.
