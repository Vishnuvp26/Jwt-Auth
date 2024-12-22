import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import routes from './router/userRoute'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    });

app.use('/', routes)

app.use(cors ({
    origin: process.env.REACT_APP_URL,
    credentials: true
}))

app.listen(process.env.PORT, () => {
    console.log('Server running');
})