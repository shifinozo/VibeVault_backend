import mongoose from "mongoose";

// Fail queries immediately instead of silently queueing them for up to
// 10s while waiting on a connection that may never come (this is what
// was masquerading as a browser "Network Error" on Vercel).
mongoose.set("bufferCommands", false)

export default async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log("MDB cntd");

    }catch(error){
        console.log(" DB connection errrooorr",error);

    }
}