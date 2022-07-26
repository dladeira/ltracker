import { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'


import styles from './general.module.scss'
import FormInput from '../../components/formInput'
import { useAppContext } from '../../lib/context'

export function General() {
    const [user] = useUser({ userOnly: true })
    const [context, setContext] = useAppContext()

    async function saveUsername(value) {
        const res = await fetch(window.origin + "/api/user/setUsername", {
            body: JSON.stringify({
                username: value
            }),
            method: "POST"
        })
        const newUser = await res.json()
        context.data["settings.username"].value = newUser.username
        context.user = newUser
        setContext({ ...context })
    }

    async function saveAccountPublic(value) {
        const res = await fetch(window.origin + "/api/user/setAccountPublic", {
            body: JSON.stringify({
                public: value
            }),
            method: "POST"
        })
        const newUser = await res.json()
        context.data["settings.accountPublic"].value = newUser.public == true
        context.user = newUser
        setContext({ ...context })
    }

    async function saveWeeklyHourGoal(value) {
        const res = await fetch(window.origin + "/api/user/setWeeklyHourGoal", {
            body: JSON.stringify({
                goal: value
            }),
            method: "POST"
        })
        const newUser = await res.json()
        context.data["settings.weeklyHourGoal"].value = newUser.weeklyHourGoal
        context.user = newUser
        setContext({ ...context })
    }

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">General</h3>
            
            <div className={styles.entry}>
                <div className={styles.key}>username</div>
                <div className={styles.value}>
                    <FormInput width={"120px"} type="text" defaultValue={user.getUsername()} onSave={saveUsername} contextKey="settings.username" />
                </div>
            </div>

            <div className={styles.entry}>
                <div className={styles.key}>weekly hour goal</div>
                <div className={styles.value}>
                    <FormInput width={"120px"} type="number" defaultValue={user.getWeeklyHourGoal()} onSave={saveWeeklyHourGoal} contextKey="settings.weeklyHourGoal" />
                </div>
            </div>

            <div className={styles.entry}>
                <div className={styles.key}>account public</div>
                <div className={styles.value}>
                    <FormInput type="checkbox" defaultValue={user.getAccountPublic()} onSave={saveAccountPublic} contextKey="settings.accountPublic" />
                </div>
            </div>
        </div>
    )
}