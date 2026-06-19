import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import profileRouter from './routes/profileRoute.js'
import projectRouter from './routes/projectRoute.js'
import experienceRouter from './routes/experienceRoute.js'
import skillRouter from './routes/skillRoute.js'
import achievementRouter from './routes/achievementRoute.js'
import testimonialRouter from './routes/testimonialRoute.js'
import educationRouter from './routes/educationRoute.js'
import contactRouter from './routes/contactRoute.js'
import mediaRouter from './routes/mediaRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json({ limit: '5mb' }))
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/profile', profileRouter)
app.use('/api/project', projectRouter)
app.use('/api/experience', experienceRouter)
app.use('/api/skill', skillRouter)
app.use('/api/achievement', achievementRouter)
app.use('/api/testimonial', testimonialRouter)
app.use('/api/education', educationRouter)
app.use('/api/contact', contactRouter)
app.use('/api/media', mediaRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

// On Vercel the app is imported and invoked per-request, so we must NOT call
// listen() there. Locally (no VERCEL env var) we start a normal HTTP server.
if (!process.env.VERCEL) {
    app.listen(port, () => console.log('Server started on PORT : ' + port))
}

export default app
