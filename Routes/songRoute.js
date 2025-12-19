import express from 'express'
import { addsong, getAllsongs, getsongs } from '../Controllers/songController.js'
import upload from '../middleware/multer.js'


const songroute = express.Router()


songroute.post("/addsong",upload.single("file"),addsong)

songroute.get("/getsongs",getsongs)

songroute.get("/getAllsongs/:id",getAllsongs)

export default songroute