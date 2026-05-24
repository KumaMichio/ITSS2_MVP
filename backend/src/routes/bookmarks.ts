import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware as never)

router.get('/', async (req: AuthRequest, res) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: req.userId! },
    include: { job: { include: { company: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(bookmarks.map(b => b.job))
})

router.post('/:jobId', async (req: AuthRequest, res) => {
  try {
    const bookmark = await prisma.bookmark.create({
      data: { userId: req.userId!, jobId: req.params.jobId },
    })
    res.status(201).json(bookmark)
  } catch {
    res.status(409).json({ error: 'Already bookmarked' })
  }
})

router.delete('/:jobId', async (req: AuthRequest, res) => {
  await prisma.bookmark.deleteMany({
    where: { userId: req.userId!, jobId: req.params.jobId },
  })
  res.status(204).send()
})

export default router
