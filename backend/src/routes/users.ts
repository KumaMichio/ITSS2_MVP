import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware as never)

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  skills: z.array(z.string()).optional(),
  japaneseLevel: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']).nullable().optional(),
  location: z.string().nullable().optional(),
  experienceYears: z.number().int().min(0).nullable().optional(),
  currentTitle: z.string().nullable().optional(),
})

router.get('/me', async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    include: { profile: true },
  })
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  const { password: _, ...safe } = user
  res.json(safe)
})

router.put('/me/profile', async (req: AuthRequest, res) => {
  const result = profileSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() })
    return
  }

  const { name, ...profileData } = result.data

  if (name) {
    await prisma.user.update({ where: { id: req.userId! }, data: { name } })
  }

  const profile = await prisma.profile.upsert({
    where: { userId: req.userId! },
    create: { userId: req.userId!, ...profileData },
    update: profileData,
  })

  res.json(profile)
})

export default router
