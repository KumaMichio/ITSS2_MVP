import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { calcMatchScore } from '../lib/matching'

const router = Router()
router.use(authMiddleware as never)

router.get('/stats', async (req: AuthRequest, res) => {
  const [profile, totalJobs, verifiedCompanies] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: req.userId! } }),
    prisma.job.count(),
    prisma.company.count({ where: { trustScore: { gte: 70 } } }),
  ])

  const jobs = await prisma.job.findMany({ include: { company: true } })

  const jobsWithMatch = jobs.map(job => {
    const match = calcMatchScore(
      profile?.skills ?? [],
      profile?.japaneseLevel ?? null,
      profile?.location ?? null,
      profile?.experienceYears ?? null,
      {
        requireSkills: job.requireSkills,
        requireJlpt: job.requireJlpt,
        requireExp: job.requireExp,
        location: job.location,
      }
    )
    return { ...job, matchScore: match.total }
  })

  const avgMatchScore =
    jobsWithMatch.length > 0
      ? Math.round(jobsWithMatch.reduce((s, j) => s + j.matchScore, 0) / jobsWithMatch.length)
      : 0

  const topMatches = [...jobsWithMatch]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)

  res.json({ avgMatchScore, verifiedCompanies, totalJobs, topMatches })
})

export default router
