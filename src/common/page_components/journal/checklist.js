import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import GridItem from '../../components/gridItem'

import styles from './checklist.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastDate, setLastDate] = useState(context.day + context.week + context.year)

    useEffect(() => {
        const date = context.day + context.week + context.year
        if (date != lastDate) {
            setLastDate(date)
        }
    }, [context])

    return (
        <GridItem title="Checklist">
            <div className={styles.checklists}>
                {user.getChecklists().map(checklist => <Checklist key={`checklistItem-${lastDate}-${checklist.id}`} checklist={checklist} />)}
            </div>
        </GridItem>
    )
}

function Checklist({ checklist }) {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [checked, setChecked] = useState(isChecked())

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
        return user.getChecklistForDay(context.day, context.week, context.year).includes(checklist.id)
    }

    return (
        <div className={styles.checklist}>
            <input className={styles.checkbox} type="checkbox" defaultChecked={checked} value={checked} onClick={updateChecked} />

            <p className={styles.name}>{checklist.name}</p>
        </div>
    )
}

export default Component