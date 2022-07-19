import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDay } from '../../lib/util'

import styles from './checklist.module.scss'

function Component() {
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.gridItem}>
            <h3 className={styles.gridTitle}>Checklist</h3>
            <div className={styles.checklists}>
                {user.checklist.map(checklist => <Checklist checklist={checklist} />)}
            </div>
        </div>
    )
}

function Checklist({ checklist }) {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [checked, setChecked] = useState(isChecked())
    const [lastDate, setLastDate] = useState(context.day + context.week + context.year)

    useEffect(() => {
        const date = context.day + context.week + context.year
        if (date != lastDate) {
            setLastDate(date)
            setChecked(isChecked())
            console.log('updating checked - ' + isChecked())
        }
    }, [context])

    async function updateChecked() {
        const res = await fetch("/api/user/toggleChecklist", {
            method: "POST",
            body: JSON.stringify({
                day: context.day,
                week: context.week,
                year: context.year,
                checklist: checklist.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
        setChecked(isChecked())
    }

    function isChecked() {
        const day = getDay(user, context.day, context.week, context.year)

        if (day) {
            return day.checklist.includes(checklist.id)
        }
    }

    return (
        <div key={`checklistItem-${lastDate}-${checklist.id}`} className={styles.checklist}>
            <input className={styles.checkbox} type="checkbox" defaultChecked={checked} value={checked} onClick={updateChecked} />

            <p className={styles.name}>{checklist.name}</p>
        </div>
    )
}

export default Component