import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import jobRoutes from './routes/jobs'
import userRoutes from './routes/users'
import bookmarkRoutes from './routes/bookmarks'
import dashboardRoutes from './routes/dashboard'
import applicationRoutes from './routes/applications'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/applications', applicationRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

export default app

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
