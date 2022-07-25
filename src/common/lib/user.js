import { getWeeksInYear } from "./util"

export default class User {
    constructor(user) {
        this.data = user
    }

    getAccountPublic() {
        return this.data.public == true
    }

    getTaskPairs(task) {
        const pairs = []
        for (var friend of this.data.friends) {
            const pair = friend.pairedTasks.find(pair => pair.this == task)
            if (pair)
                pairs.push({
                    friend: friend.id,
                    that: pair.that
                })
        }

        return pairs
    }

    getAllTaskPairs() {
        const tasks = []
        for (var task of this.getTasks()) {
            const pairs = this.getTaskPairs(task.id)
            if (pairs.length > 0)
                tasks.push({
                    task: task,
                    pairs: pairs
                })
        }

        return tasks
    }

    getAllPairs() {
        const tasks = []
        for (var task of this.getTasks()) {
            const pairs = this.getTaskPairs(task.id)
            for (var pair of pairs) {
                tasks.push(pair)
            }
        }

        return tasks
    }

    getAllRequests() {
        if (!this.data.friendRequests)
            return []

        const requests = []
        for (var request of this.data.friendRequests) {
            requests.push(request.target)
        }

        return requests
    }

    getReceivedRequests() {
        if (!this.data.friendRequests)
            return []

        const requests = []
        for (var request of this.data.friendRequests) {
            if (!request.sent)
                requests.push(request.target)
        }

        return requests
    }

    getSentRequests() {
        if (!this.data.friendRequests)
            return []

        const requests = []
        for (var request of this.data.friendRequests) {
            if (request.sent)
                requests.push(request.target)
        }

        return requests
    }

    getFriends() {
        return this.data.friends ? this.data.friends : []
    }

    getId() {
        return this.data._id
    }

    getUsername() {
        return this.data.username ? this.data.username : this.data.lastName
    }

    getEmail() {
        return this.data.email
    }

    getDays() {
        return this.data.days
    }

    getDay(weekDay, week, year) {
        for (var day of this.data.days) {
            if (day.day == weekDay && day.week == week && day.year == year)
                return day
        }
    }

    getTextForDay(weekDay, week, year) {
        const day = this.getDay(weekDay, week, year)
        return day && day.textEntry ? day.textEntry : ""
    }

    getPointsForDay(weekDay, week, year) {
        const day = this.getDay(weekDay, week, year)
        return day && day.points ? day.points : []
    }

    getEventsForWeek(week, year) {
        var events = []

        for (var i = 0; i <= 6; i++) {
            events = events.concat(this.getEventsForDay(i, week, year))
        }

        return events
    }

    getEventsForDay(weekDay, week, year) {
        const day = this.getDay(weekDay, week, year)
        if (day) {
            return day.events
        }

        return []
    }

    getHoursForDay(weekDay, week, year, withPlan = false) {
        var totalHours = 0

        for (var task of this.getEventsForDay(weekDay, week, year).filter(e => e.plan == withPlan)) {
            totalHours += (task.quarterEnd - task.quarterStart + 1) * 0.25
        }

        return totalHours
    }

    getTaskHoursForDay(weekDay, week, year, task) {
        var totalHours = 0

        for (var task of this.getEventsForDay(weekDay, week, year).filter(e => e.task == task)) {
            totalHours += (task.quarterEnd - task.quarterStart + 1) * 0.25
        }

        return totalHours
    }

    getTaskHoursForYear(year, task) {
        var totalHours = 0

        for (var i = 1; i <= getWeeksInYear(year); i++) {
            totalHours += this.getTaskHoursForWeek(i, year, task)
        }

        return totalHours
    }

    getTaskHoursTotal(task) {
        var totalHours = 0

        for (var day of this.data.days) {
            for (var event of day.events) {
                if (event.task == task)
                    totalHours += (event.quarterEnd - event.quarterStart + 1) * 0.25
            }
        }

        return totalHours
    }

    getTaskHoursForWeek(week, year, task) {
        var totalHours = 0

        for (var i = 0; i <= 6; i++) {
            totalHours += this.getTaskHoursForDay(i, week, year, task)
        }

        return totalHours
    }

    getHoursForWeek(week, year, withPlan = false) {
        var totalHours = 0

        for (var task of this.getEventsForWeek(week, year).filter(e => e.plan == withPlan)) {
            totalHours += (task.quarterEnd - task.quarterStart + 1) * 0.25
        }

        return totalHours
    }

    getSleepForDay(weekDay, week, year) {
        const day = this.getDay(weekDay, week, year)
        return day && day.sleep ? day.sleep : 0
    }

    getSleepForWeek(week, year) {
        var totalHours = 0

        for (var i = 0; i <= 6; i++) {
            totalHours += this.getSleepForDay(i, week, year)
        }

        return totalHours
    }

    getChecklists() {
        return this.data.checklist
    }

    getChecklist(id) {
        for (var checklist of this.getChecklists()) {
            if (checklist.id == id)
                return checklist
        }
    }

    getChecklistForDay(weekDay, week, year) {
        const day = this.getDay(weekDay, week, year)
        return day && day.checklist ? day.checklist : []
    }

    getChecklistForWeek(week, year) {
        // [COMPLETE, INCOMPLETE]
        var info = [0, 0]

        for (var i = 0; i <= 6; i++) {
            const day = this.getDay(i, week, year)
            for (var checkItem of this.data.checklist) {
                if (day && day.checklist)
                    info[day.checklist.includes(checkItem.id) ? 0 : 1]++
            }
        }

        return info
    }

    getTasks() {
        return this.data.tasks
    }

    getTask(id) {
        for (var task of this.getTasks()) {
            if (task.id == id)
                return task
        }
    }

    getWeeklyHourGoal() {
        return this.data.weeklyHourGoal
    }

    getLists() {
        return this.data.lists ? this.data.lists : []
    }

    generateId() {
        mainLoop:
        while (true) {
            var result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < 64; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    characters.length));
            }

            // Check for duplicates
            for (var task of this.getTasks()) {
                if (task.id == result)
                    continue mainLoop
            }

            for (var task of this.getChecklists()) {
                if (task.id == result)
                    continue mainLoop
            }

            for (var list of this.getLists()) {
                if (list.id == result)
                    continue mainLoop
            }

            for (var day of this.getDays()) {
                for (var event of day.events) {
                    if (event.id == result)
                        continue mainLoop
                }
            }

            return result;
        }
    }
}