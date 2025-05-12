import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from './routes/googleAuth.js'
import { initializeDatabase } from "./db.connect/db.connect.js"
import cookieParser from "cookie-parser"
import imageRoutes from './routes/image.routes.js'

const app = express()
dotenv.config()

initializeDatabase()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}))

app.use('/auth', authRoutes)
app.use('/api', imageRoutes)

app.listen(PORT, () => {
    console.log("Server is running on PORT",PORT)
})