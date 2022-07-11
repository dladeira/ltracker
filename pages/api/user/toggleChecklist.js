import { generateId, getDayIndex } from '../../../lib/util'
import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const dayIndex = getDayIndex(user, req.body.day, req.body.week, req.body.year)

            if (dayIndex <= -1) {
                user.days.push({
                    day: req.body.day,
                    week: req.body.week,
                    year: req.body.year,
                    events: [],
                    checklist: [
                        req.body.checklist
                    ]
                })
            } else {
                // For compatibility
                if (!user.days[dayIndex].checklist) {
                    user.days[dayIndex].checklist = [req.body.checklist]

                    // Already exists, remove it!
                } else if (user.days[dayIndex].checklist.includes(req.body.checklist)) {
                    user.days[dayIndex].checklist.splice(user.days[dayIndex].checklist.indexOf(req.body.checklist), 1)

                    // Add it
                } else {
                    user.days[dayIndex].checklist.push(req.body.checklist)
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