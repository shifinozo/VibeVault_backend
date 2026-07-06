import mongoose from "mongoose";

// Fail queries immediately instead of silently queueing them for up to
// 10s while waiting on a connection that may never come (this is what
// was masquerading as a browser "Network Error" on Vercel).
mongoose.set("bufferCommands", false)

// Cached across warm serverless invocations so repeat requests reuse the
// same connection attempt instead of racing a fresh one on every call.
let connectionPromise = null;

export default function connectDB(){
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        }).then(() => {
            console.log("MDB cntd");
        }).catch((error) => {
            // Let the next request retry instead of being stuck on a
            // rejected promise forever (e.g. transient Atlas blip).
            connectionPromise = null;
            console.log(" DB connection errrooorr", error);
            throw error;
        })
    }
    return connectionPromise;
}