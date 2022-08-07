import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { useMediaQuery } from 'react-responsive';
import GridItem from '../../components/gridItem'

import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo } from '../../lib/util'

import styles from './timeSpent.module.scss'

export function TimeSpent() {
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

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
        <GridItem colSpan="2" rowSpan="2" mRowSpan="2" title="Time Spent">
            <div className={styles.chartContainer}>
                <Line data={data} options={options} />
            </div>
        </GridItem >
    )
}

function getChartData() {
    const [context] = useAppContext()
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, -1)

    const data = []
    data.push(getDailyHoursArray(context.week, context.year))
    data.push(getDailyHoursArray(lastWeek, lastYear))

    return data
}

function getDailyHoursArray(week, year) {
    const [user] = useUser({ userOnly: true })
    var hours = []
    for (var i = 0; i < 7; i++) {
        hours.push(user.getHoursForDay(i, week, year))
    }

    return hours
}