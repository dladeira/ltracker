import Layout from '../common/components/layout'
import Head from 'next/head'
import { AppWrapper } from '../common/lib/context'

import '../styles/global.scss'

export default function App({ Component, pageProps }) {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Ladeira Tracker</title>
            </Head>
            <AppWrapper>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AppWrapper>
        </>
    )
}

Date.prototype.getCurrentWeek = () => {
    var date = new Date()

    // ISO week date weeks start on Monday, so correct the day number
    var nDay = (date.getDay() + 6) % 7

    // ISO 8601 states that week 1 is the week with the first Thursday of that year
    // Set the target date to the Thursday in the target week
    date.setDate(date.getDate() - nDay + 3)

    // Store the millisecond value of the target date
    var n1stThursday = date.valueOf()

    // Set the target to the first Thursday of the year
    // First, set the target to January 1st
    date.setMonth(0, 1)

    // Not a Thursday? Correct the date to the next Thursday
    if (date.getDay() !== 4) {
        date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7)
    }

    // The week number is the number of weeks between the first Thursday of the year
    // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
    return 1 + Math.ceil((n1stThursday - date) / 604800000)
}