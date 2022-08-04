import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    // User information
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    weeklyHourGoal: {
        type: Number,
        default: 10
    },
    public: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String
    },

    // User data
    tasks: {
        type: Array,
        default: []
    },
    specialTasks: {
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
            sleep: Number,
            events: [{
                quarterStart: Number,
                quarterEnd: Number,
                eventType: String,
                task: String,
                workoutData: Object,
                plan: Boolean
            }],
            checklist: Array,
            points: Array,
            text: String
        }],
        default: [],
    },
    lists: {
        type: [{
            name: String,
            dynamic: Boolean,
            items: {
                type: [{
                    id: String,
                    name: String
                }]
            },
            id: String
        }],
        default: []
    },
    friends: {
        type: [{
            id: String,
            pairedTasks: [{
                this: String,
                that: String
            }]
        }],
        default: []
    },
    friendRequests: {
        type: [{
            target: String,
            sent: Boolean
        }],
        default: []
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema)