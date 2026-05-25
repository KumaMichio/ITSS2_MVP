import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware as never)

router.get('/', async (req: AuthRequest, res) => {
  const applications = await prisma.application.findMany({
    where: { userId: req.userId! },
    include: { job: { include: { company: true } } },
    orderBy: { appliedAt: 'desc' },
  })
  res.json(applications.map(a => ({
    ...a.job,
    appliedAt: a.appliedAt,
    status: a.status,
    applicationId: a.id,
  })))
})

router.post('/:jobId', async (req: AuthRequest, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.jobId } })
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  try {
    const application = await prisma.application.create({
      data: { userId: req.userId!, jobId: req.params.jobId },
    })
    res.status(201).json(application)
  } catch {
    res.status(409).json({ error: 'Already applied' })
  }
})

router.delete('/:jobId', async (req: AuthRequest, res) => {
  await prisma.application.deleteMany({
    where: { userId: req.userId!, jobId: req.params.jobId },
  })
  res.status(204).send()
})

export default router
