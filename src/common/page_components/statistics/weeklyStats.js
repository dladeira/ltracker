import { Chart } from 'chart.js/auto';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getWeeksInYear } from '../../lib/util'

import styles from './weeklyStats.module.scss'

export function WeeklyStats() {
    const [user] = useUser({ userOnly: true })
    const [context] = useAppContext()
    const [selected, setSelected] = useState("sleep")
    const weekCount = getWeeksInYear(context.year)
    const selectOptions = ["sleep", "checklist"]


    function getWeeksThisYear() {
        const weeksInYear = []

        for (var i = 1; i <= getWeeksInYear(context.year); i++) {
            weeksInYear.push(i)
        }

        return weeksInYear
    }

    function getChartData(type) {

        var label = "ERROR"

        const data = []
        switch (type) {
            case "sleep":
                label = "Average Daily Sleep"
                for (var i = 1; i <= weekCount; i++) {
                    data.push(Math.round(user.getSleepForWeek(i, context.year) / 7 * 2) / 2)
                }
                break;
            case "checklist":
                label = "Checklist completion"
                for (var i = 1; i <= weekCount; i++) {
                    data.push(user.getChecklistForWeek(i, context.year)[0])
                }
                break;

        }

        return [
            {
                id: 1,
                label: label,
                data: data,
                backgroundColor: "rgba(0, 139, 255, 0.9)",
                borderColor: "rgba(0, 139, 255, 0.8)",
                pointRadius: 5,
                pointHoverRadius: 10
            }
        ]
    }

    function getChartOptions(type) {
        switch (type) {
            case "sleep":
                return {
                    maintainAspectRatio: false,
                    scales: {
                        y:
                        {
                            beginAtZero: true,
                            max: 14,
                            ticks: {
                                stepSize: 1
                            }
                        },
                    }
                }
            case "checklist":
                return {
                    maintainAspectRatio: false,
                    scales: {
                        y:
                        {
                            beginAtZero: true,
                            max: user.getChecklists().length * 7,
                            ticks: {
                                stepSize: 1
                            }
                        },
                    }
                }
        }
    }

    const data = {
        labels: getWeeksThisYear(),
        datasets: getChartData(selected)
    }

    return (
        <div className="h-full w-full relative bg-white rounded-lg p-3.5 pt-1 row-span-2 col-span-2">
            <h3 className="text-lg font-medium">Weekly Stats</h3>
            <div className={styles.tasks}>
                {selectOptions.map(option => {
                    return (
                        <div onClick={e => setSelected(option)} className={styles.task + " " + (selected == option ? styles.taskSelected : "")}>
                            {option}
                        </div>
                    )
                })}
            </div>
            <div className={styles.chartContainer}>
                <Line data={data} options={getChartOptions(selected)} />
            </div>
        </div>
    )
}