import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    tasks: {
        type: Array,
        default: []
    },
    checklist: {
        type: Array,
        default: []
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema)