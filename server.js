import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.error('MongoDB connection error:', err))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})