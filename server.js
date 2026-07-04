import express from "express"
import dotenv from 'dotenv'
dotenv.config()

import mongoose from "mongoose"
import connectDB from "./config/dbconfig.js"
import userroute from "./Routes/userRoute.js"
import songroute from "./Routes/songRoute.js"
import playlistRoute from "./Routes/playlistRoute.js"
//-------------------------------------
import cors from "cors"


const app = express()
app.use(express.json())

app.use(cors({
    origin: ["https://vibe-vault-frontend-one.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
//-------------------------------------

connectDB()

// Without this, requests made while Mongoose isn't connected (e.g. Atlas
// blocking Vercel's IP) would hang until the query buffer/serverless
// timeout kicked in, which the browser reports as a generic Network Error.
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).send("Database unavailable. Check MongoDB Atlas Network Access allows this server's IP.")
    }
    next()
})

app.use('/pjct', userroute, songroute, playlistRoute)



app.listen(3000, () => console.log("started http://localhost:3000")
)