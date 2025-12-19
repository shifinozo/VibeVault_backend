import express from 'express'
import { adduser, loginuser } from '../Controllers/userController.js';


const userroute=express.Router()

// userroute.use((req,res,next)=>{
//     console.log("middleware is working good");
//     // console.log(req.originalUrl);
    
//     next()
// })
// ---------------------------------------------

userroute.post("/adduser",adduser)

userroute.post("/loginuser",loginuser)







export default userroute