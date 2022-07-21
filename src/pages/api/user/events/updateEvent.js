import { getDayIndex } from '../../../../common/lib/util'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const dayIndex = getDayIndex(user, req.body.day, req.body.week, req.body.year)

            if (dayIndex > -1) {
                const event = user.days[dayIndex].events.find(event => event.quarterStart == req.body.firstQuarter && event.quarterEnd == req.body.lastQuarter)

                event.task = req.body.task ? req.body.task : event.task
                event.plan = req.body.plan !== undefined ? req.body.plan : event.plan

                event.quarterStart = req.body.quarterStart && event.quarterEnd >= req.body.quarterStart ? req.body.quarterStart : event.quarterStart
                event.quarterEnd = req.body.quarterEnd && event.quarterStart <= req.body.quarterEnd ? req.body.quarterEnd : event.quarterEnd

                if (event.quarterEnd > 96 || event.quarterEnd < 0 || event.quarterStart > 96 || event.quarterStart < 0)
                    return res.status(400).send("Quarter outside of restrictions")

                for (var i = event.quarterStart; i < event.quarterEnd; i++) {
                    const foundEvent = user.days[dayIndex].events.find(loopEvent => loopEvent.quarterStart - 2 < i && loopEvent.quarterEnd + 1 > i && loopEvent._id != event._id)
                    if (foundEvent != null)
                        return res.status(400).send("Invalid event update! Overlapping!")
                }
            } else {
                return res.status(404).end('Event/day not found')
            }

            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route