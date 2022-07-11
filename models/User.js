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
    },
    days: {
        type: [{
            day: Number,
            week: Number,
            year: Number,
            events: [{
                quarterStart: Number,
                quarterEnd: Number,
                task: String,
                plan: Boolean
            }],
            checklist: Array
        }],
        default: []
    },
    weeklyHourGoal: {
        type: Number,
        default: 10
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema)