import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useUser } from '../../lib/hooks'

import styles from './pairedTasks.module.scss'

export function PairedTasks() {
    const [panelOpen, setPanelOpen] = useState(false)
    const [user, , updateUser] = useUser()
    const [friends, setFriends] = useState()

    useEffect(() => {
        fetch("/api/user/friends/getFriends", {
            method: "POST"
        }).then(res => res.json().then(setFriends))
    }, [])

    async function togglePanel() {
        // Update user
        await updateUser()

        setPanelOpen(!panelOpen)
    }

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-lg p-3.5 pt-1 col-span-1 row-span-1">
            <div className="relative">
                <div className={styles.settings} onClick={togglePanel}>
                    <div className={styles.settingsIcon}>
                        <Image src={"/settings-icon.svg"} height={30} width={30} />
                    </div>
                </div>
            </div>
            <h3 className="text-lg font-medium mb-7">Paired Tasks</h3>
            {panelOpen && friends ? <Panel togglePanel={togglePanel} friends={friends} /> : ""}

            {friends ? (
                <div className={styles.tasksList}>
                    {user.getAllTaskPairs().map(taskPairInfo => {
                        const peoplePairedTo = taskPairInfo.pairs.map(pair => {
                            return friends.find(friend => friend._id == pair.friend)
                        })
                        return (
                            <div className={styles.pair}>
                                <div className={styles.pairInfo}>
                                    <div className={styles.pairName}>{taskPairInfo.task.name}</div>
                                    <div className={styles.line} />
                                </div>
                                <div className={styles.icons}>{peoplePairedTo.map(friend =>
                                    <div className={styles.icon}>
                                        <Image src="/ladeira.jpg" layout="fill" />
                                    </div>
                                )}</div>
                            </div>
                        )
                    })}
                </div>
            ) : ""}
        </div>
    )
}

function Panel({ togglePanel, friends }) {
    const [user] = useUser()
    return (
        <div className={styles.panelContainer} onClick={togglePanel}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                {user.getTasks().map(task => {
                    return <Task task={task} friends={friends} />
                })}
            </div>
        </div>
    )
}

function Task({ task, friends }) {
    const [user, setUser] = useUser()
    const [panelOpen, setPanelOpen] = useState()

    async function pairTask(friend, that) {
        const res = await fetch("/api/user/friends/tasks/pairTask", {
            method: "POST",
            body: JSON.stringify({
                id: friend._id,
                this: task.id,
                that: that.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function handleUnpair(friend, that) {
        const res = await fetch("/api/user/friends/tasks/unpairTask", {
            method: "POST",
            body: JSON.stringify({
                id: friend._id,
                this: task.id,
                that: that
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.taskContainer}>
            <div className={styles.task}>
                {task.name}
                <div className={styles.taskExpand + (panelOpen ? " " + styles.taskShrink : "")} onClick={e => setPanelOpen(!panelOpen)}>{panelOpen ? "-" : "+"}</div>
            </div>




            {panelOpen ? (
                <div className={styles.users}>
                    {friends.map(friend => {
                        const taskMapped = user.getTaskPairs(task.id).find(pair => pair.friend == friend._id)
                        const taskMappedTo = taskMapped ? taskMapped.that : undefined

                        return (
                            <div className={styles.user}>
                                <div className={styles.username}>
                                    <div className={styles.icon}>
                                        <Image src="/ladeira.jpg" layout="fill" />
                                    </div>
                                    <div className={styles.usernameText}>
                                        {friend.lastName}
                                    </div>
                                </div>

                                {taskMappedTo ? (
                                    <div className={styles.userTasks}>
                                        <div className={styles.userTask}>
                                            {friend.tasks.find(task => task.id == taskMappedTo).name}
                                            <div className={styles.pairButton + " " + styles.unpairButton} onClick={handleUnpair.bind(null, friend, taskMappedTo)}>Unpair</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.userTasks}>
                                        {friend.tasks.map(loopTask => {
                                            const taskIndex = user.getAllPairs().findIndex(task => task.that == loopTask.id)
                                            console.log(loopTask.id)
                                            if (taskIndex != -1)
                                                return ""

                                            return (
                                                <div className={styles.userTask}>
                                                    <div>{loopTask.name}</div>
                                                    <div className={styles.pairButton} onClick={e => pairTask(friend, loopTask)}>Pair</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                            </div>
                        )
                    })}
                </div>
            ) : ""}
        </div>
    )
}