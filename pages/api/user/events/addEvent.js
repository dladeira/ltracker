import { generateId, getDayIndex } from '../../../../lib/util'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const dayIndex = getDayIndex(user, req.body.day, req.body.week, req.body.year)

            if (req.body.firstQuarter <= req.body.lastQuarter) {
                if (dayIndex > -1) {
                    var overlaping = false
                    
                    for (var i = req.body.firstQuarter; i <= req.body.lastQuarter; i++) {
                        for (var event of user.days[dayIndex].events) {
                            if (event.quarterStart <= i && event.quarterEnd >= i) {
                                overlaping = true
                            }
                        }
                    }

                    if (!overlaping) {
                        user.days[dayIndex].events.push({
                            quarterStart: req.body.firstQuarter,
                            quarterEnd: req.body.lastQuarter,
                            task: req.body.task,
                            plan: false
                        })
                    }
                } else {
                    user.days.push({
                        day: req.body.day,
                        week: req.body.week,
                        year: req.body.year,
                        events: [{
                            quarterStart: req.body.firstQuarter,
                            quarterEnd: req.body.lastQuarter,
                            task: req.body.task,
                            plan: false
                        }]
                    })
                }
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