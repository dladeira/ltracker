import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
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
            sleep: Number,
            events: [{
                quarterStart: Number,
                quarterEnd: Number,
                task: String,
                plan: Boolean
            }],
            checklist: Array,
            points: Array,
            text: String
        }],
        default: [],
    },
    weeklyHourGoal: {
        type: Number,
        default: 10
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
    },
    public: {
        type: Boolean,
        default: false
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema)