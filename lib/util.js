// Dates

export function getWeekDay(date) {
    var dayNumber = date.getDay() - 1
    return dayNumber < 0 ? 6 : dayNumber
}

export function isInYear(year, week, dayIndex) {
    var firstWeekDay = getWeekDay(new Date(year, 0, 1));
    var lastWeekDay = getWeekDay(new Date(year, 11, 31))

    if ((week == 1 && dayIndex < firstWeekDay) || (week == getWeeksInYear(year) && dayIndex > lastWeekDay) || week < 1 || week > getWeeksInYear(year))
        return false
    return true
}

export function getWeeksInYear(y) {
    var d,
        isLeap

    d = new Date(y, 0, 1)
    isLeap = new Date(y, 1, 29).getMonth() === 1

    //check for a Jan 1 that's a Thursday or a leap year that has a 
    //Wednesday jan 1. Otherwise it's 52
    return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52
}

export function getDateText(day, week, year) {
    var days = 0

    days += getDaysInWeek(year, 0) > 4 ? getDaysInWeek(year, 0) - 7 : getDaysInWeek(year, 0)
    days += day + (isLeapYear(year) ? 0 : 1)
    days += (week - 1) * 7

    console.log(days)

    var date = new Date(((year - 1970) * 31556952000) + (days * 24 * 60 * 60 * 1000))
    return String(date.getDate()).padStart(2, '0') + "." + String(date.getMonth() + 1).padStart(2, '0')
}

export function getDaysInFirstWeek(year) {
    return getDaysInWeek(year, 1)
}

export function isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

export function getDaysInWeek(year, week) {
    var days = 0

    if (week == 0) {
        for (var i = 0; i < 7; i++) {
            if (!isInYear(year - 1, getWeeksInYear(year - 1), i)) {
                days++
            }
        }

        return days
    }

    for (var i = 0; i < 7; i++) {
        if (isInYear(year, week, i)) {
            days++
        } else {
            if (i >= 3) {
                return getDaysInWeek(year, week + 1) // Not the first week
            }
        }
    }
    return days
}

// Math

export function roundToFourth(number) {
    return (Math.round(number * 4) / 4).toFixed(2);
}

export function getPercentDifference(num1, num2) {
    if (num1 <= 0 && num2 <= 0) {
        return 0
    }

    if (num1 <= 0) {
        return num2 * 100
    }

    var increase = num2 - num1
    return Math.round(increase / (num1) * 100)
}

export function generateId(user) {
    mainLoop:
    while (true) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 64; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                characters.length));
        }

        if (user) {
            // Check for duplicates
            for (var i = 0; i < user.tasks; i++) {
                if (user.tasks[i].id == result)
                    continue mainLoop
            }

            for (var i = 0; i < user.categories; i++) {
                if (user.categories[i].id == result)
                    continue mainLoop
            }

            for (var i = 0; i < user.ratings; i++) {
                if (user.ratings[i].id == result)
                    continue mainLoop
            }
        }

        return result;
    }
}

// Tasks

export function getWeeklyTasks(user, currentWeek, currentYear, category) {
    var tasks = []
    for (var day of user.days) {
        if (day.week == currentWeek && day.currentYear == currentYear) {
            for (var task of day.tasks) {
                if (!category || getTask(task.taskId, user).category == category) {
                    tasks.push(task)
                }
            }
        }
    }

    return tasks
}

export function getTask(id, user) {
    for (var i = 0; i < user.tasks.length; i++) {
        if (user.tasks[i].id == id)
            return user.tasks[i]
    }
}

export function getWeeklyHours(user, currentWeek, currentYear, taskId) {
    var totalHours = 0

    for (var task of getWeeklyTasks(user, currentWeek, currentYear)) {
        if (!taskId || task.taskId == taskId)
            totalHours += task.time
    }

    return totalHours
}

// Day

export function getDay(user, day, week, year) {
    for (var selectedDay of user.days) {
        if (selectedDay.week == week && selectedDay.day == day && selectedDay.currentYear == year) {
            return selectedDay
        }
    }
}