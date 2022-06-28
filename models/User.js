import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
})

export default mongoose.models.User || mongoose.model("User", userSchema)