import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    songs: [
        { type: mongoose.Schema.Types.ObjectId, ref: "songs" }
    ],
    owner: 
    { type: mongoose.Schema.Types.ObjectId, ref: "users" }

})

export const playlistModel = mongoose.model("playlist",playlistSchema)