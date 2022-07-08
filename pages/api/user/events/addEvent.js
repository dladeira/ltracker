import { getDayIndex } from '../../../../lib/util'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const dayIndex = getDayIndex(user, req.body.day, req.body.week, req.body.year)

            if (dayIndex > -1) {
                user.days[dayIndex].events.push({
                    quarterStart: req.body.firstQuarter,
                    quarterEnd: req.body.lastQuarter,
                    task: req.body.task
                })
            } else {
                user.days.push({
                    day: req.body.day,
                    week: req.body.week,
                    year: req.body.year,
                    events: [{
                        quarterStart: req.body.firstQuarter,
                        quarterEnd: req.body.lastQuarter,
                        task: req.body.task
                    }]
                })
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