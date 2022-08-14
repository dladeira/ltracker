import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'

import styles from './manageFriends.module.scss'

export function ManageFriends() {
    const [panelOpen, setPanelOpen] = useState(false)
    const [users, setUsers] = useState()
    const [user, , updateUser] = useUser()

    useEffect(() => {
        fetch("/api/users", {
            method: "GET"
        }).then(res => res.json().then(setUsers))
    }, [])

    useEffect(() => {
        console.log("user changed")
    }, [user])

    async function togglePanel() {
        // Update user
        await updateUser()

        setPanelOpen(!panelOpen)
    }

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-lg p-3.5 pt-1 col-span-1 row-span-2">
            <div className="relative">
                <div className={styles.addNewItem} onClick={togglePanel}>
                    +
                </div>
            </div>
            <h3 className="text-lg font-medium">Friends</h3>
            {panelOpen && users ? <AddFriends togglePanel={togglePanel} users={users} /> : ""}

            {users ? <div className={styles.friendsList}>
                {user.getFriends().map(friend => {
                    return <Friend key={friend.id} targetUser={users.find(loopUser => loopUser.id == friend.id)} />
                })}
            </div> : ""}
        </div>
    )
}

function Friend({ targetUser }) {
    const [, setUser] = useUser()
    const [context] = useAppContext()
    const [lastMouseUp, setLastMouseUp] = useState(context.lastMouseUp)

    useEffect(() => {
        if (context.lastMouseUp != lastMouseUp) {
            setLastMouseUp(context.lastMouseUp)
            setTipOpen(false)
        }
    }, [context])

    async function removeFriend() {
        const res = await fetch('/api/user/friends', {
            method: 'DELETE',
            body: JSON.stringify({
                id: targetUser.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    function onTipClick() {
        setTipOpen(true)
        const tip = document.getElementById(`friend-${targetUser.id}-tip`)
        const top = document.getElementById(`friend-${targetUser.id}`).getBoundingClientRect().top
        const right = document.getElementById(`friend-${targetUser.id}`).getBoundingClientRect().right

        tip.style.top = top + 35 + "px"
        tip.style.left = right - 60 + "px"
    }

    function setTipOpen(open) {
        const tip = document.getElementById(`friend-${targetUser.id}-tip`)
        tip.style.display = open ? "flex" : "none"
    }

    return (
        <div id={`friend-${targetUser.id}`} className={styles.friend}>
            <div className={styles.friendImageWrapper}>
                <Image layout="fill" src={targetUser.profilePicture ? targetUser.profilePicture : "/ladeira.jpg"} />
            </div>
            <div className={styles.name}>{targetUser.username}</div>
            <div className={styles.dots} onClick={onTipClick}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
            <div id={`friend-${targetUser.id}-tip`} className={styles.tip}>
                <div className={styles.option} onClick={removeFriend}>Remove</div>
            </div>
        </div>
    )
}

function AddFriends({ users, togglePanel }) {
    const [user, setUser] = useUser({ userOnly: true })

    async function removeRequest(target) {
        const res = await fetch("/api/user/requests", {
            method: "DELETE",
            body: JSON.stringify({
                id: target
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (users ?
        (
            <div className={styles.panelContainer} onClick={togglePanel}>
                <div className={styles.panel} onClick={e => e.stopPropagation()}>
                    <div className={styles.panelHeader}>Sent requests:</div>
                    {user.getSentRequests().map(friend => {
                        const user = users.find(loopUser => loopUser.id == friend)
                        return (
                            <div key={friend} className={styles.listItem}>
                                <div className={styles.friendImageWrapper}>
                                    <Image layout="fill" src={user.profilePicture ? user.profilePicture : "/ladeira.jpg"} />
                                </div>
                                <div className={styles.name}>{user.username}</div>
                                
                                <div onClick={removeRequest.bind(null, friend)} className={styles.rejectRequest}>
                                    <span className={styles.rejectRequestText}>+</span>
                                </div>
                            </div>
                        )
                    })}
                    <div className={styles.panelHeader}>Received requests:</div>
                    {user.getReceivedRequests().map(friend => {
                        return <IncomingRequest key={friend} targetUser={users.find(loopUser => loopUser.id == friend)} />
                    })}
                    <div className={styles.panelHeader}>Available:</div>
                    {users.map(loopUser => {
                        if (user.getId() != loopUser.id && user.getFriends().findIndex(loop => loop.id == loopUser.id) == -1 && !user.getAllRequests().includes(loopUser.id))
                            return <FriendAdd key={loopUser.id} targetUser={loopUser} />
                    })}
                </div>
            </div>

        ) : (
            <div className={styles.panelContainer}>

            </div>
        )
    )
}

function IncomingRequest({ targetUser }) {
    const [, setUser] = useUser({ userOnly: true })

    async function addHandle() {
        const res = await fetch("/api/user/requests", {
            method: "POST",
            body: JSON.stringify({
                id: targetUser.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function removeRequest() {
        const res = await fetch("/api/user/requests", {
            method: "DELETE",
            body: JSON.stringify({
                id: targetUser.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.listItem}>
            <div className={styles.friendImageWrapper}>
                <Image layout="fill" src={targetUser.profilePicture ? targetUser.profilePicture : "/ladeira.jpg"} />
            </div>
            <div className={styles.name}>{targetUser.username}</div>
            <div className={styles.requests}>
                <div onClick={addHandle} className={styles.acceptRequest}>+</div>
                <div onClick={removeRequest} className={styles.rejectRequest}><span className={styles.rejectRequestText}>+</span></div>
            </div>
        </div>
    )
}


function FriendAdd({ targetUser }) {
    const [, setUser] = useUser({ userOnly: true })

    async function addHandle() {
        const res = await fetch("/api/user/requests", {
            method: "PUT",
            body: JSON.stringify({
                id: targetUser.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.listItem}>
            <div className={styles.friendImageWrapper}>
                <Image layout="fill" src={targetUser.profilePicture ? targetUser.profilePicture : "/ladeira.jpg"} />
            </div>
            <div className={styles.name}>{targetUser.username}</div>
            <div onClick={addHandle} className={styles.sendRequest}>+</div>
        </div>
    )
}