import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'
import FormInput from '../../components/formInput'

import styles from './tasks.module.scss'
import { useAppContext } from '../../lib/context'

export function Tasks() {
    const [user, setUser] = useUser({ userOnly: true })

    function getSortedTasks() {
        var tasks = user.getTasks()
        return tasks.sort((a, b) => a.name.localeCompare(b.name))
    }

    async function submitNewTask(e) {
        e.preventDefault()

        var tasks = [...user.getTasks()]
        tasks.push({
            name: "---",
            id: user.generateId(),
            public: false,
            color: "#E9807F"
        })

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    // <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
    //     <h3 className="text-lg font-medium">Sleep</h3>

    return (
        <div className={styles.gridItem + " " + styles.itemTasks}>
            <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                    Tasks
                </div>
                <div className={styles.addButton} onClick={submitNewTask}>
                    +
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

                {getSortedTasks().map(task => {
                    return <Task task={task} key={task.id} />
                })}
            </div>

        </div>
    )
}

function Task({ task }) {
    const [context, setContext] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [name, setName] = useState(task.name)
    const [color, setColor] = useState(task.color)
    const [picker, setPicker] = useState(false) // Whether the color picker is open
    const [pub, setPub] = useState(task.public)
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if (!initial)
            save()
        else
            setInitial(false)
    }, [name, color, pub])

    useEffect(() => {
        var newTask = user.getTask(task.id)
        setName(newTask.name)
        setColor(newTask.color)
        setPub(newTask.public)
    }, [user])

    async function save() {
        var tasks = [...user.getTasks()]
        var index = tasks.findIndex(loopTask => loopTask.id == task.id)

        console.log(pub)

        tasks[index].name = name
        tasks[index].public = pub
        tasks[index].color = color

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function onDeletePress() {
        var tasks = [...user.getTasks()]
        tasks = tasks.filter(loopTask => task.id != loopTask.id)

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function saveTask() {
        var tasks = [...user.getTasks()]
        var index = tasks.findIndex(loopTask => loopTask.id == task.id)

        if (context.data[`settings.task-${task.id}.name`] && context.data[`settings.task-${task.id}.name`].value)
            tasks[index].name = context.data[`settings.task-${task.id}.name`].value

        if (context.data[`settings.task-${task.id}.color`] && context.data[`settings.task-${task.id}.color`].value)
            tasks[index].color = context.data[`settings.task-${task.id}.color`].value

        if (context.data[`settings.task-${task.id}.public`] && context.data[`settings.task-${task.id}.public`].value)
            tasks[index].color = context.data[`settings.task-${task.id}.public`].value

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.task}>


            <FormInput width={"50%"} type="text" defaultValue={task.name} onSave={saveTask} contextKey={`settings.task-${task.id}.name`} />


            <FormInput width={"20px"} type="color" defaultValue={task.color ? task.color : "#E9807F"} onSave={saveTask} contextKey={`settings.task-${task.id}.color`} />


            <FormInput width={"20px"} type="public" defaultValue={task.public} onSave={saveTask} contextKey={`settings.task-${task.id}.public`} />


            <div className={styles.taskDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    )
}