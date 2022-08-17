import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { useState } from 'react'

import GridItem from '../../components/gridItem'

import styles from './muscleImpact.module.scss'

export function MuscleImpact() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [front, setFront] = useState(true)

    function getMuscleFill(type) {
        switch (user.getMuscleImpact(type, context.week, context.year)) {
            case 0:
                return "#d2dbed"
            case 1:
                return "#f09e9e"
            case 2:
                return "#ed5a5a"
            case 3:
                return "#f52525"
            default: // More than 3
                return "#f52525"
        }
    }

    return (
        <GridItem rowSpan="2" mRowSpan="2" title="Muscle Impact">
            <div className={styles.sides}>
                <div className={styles.front + (front ? " " + styles.active : "")} onClick={e => setFront(true)}>
                    Front
                </div>

                <div className={styles.back + (!front ? " " + styles.active : "")} onClick={e => setFront(false)}>
                    Back
                </div>
            </div>

            <div className={styles.body}>
                <svg id="e1rWyE6pdS51" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 600 700" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                    {(front ? (
                        <g transform="matrix(1 0 0 1-40-190)">
                            <rect fill={getMuscleFill("biceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937262 0.348627-.348627 0.937262 210.326109 287.05409)" strokeWidth="0" />
                            <rect fill={getMuscleFill("biceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937282-.348572 0.348572 0.937282 409.390963 308.319492)" strokeWidth="0" />
                            <rect fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.756757 0 0 0.269724 225.747607 241.691107)" strokeWidth="0" />
                            <rect fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.756757 0 0 0.269724 343.974155 241.691107)" strokeWidth="0" />
                            <rect fill={getMuscleFill("chest")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.072276 0 0 0.35709 267.506035 308.322833)" strokeWidth="0" />
                            <rect fill={getMuscleFill("chest")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.072276 0 0 0.35709 343.974155 308.322833)" strokeWidth="0" />
                            <rect fill={getMuscleFill("abs")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.323984 0 0 0.663883 295.909693 387.138408)" strokeWidth="0" />
                            <rect fill={getMuscleFill("quads")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 521.278876)" strokeWidth="0" />
                            <rect fill={getMuscleFill("quads")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 521.278876)" strokeWidth="0" />
                            <rect fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 649.722329)" strokeWidth="0" />
                            <rect fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 649.722329)" strokeWidth="0" />
                            <g transform="translate(151.693097-38.62571)">
                                <rect fill={getMuscleFill("obliques")} width="20.486182" height="111.655236" rx="0" ry="0" transform="translate(115.81295 425.760761)" strokeWidth="0" />
                                <rect fill={getMuscleFill("obliques")} width="20.486182" height="111.655236" rx="0" ry="0" transform="translate(232.90695 425.762474)" strokeWidth="0" />
                            </g>
                        </g>
                    ) : (
                        <g transform="matrix(1 0 0 1-40-190)">
                            <rect fill={getMuscleFill("triceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937262 0.348627-.348627 0.937262 210.326109 297.688463)" strokeWidth="0" />
                            <rect fill={getMuscleFill("triceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937282-.348572 0.348572 0.937282 405.086217 318.952194)" strokeWidth="0" />
                            <rect fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.015984 0 0 0.269724 236.514747 252.323809)" strokeWidth="0" />
                            <rect fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.015984 0 0 0.269724 374.094929 252.323809)" strokeWidth="0" />
                            <rect fill={getMuscleFill("lowerBack")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(2.255138 0 0 0.337897 267.506035 444.68854)" strokeWidth="0" />
                            <rect fill={getMuscleFill("hamstrings")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 521.278876)" strokeWidth="0" />
                            <rect fill={getMuscleFill("hamstrings")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 521.278876)" strokeWidth="0" />
                            <rect fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.67169 348.278901 649.065828)" strokeWidth="0" />
                            <rect fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.67169 267.506035 649.065828)" strokeWidth="0" />
                            <g transform="translate(-274.804085-32.440568)">
                                <rect fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(1 0 0 1.099195 536.170057 393.741747)" strokeWidth="0" />
                                <rect fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(2.175325 0 0 0.520432 570.713889 430.256116)" strokeWidth="0" />
                                <rect fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(1 0 0 1.099195 648.899014 393.741747)" strokeWidth="0" />
                            </g>
                            <polygon fill={getMuscleFill("traps")} points="-4.284312,-85.257355 39.219686,-58.61571 58.29886,41.78042 -66.867298,41.777927 -47.696197,-58.61571 -4.284312,-85.257355" transform="matrix(-.603978 0 0-.704135 333.708552 327.105764)" strokeWidth="0" />
                        </g>
                    ))}
                </svg>
            </div>
        </GridItem>
    )
}