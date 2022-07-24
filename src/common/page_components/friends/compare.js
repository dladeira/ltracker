import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import { useEffect, useState } from 'react';
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'


import styles from './compare.module.scss'
import User from '../../lib/user';

/*
=================
 __        __     _      ____    _   _   ___   _   _    ____   _   _   _ 
 \ \      / /    / \    |  _ \  | \ | | |_ _| | \ | |  / ___| | | | | | |
  \ \ /\ / /    / _ \   | |_) | |  \| |  | |  |  \| | | |  _  | | | | | |
   \ V  V /    / ___ \  |  _ <  | |\  |  | |  | |\  | | |_| | |_| |_| |_|
    \_/\_/    /_/   \_\ |_| \_\ |_| \_| |___| |_| \_|  \____| (_) (_) (_)


      _                             _       _                                 _   _   _     _                     _     _       _            __   _   _        
   __| |   ___      _ __     ___   | |_    | |_   _ __   _   _      ___    __| | (_) | |_  (_)  _ __     __ _    | |_  | |__   (_)  ___     / _| (_) | |   ___ 
  / _` |  / _ \    | '_ \   / _ \  | __|   | __| | '__| | | | |    / _ \  / _` | | | | __| | | | '_ \   / _` |   | __| | '_ \  | | / __|   | |_  | | | |  / _ \
 | (_| | | (_) |   | | | | | (_) | | |_    | |_  | |    | |_| |   |  __/ | (_| | | | | |_  | | | | | | | (_| |   | |_  | | | | | | \__ \   |  _| | | | | |  __/
  \__,_|  \___/    |_| |_|  \___/   \__|    \__| |_|     \__, |    \___|  \__,_| |_|  \__| |_| |_| |_|  \__, |    \__| |_| |_| |_| |___/   |_|   |_| |_|  \___|

  
  _   _                           _                                                                                   
 (_) | |_     _ __ ___     __ _  | | __   ___   ___     _ __     ___      ___    ___   _ __    ___    ___             
 | | | __|   | '_ ` _ \   / _` | | |/ /  / _ \ / __|   | '_ \   / _ \    / __|  / _ \ | '_ \  / __|  / _ \            
 | | | |_    | | | | | | | (_| | |   <  |  __/ \__ \   | | | | | (_) |   \__ \ |  __/ | | | | \__ \ |  __/  _   _   _ 
 |_|  \__|   |_| |_| |_|  \__,_| |_|\_\  \___| |___/   |_| |_|  \___/    |___/  \___| |_| |_| |___/  \___| (_) (_) (_)
          
 
             _       _   _                               _   _                     _                            _       _                     _       _            
 __      __ | |__   (_) | |   ___      ___    ___     __| | (_)  _ __     __ _    (_)     ___    ___    _   _  | |   __| |    _ __     ___   | |_    | |__     ___ 
 \ \ /\ / / | '_ \  | | | |  / _ \    / __|  / _ \   / _` | | | | '_ \   / _` |   | |    / __|  / _ \  | | | | | |  / _` |   | '_ \   / _ \  | __|   | '_ \   / _ \
  \ V  V /  | | | | | | | | |  __/   | (__  | (_) | | (_| | | | | | | | | (_| |   | |   | (__  | (_) | | |_| | | | | (_| |   | | | | | (_) | | |_    | |_) | |  __/
   \_/\_/   |_| |_| |_| |_|  \___|    \___|  \___/   \__,_| |_| |_| |_|  \__, |   |_|    \___|  \___/   \__,_| |_|  \__,_|   |_| |_|  \___/   \__|   |_.__/   \___|
                                                                         |___/                                                                                     

                                                                         
                                                                                         _                 _     _                                   _               _   _                                 _           _       _        
   __ _   ___  | | __   ___    __| |   | |_    ___      _ __ ___     __ _  | | __   ___    (_) | |_     _ __    ___    __ _    __| |   __ _  | |__   | |   ___ 
  / _` | / __| | |/ /  / _ \  / _` |   | __|  / _ \    | '_ ` _ \   / _` | | |/ /  / _ \   | | | __|   | '__|  / _ \  / _` |  / _` |  / _` | | '_ \  | |  / _ \
 | (_| | \__ \ |   <  |  __/ | (_| |   | |_  | (_) |   | | | | | | | (_| | |   <  |  __/   | | | |_    | |    |  __/ | (_| | | (_| | | (_| | | |_) | | | |  __/
  \__,_| |___/ |_|\_\  \___|  \__,_|    \__|  \___/    |_| |_| |_|  \__,_| |_|\_\  \___|   |_|  \__|   |_|     \___|  \__,_|  \__,_|  \__,_| |_.__/  |_|  \___|
                                                                                                                                                               

=================
*/

