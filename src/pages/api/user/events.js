import { getDayIndex } from '../../../common/lib/util'
import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            var dayIndex = getDayIndex(user, req.body.day, req.body.week, req.body.year)

            if (dayIndex == -1) {
                var day = {
                    day: req.body.day,
                    week: req.body.week,
                    year: req.body.year,
                    events: [],
                    checklist: []
                }
                user.days.push(day)
                dayIndex = user.days.length - 1
            }

            var day = user.days[dayIndex]

            switch (req.method) {
                case "POST":
                    if (!isQuarterValid(day.events, req.body.quarterStart, req.body.quarterEnd))
                        return res.status(400).json(user)

                    day.events.push({
                        quarterStart: req.body.quarterStart,
                        quarterEnd: req.body.quarterEnd,
                        task: req.body.task,
                        plan: false,
                        eventType: req.body.eventType,
                    })
                    break;
                case "PATCH":
                    var event = day.events.find(event => event._id == req.body.id)

                    if (!event)
                        return res.status(404).json(user)

                    if (!isQuarterValid(day.events, req.body.quarterStart, req.body.quarterEnd, event._id))
                        return res.status(400).json(user)

                    event.task = req.body.task ? req.body.task : event.task
                    event.eventType = req.body.eventType ? req.body.eventType : event.eventType
                    event.plan = req.body.plan !== undefined ? req.body.plan : event.plan
                    event.workoutData = req.body.workoutData !== undefined ? req.body.workoutData : event.workoutData

                    event.quarterStart = req.body.quarterStart && event.quarterEnd >= req.body.quarterStart ? req.body.quarterStart : event.quarterStart
                    event.quarterEnd = req.body.quarterEnd && event.quarterStart <= req.body.quarterEnd ? req.body.quarterEnd : event.quarterEnd

                    break;
                case "DELETE":
                    day.events = day.events.filter(event => event._id != req.body.id)
                    break;
            }

            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

function isQuarterValid(events, quarterStart, quarterEnd, ignoreEvent) {
    if (quarterStart > quarterEnd)
        return false

    if (quarterEnd > 96 || quarterEnd < 0 || quarterStart > 96 || quarterStart < 0)
        return false

    for (var i = quarterStart; i <= quarterEnd; i++) {
        for (var event of events) {
            if (event.quarterStart <= i && event.quarterEnd >= i && event._id != ignoreEvent) {
                return false // Overlapping
            }
        }
    }

    return true
}

export default Route