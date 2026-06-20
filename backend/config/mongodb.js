import mongoose from "mongoose";

let listenersAttached = false

const attachConnectionListeners = () => {
    if (listenersAttached) return
    listenersAttached = true

    mongoose.connection.on("connected", () => {
        console.log("DB Connected")
    })

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err?.message || err)
    })
}

const connectDB = async () => {
    attachConnectionListeners()

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
        console.error("MONGODB_URI is not set. Skipping database connection.")
        return false
    }

    try {
        await mongoose.connect(`${mongoUri}/portfolio`)
        return true
    } catch (error) {
        console.error("MongoDB initial connection failed:", error?.message || error)
        return false
    }

}

export default connectDB;
