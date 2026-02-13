import express from "express"
import dotenv from 'dotenv'
dotenv.config()

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

app.use('/pjct', userroute, songroute, playlistRoute)



app.listen(3000, () => console.log("started http://localhost:3000")
)