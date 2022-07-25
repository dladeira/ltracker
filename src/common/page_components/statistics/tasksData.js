import { useAppContext } from "../../lib/context"
import { useUser } from "../../lib/hooks"
import { getPastDays, getPercentDifference } from "../../lib/util"

import styles from './tasksData.module.scss'

export function TasksData() {
    const [user] = useUser({ userOnly: true })

    function getSortedTasks() {
        var tasks = user.getTasks().sort((a, b) => user.getTaskHoursTotal(a.id) < user.getTaskHoursTotal(b.id))
        return tasks
    }

    return (
        <div className="flex flex-col h-full relative bg-white rounded-lg p-3.5 pt-1 row-span-2 col-span-2">
            <h3 className="text-lg font-medium mb-">Tasks Data</h3>
            <div className={styles.header}>
                <div className={styles.headerName}>name</div>
                <div className={styles.headerTotal}>total</div>
                <div className={styles.headerWeek}>this week</div>
                <div className={styles.header7d}>trend (7d)</div>
                <div className={styles.header4w}>trend (1m)</div>
            </div>
            <div className={styles.tasks}>
                {getSortedTasks().map(task => <Task task={task} />)}
            </div>
        </div>
    )
}

function Task({ task }) {
    const [user] = useUser({ userOnly: true })
    const [context] = useAppContext()


    function getHoursOverDays(days, daysToSkip = 0) {
        var hours = 0
        var skipsLeft = daysToSkip

        if (skipsLeft-- <= 0)
            hours += user.getTaskHoursForDay(context.day, context.week, context.year, task.id)

        getPastDays(context.day, context.week, context.year, days + daysToSkip - 1).map(day => {
            if (skipsLeft-- <= 0) {
                hours += user.getTaskHoursForDay(day.weekDay, day.week, day.year, task.id)
            }
        })

        return hours
    }

    const thisWeek = user.getTaskHoursForWeek(context.week, context.year, task.id)
    const total = user.getTaskHoursTotal(task.id)
    const task7d = getPercentDifference(getHoursOverDays(7, 7), getHoursOverDays(7, 0))
    const task4w = getPercentDifference(getHoursOverDays(28, 28), getHoursOverDays(28, 0))

    return (
        <div className={styles.task}>
            <div className={styles.taskName}>{task.name}</div>
            <div className={styles.taskTotal}>{total}h</div>
            <div className={styles.taskWeek}>{thisWeek}h</div>
            <div className={styles.task7d + " " + (task7d > 0 ? styles.positive : task7d < 0 ? styles.negative : "")}>{task7d}%</div>
            <div className={styles.task4w + " " + (task4w > 0 ? styles.positive : task4w < 0 ? styles.negative : "")}>{task4w}%</div>
        </div>
    )
}