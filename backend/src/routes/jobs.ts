import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { calcMatchScore } from '../lib/matching'

const router = Router()

router.get('/', async (req, res) => {
  const { skills, jlpt, location, type, search, trustMin } = req.query

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

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { postedAt: 'desc' },
    include: { company: true },
  })

  res.json(jobs)
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

export default router
