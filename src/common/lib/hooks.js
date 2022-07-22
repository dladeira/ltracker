import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

import { useAppContext } from './context'

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null }
        })

export function useUser({ userOnly, adminOnly } = {}) {
    const [context, setContext] = useAppContext()
    const { data, error } = useSWR('/api/user', fetcher)
    const userData = data?.user
    const finished = Boolean(data)
    const loggedIn = Boolean(userData)

    useEffect(() => {
        if (!finished)
            return

        if (!context.user) {
            context.user = userData
            setContext({ ...context })
        }

        if (
            // userOnly
            (!loggedIn && userOnly) ||
            // adminOnly
            (loggedIn && !data.user.admin && adminOnly)
        ) {
            return Router.push("/api/login")
        }
    }, [finished, userOnly, adminOnly])

    if (finished || context.user) {
        if (
            // userOnly
            (!loggedIn && userOnly) ||
            // adminOnly
            (loggedIn && !data.user.admin && adminOnly)
        ) {
            Router.push("/api/login")
        }
    }

    var user = context.user ? new User(context.user) : context.user

    return error ? null : [user, e => { context.user = e; setContext({ ...context }) }]
}

class User {
    constructor(user) {
        this.data = user
    }

    getUsername() {
        return this.data.lastName
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

    getHoursForDay(weekDay, week, year) {
        var totalHours = 0

        for (var task of this.getEventsForDay(weekDay, week, year)) {
            totalHours += (task.quarterEnd - task.quarterStart + 1) * 0.25
        }

        return totalHours
    }

    getHoursForWeek(week, year) {
        var totalHours = 0

        for (var task of this.getEventsForWeek(week, year)) {
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
                if (day.checklist)
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