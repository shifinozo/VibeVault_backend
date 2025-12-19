import express from 'express'
import { deleteplaylist, findandremoveplaylist, findandupdateplaylist, getIDplaylist, getplaylist, playlist } from '../Controllers/playlistController.js'
import Verifytoken from '../middleware/verifytoken.js'

const playlistRoute = express.Router()


playlistRoute.post("/addplaylist",Verifytoken,playlist)

playlistRoute.get("/getAllplaylist",Verifytoken,getplaylist)

playlistRoute.get("/getIDplaylist/:id",getIDplaylist)

playlistRoute.put("/findandupdateplaylist/:id/addsong/:songid",Verifytoken,findandupdateplaylist)


playlistRoute.put("/findandremoveplaylist/:id/removesong/:songid",Verifytoken,findandremoveplaylist)

playlistRoute.delete("/deleteplaylist/:id",deleteplaylist)

export default playlistRoute 