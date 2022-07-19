import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo } from '../../lib/util'

import styles from './timeSpent.module.scss'

function Component() {
    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                id: 1,
                label: 'This Week',
                data: getChartData()[0],
                backgroundColor: "rgba(0, 139, 255, 0.9)",
                borderColor: "rgba(0, 139, 255, 0.8)",
                pointRadius: 5,
                pointHoverRadius: 10
            },
            {
                id: 2,
                label: 'Last Week',
                data: getChartData()[1],
                pointRadius: 5,
                pointHoverRadius: 10
            },
        ]
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            y:
            {
                beginAtZero: true,
                max: 16,
                stepSize: 4
            },
        }
    }

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1 row-span-2 col-span-2">
            <h3 className="text-lg font-medium">Time Spent</h3>
            <div className={styles.chartContainer}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

function getChartData() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, false)

    const data = []
    data.push(getDailyHoursArray(user, context.week, context.year))
    data.push(getDailyHoursArray(user, lastWeek, lastYear))
    console.log(data)

    return data
}

function getDailyHoursArray(user, week, year) {
    var hours = []
    for (var i = 0; i < 7; i++) {
        var foundDay = false
        for (var day of user.days) {
            if (day.day == i && day.week == week && day.year == year) {

                foundDay = true

                var totalTime = 0
                if (day.events)
                    for (var event of day.events) {
                        totalTime += (event.quarterEnd - event.quarterStart + 1) * 15
                    }
                hours.push(Math.round(totalTime / 60 * 4) / 4)
            }
        }

        if (!foundDay) {
            hours.push(0)
        }
    }

    return hours
}

export default Component