import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth'
import { calcMatchScore, calcMatchExplanation } from '../lib/matching'

const router = Router()

router.get('/', optionalAuth as never, async (req: AuthRequest, res) => {
  const { skills, jlpt, location, type, search, trustMin, page, perPage } = req.query

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { company: { name: { contains: String(search), mode: 'insensitive' } } },
    ]
  }
  if (location) where.location = { equals: String(location), mode: 'insensitive' }
  if (type) where.type = String(type)
  if (jlpt) where.requireJlpt = String(jlpt)
  if (skills) {
    where.requireSkills = { hasSome: String(skills).split(',') }
  }
  if (trustMin) {
    where.company = { trustScore: { gte: Number(trustMin) } }
  }

  const pageNum = Math.max(1, parseInt(String(page ?? '1')) || 1)
  const perPageNum = Math.min(50, Math.max(1, parseInt(String(perPage ?? '10')) || 10))
  const skip = (pageNum - 1) * perPageNum

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      include: { company: true },
      skip,
      take: perPageNum,
    }),
  ])

  let data: typeof jobs | (typeof jobs[0] & { matchScore: number })[] = jobs

  if (req.userId) {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } })
    data = jobs.map(job => ({
      ...job,
      matchScore: calcMatchScore(
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
      ).total,
    }))
  }

  res.json({
    data,
    total,
    page: pageNum,
    perPage: perPageNum,
    totalPages: Math.ceil(total / perPageNum),
  })
})

router.get('/:id', async (req, res) => {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id },
    include: { company: true },
  })
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  res.json(job)
})

router.get('/:id/match', authMiddleware as never, async (req: AuthRequest, res) => {
  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: req.params.id } }),
    prisma.profile.findUnique({ where: { userId: req.userId! } }),
  ])

  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }

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

  res.json(match)
})

router.get('/:id/match-explanation', authMiddleware as never, async (req: AuthRequest, res) => {
  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id: req.params.id } }),
    prisma.profile.findUnique({ where: { userId: req.userId! } }),
  ])

  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }

  const explanation = calcMatchExplanation(
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

  res.json(explanation)
})

export default router
