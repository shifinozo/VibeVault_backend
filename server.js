import express from "express"
import dotenv from 'dotenv'
import connectDB from "./config/dbconfig.js"
import userroute from "./Routes/userRoute.js"
import songroute from "./Routes/songRoute.js"
import playlistRoute from "./Routes/playlistRoute.js"
//-------------------------------------
import cors from "cors"


const app=express()
app.use(express.json())
app.use(cors())
//-------------------------------------

dotenv.config()

connectDB()

app.use('/pjct',userroute,songroute,playlistRoute) 



app.listen(3000,()=> console.log("started http://localhost:3000")
)