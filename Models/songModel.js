import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    
    title : {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    artist: {
        type:String,
        required:true,
        lowercase:true
    },
    filePath: {
        type:String,
        required:false,
        unique:true
    },
    imagePath:{
        type:String,
        required:false,
        unique:true
    }
       
    
})
export const songModel=mongoose.model("songs",songSchema)