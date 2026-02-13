import express from 'express'
import { addsong, getAllsongs, getsongs } from '../Controllers/songController.js'
import upload from '../middleware/multer.js'


const songroute = express.Router()


// songroute.post("/addsong",upload.single("file"),addsong)
songroute.post(
  "/addsong",
  upload.fields([
    { name: "file", maxCount: 1 },   // mp3
    { name: "image", maxCount: 1 },  // image
  ]),
  addsong
);


songroute.get("/getsongs",getsongs)

songroute.get("/getAllsongs/:id",getAllsongs)

export default songroute