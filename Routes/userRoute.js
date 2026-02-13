import express from 'express'
import { adduser, loginuser, verifyOTP } from '../Controllers/userController.js';

const userroute = express.Router()

userroute.post("/adduser", adduser)
userroute.post("/loginuser", loginuser)
userroute.post("/verify-otp", verifyOTP)

export default userroute