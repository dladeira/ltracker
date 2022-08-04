import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'
import FormInput from '../../components/formInput'

import styles from './specialTasks.module.scss'
import { useAppContext } from '../../lib/context'

export function SpecialTasks() {
    const [user, setUser] = useUser({ userOnly: true })

    return (
        <div className={styles.gridItem + " " + styles.itemTasks}>
            <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                    Special Tasks
                </div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listHeader}>
                    <div style={{ width: "44%", textAlign: "left" }}>
                        NAME
                    </div>
                    <div style={{ width: "20px" }}>
                        COLOR
                    </div>
                    <div style={{width: "20px"}}>
                        PUBLIC
                    </div>
                    <div style={{height: "100%", width: "20px", marginLeft: "15px"}}>
                        
                    </div>
                </div>

                {user.getSpecialTasks().map(task => {
                    return <Task task={task} key={task.id} />
                })}
            </div>

        </div>
    )
}

function Task({ task }) {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })

    useEffect(() => {
        var newTask = user.getSpecialTask(task.id)
        task = newTask
    }, [user])

    async function saveTask() {
        var tasks = [...user.getSpecialTasks()]
        var index = tasks.findIndex(loopTask => loopTask.id == task.id)

        if (context.data[`settings.task-${task.id}.color`] && context.data[`settings.task-${task.id}.color`].value)
            tasks[index].color = context.data[`settings.task-${task.id}.color`].value

        if (context.data[`settings.task-${task.id}.public`] && context.data[`settings.task-${task.id}.public`].value)
            tasks[index].color = context.data[`settings.task-${task.id}.public`].value

        const res = await fetch(window.origin + "/api/user/setSpecialTasks", {
            body: JSON.stringify({
                specialTasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.task}>


            <FormInput width={"50%"} type="text" defaultValue={task.name} disabled={true} onSave={saveTask} contextKey={`settings.task-${task.id}.name`} />


            <FormInput width={"20px"} type="color" defaultValue={task.color ? task.color : "#E9807F"} onSave={saveTask} contextKey={`settings.task-${task.id}.color`} />


            <FormInput width={"20px"} type="public" defaultValue={task.public} onSave={saveTask} contextKey={`settings.task-${task.id}.public`} />


            <div className={styles.taskDelete} type="button" >
                
            </div>
        </div>
    )
}