export function Compare() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [friends, setFriends] = useState()
    const [selectedTask, setHardTask] = useState("all")
    const [chartData, setChartData] = useState({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: []
    })

    useEffect(() => {
        fetch("/api/user/friends/getFriends", {
            method: "POST"
        }).then(res => res.json().then(friends => {
            setFriends(friends)

            chartData.datasets = getChartData(null, friends)
            setChartData({ ...chartData })
        }))

    }, [])

    function setTask(task) {
        setHardTask(task)

        if (task == 'all') {
            chartData.datasets = getChartData()
        } else {
            chartData.datasets = getChartData(task)
        }

        setChartData({ ...chartData })
    }

    function getChartData(task, preloadFriends) {
        const data = []
        var id = 0

        data.push(getDailyHoursArray(user, user, context.week, context.year, id++, task))

        if (friends) {
            friends.map(friend => {
                const userTask = getAllTasks(true).find(loopTask => {
                    return loopTask.user == friend._id && loopTask.task == task
                })
                console.log(userTask ? myTaskToHisTask(userTask.task, friend._id) : null)

                data.push(getDailyHoursArray(new User(friend), user, context.week, context.year, id++, userTask ? myTaskToHisTask(userTask.task, friend._id) : null))
            })
        } else if (preloadFriends) {
            preloadFriends.map(friend => {
                data.push(getDailyHoursArray(new User(friend), user, context.week, context.year, id++))
            })
        }

        return data
    }

    function getAllTasks(allUsers) {
        const userTasks = []
        const tasks = []
        for (var friend of user.getFriends()) {
            for (var pair of friend.pairedTasks) {
                const task = pair.this
                const target = pair.that
    
                if (userTasks.findIndex(loopTask => loopTask.user == user.getId() && loopTask.task == task) == -1) {
                    userTasks.push({
                        user: user.getId(),
                        task: task
                    })
                    tasks.push(task)
                }
    
                userTasks.push({
                    user: friend.id,
                    task: task
                })
    
            }
        }
    
        return allUsers ? userTasks : tasks
    }

    function myTaskToHisTask(taskId, targetUserId) {
        const friend = user.getFriends().find(loopFriend => loopFriend.id == targetUserId)
        const task = friend.pairedTasks.find(pair => pair.this == taskId)

        return task.that
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            y:
            {
                beginAtZero: true,
                max: 16,
                stepSize: 4
            },
        }
    }

    return (
        <div className="h-full w-full relative bg-white rounded-lg p-3.5 pt-1 row-span-3 col-span-3">
            <h3 className="text-lg font-medium">Time Spent</h3>
            <div className={styles.tasks}>
                <div onClick={e => setTask("all")} className={styles.task + " " + (selectedTask == "all" ? styles.taskSelected : "")}>
                    all
                </div>
                {getAllTasks(false).map(task => {
                    return (
                        <div onClick={e => setTask(task)} className={styles.task + " " + (selectedTask == task ? styles.taskSelected : "")}>
                            {user.getTask(task).name}
                        </div>
                    )
                })}
            </div>
            <div className={styles.chartContainer}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    )
}

function getDailyHoursArray(targetUser, user, week, year, id, task) {
    var hours = []
    for (var i = 0; i < 7; i++) {
        if (task) {
            hours.push(targetUser.getTaskHoursForDay(i, week, year, task))
        } else {
            hours.push(targetUser.getHoursForDay(i, week, year))
        }
    }

    if (user.getUsername() == targetUser.getUsername()) {
        return {
            id: id,
            label: targetUser.getUsername(),
            data: hours,
            backgroundColor: "rgba(0, 139, 255, 0.9)",
            borderColor: "rgba(0, 139, 255, 0.8)",
            pointRadius: 5,
            pointHoverRadius: 10
        }
    }

    return {
        id: id,
        label: targetUser.getUsername(),
        data: hours,
        pointRadius: 5,
        pointHoverRadius: 10
    }
}