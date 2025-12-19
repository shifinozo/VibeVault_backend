import mongoose from "mongoose";

export default async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MDB cntd");
        
    }catch(error){
        console.log(" DB connection errrooorr",error);
        
    }
}