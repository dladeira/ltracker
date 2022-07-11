import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDay, getWeekDay } from '../../lib/util'

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
    const index = getWeekDay(new Date())
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [checked, setChecked] = useState(isChecked())

    async function updateChecked() {
        const res = await fetch("/api/user/toggleChecklist", {
            method: "POST",
            body: JSON.stringify({
                day: index,
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
        const day = getDay(user, index, context.week, context.year)

        console.log(index)

        if (day) {
            return day.checklist.includes(checklist.id)
        }
    }

    return (
        <div className={styles.checklist}>
            <input className={styles.checkbox} type="checkbox" defaultChecked={checked} value={checked} onClick={updateChecked} />

            <p className={styles.name}>{checklist.name}</p>
        </div>
    )
}

export default Component