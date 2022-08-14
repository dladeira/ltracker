import { useUser } from '../../lib/hooks'


import styles from './general.module.scss'
import FormInput from '../../components/formInput'
import { useAppContext } from '../../lib/context'

export function General() {
    const [user] = useUser({ userOnly: true })
    const [context, setContext] = useAppContext()

    function saveSetting(contextKey, key) {
        return async (data) => {
            const toSend = {}
            toSend[key] = data
            console.log(toSend)
            const res = await fetch(window.origin + "/api/user/settings", {
                body: JSON.stringify(toSend),
                method: "PATCH"
            })
            const newUser = await res.json()
            context.data[contextKey].value = newUser[key]
            context.user = newUser
            setContext({ ...context })
        }
    }

    async function saveProfilePicture(value) {
        const res = await fetch(window.origin + "/api/user/setProfilePicture", {
            body: JSON.stringify({
                image: value
            }),
            method: "POST"
        })
        const newUser = await res.json()
        context.user = newUser
        setContext({ ...context })
    }

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">General</h3>

            <div className={styles.entry}>
                <div className={styles.key}>username</div>
                <FormInput width={"40%"} type="text" defaultValue={user.getUsername()} onSave={saveSetting("settings.username", "username")} contextKey="settings.username" />
            </div>

            <div className={styles.entry}>
                <div className={styles.key}>weekly hour goal</div>
                <FormInput width={"40%"} type="number" defaultValue={user.getWeeklyHourGoal()} onSave={saveSetting("settings.weeklyHourGoal", "weeklyHourGoal")} contextKey="settings.weeklyHourGoal" />
            </div>

            <div className={styles.entry}>
                <div className={styles.key}>account public</div>
                <FormInput type="checkbox" defaultValue={user.getAccountPublic()} onSave={saveSetting("settings.accountPublic", "public")} contextKey="settings.accountPublic" />
            </div>

            <div className={styles.entry}>
                <div className={styles.key}>profile picture</div>
                <FormInput width={"40%"} type="file" defaultValue={user.getProfilePicture()} onSave={saveProfilePicture} contextKey="settings.profilePicture" />
            </div>
        </div>
    )
}