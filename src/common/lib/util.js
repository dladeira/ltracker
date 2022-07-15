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

export function getIncrementInfo(week, year, increment) {
    if (increment) {
        if (week + 1 > getWeeksInYear(year)) {
            return [1, year + 1]
        } else {
            return [week + 1, year]
        }
    } else {
        if (week - 1 <= 0) {
            return [1, year - 1]
        } else {
            return [week - 1, year]
        }
    }
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
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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

            for (var i = 0; i < user.checklist; i++) {
                if (user.tasks[i].id == result)
                    continue mainLoop
            }

            for (var i = 0; i < user.days; i++) {
                for (var j = 0; j < user.days[i].events.length; j++) {
                    if (user.days[j].events[i].id == result)
                        continue mainLoop
                }
            }
        }

        return result;
    }
}

// Tasks/Events/Checklist

export function getAllEventsForWeek(user, currentWeek, currentYear) {
    var events = []
    for (var day of user.days) {
        if (day.week == currentWeek && day.year == currentYear) {
            for (var event of day.events) {
                events.push(event)
            }
        }
    }

    return events
}

export function getTask(user, id) {
    for (var i = 0; i < user.tasks.length; i++) {
        if (user.tasks[i].id == id)
            return user.tasks[i]
    }
}

export function getWeeklyHoursForTask(user, currentWeek, currentYear, taskId) {
    var totalHours = 0

    for (var task of getAllEventsForWeek(user, currentWeek, currentYear)) {
        if (!taskId || task.taskId == taskId)
            totalHours += task.time
    }

    return totalHours
}

export function getWeeklyHours(user, currentWeek, currentYear) {
    var totalHours = 0

    for (var task of getAllEventsForWeek(user, currentWeek, currentYear)) {
        totalHours += (task.quarterEnd - task.quarterStart + 1) * 0.25
    }

    return totalHours
}

export function getDailyHours(user, index, currentWeek, currentYear) {
    var totalHours = 0
    const day = getDay(user, index, currentWeek, currentYear)

    if (!day)
        return 0

    for (var event of day.events) {
        totalHours += (event.quarterEnd - event.quarterStart + 1) * 0.25
    }

    return totalHours
}

export function getWeeklyChecklistInfo(user, currentWeek, currentYear) {
    const info = { complete: 0, incomplete: 0 }
    for (var weekDay = 0; weekDay <= 6; weekDay++) {
        for (var dayIndex in user.days) {
            if (user.days[dayIndex].week == currentWeek && user.days[dayIndex].year == currentYear && user.days[dayIndex].day == weekDay) {
                const day = user.days[dayIndex]
            for (var todo of user.checklist) {
                console.log("doing todo")
                info[day.checklist.includes(todo.id) ? "complete" : "incomplete"]++
            }
            }
        }
    }

    return info
}

// Day

export function getDay(user, day, week, year) {
    for (var selectedDay of user.days) {
        if (selectedDay.week == week && selectedDay.day == day && selectedDay.year == year) {
            return selectedDay
        }
    }
}

export function getDayIndex(user, day, week, year) {
    for (var selectedDayIndex in user.days) {
        const selectedDay = user.days[selectedDayIndex]
        if (selectedDay.week == week && selectedDay.day == day && selectedDay.year == year) {
            return selectedDayIndex
        }
    }

    return -1
}

// Strings

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}