import express from 'express'
import { addsong, getAllsongs, getsongs, getUploadSignature } from '../Controllers/songController.js'


const songroute = express.Router()

// Frontend uploads the audio/image directly to Cloudinary using this
// signature, then calls addsong with just the resulting URLs — the file
// itself never passes through this backend (Vercel caps request bodies at
// ~4.5MB, well under a typical mp3).
songroute.post("/getUploadSignature", getUploadSignature)

songroute.post("/addsong", addsong);


songroute.get("/getsongs",getsongs)

songroute.get("/getAllsongs/:id",getAllsongs)

export default songroute