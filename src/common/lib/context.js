import { useState } from 'react';
import { createContext, useContext } from 'react';
import { getWeekDay } from '../lib/util'

const AppContext = createContext();

export function AppWrapper({ children }) {
    var date = new Date()
    const [state, setState] = useState({ day: getWeekDay(new Date()), week: date.getCurrentWeek(), year: date.getFullYear(), lastMouseUp: 0 })

    return (
        <AppContext.Provider value={[state, setState]}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}