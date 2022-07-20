import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useUser } from '../lib/hooks'

import styles from "./userbar.module.scss"

function Component() {
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.container}>
            <div className={styles.pfp}>
                <Image src="/ladeira.jpg" layout="fill" />
            </div>

            <div className={styles.username}>{user.lastName}</div>

            <div className={styles.email}>{user.email}</div>

            <div className={styles.divider} />

            <PageLink text="Overview" url="/overview" icon="/overview-icon.svg" />
            <PageLink text="Schedule" url="/schedule" icon="/schedule-icon.svg" />
            <PageLink text="Journal" url="/journal" icon="/journal-icon.svg" />
            <PageLink text="Lists" url="/lists" icon="/lists-icon.svg" />
            <div className={styles.bottomLinks}>
                <PageLink text="Settings" url="/settings" icon="/settings-icon.svg" />
                <PageLink text="Logout" url="/api/logout" icon="/logout-icon.svg" />
            </div>
        </div>
    )
}

function PageLink({ text, url, icon = "/overview-icon.svg", height = 14, width = 14 }) {
    const router = useRouter()
    const active = router.pathname == url

    return (
        <a className={styles.link} style={{ color: active ? "#008BFF" : "#7D7D7D" }}>
            <Link href={url}>
                <div className={styles.linkInside}>
                    <div className={active ? styles.imageActive : styles.image}>
                        <Image src={icon} height={height} width={width} />
                    </div>
                    <div className={styles.linkInsideText}>{text}</div>
                </div>
            </Link>
        </a>
    )
}

export default Component