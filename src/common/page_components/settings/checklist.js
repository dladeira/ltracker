import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'

import styles from './checklist.module.scss'
import FormInput from '../../components/formInput'
import { useAppContext } from '../../lib/context'

export function Checklists() {
    const [user, setUser] = useUser({ userOnly: true })

    function getSortedChecklists() {
        var checklist = user.getChecklists()
        return checklist.sort((a, b) => a.name.localeCompare(b.name))
    }

    async function submitNewChecklist(e) {
        e.preventDefault()

        const res = await fetch("/api/user/checklist", {
            body: JSON.stringify({
                name: "---"
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.gridItem}>
            <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                    Checklist
                </div>
                <div className={styles.addButton} onClick={submitNewChecklist}>
                    +
                </div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listHeader}>
                    <div>
                        NAME
                    </div>
                </div>

                {getSortedChecklists().map(checklist => {
                    return <Checklist checklist={checklist} key={checklist.id} />
                })}
            </div>

        </div>
    )
}

function Checklist({ checklist }) {
    const [context, setContext] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })

    useEffect(() => {
        var newChecklist = user.getChecklist(checklist.id)
        if (newChecklist && newChecklist.name != checklist.name) {
            context[`settings.checklist.${checklist.id}.name`] = newChecklist.name
            setContext({ ...context })
        }
    }, [user])

    async function save(name) {
        const res = await fetch("/api/user/checklist", {
            body: JSON.stringify({
                id: checklist.id,
                name: name
            }),
            method: "PATCH"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function onDeletePress() {
        var checklists = [...user.getChecklists()]
        checklists = checklists.filter(loopChecklist => checklist.id != loopChecklist.id)

        const res = await fetch("/api/user/checklist", {
            body: JSON.stringify({
                id: checklist.id
            }),
            method: "DELETE"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.checklist}>
            <FormInput width={"60%"} type="text" defaultValue={checklist.name} onSave={value => { save(value) }} contextKey={`settings.checklist.${checklist.id}.name`} />
            <div className={styles.checklistDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    )
}