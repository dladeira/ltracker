import { useState } from 'react';
import { createContext, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { getWeekDay } from '../lib/util'

const AppContext = createContext();

export function AppWrapper({ children }) {
    var date = new Date()
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })
    const [state, setState] = useState({ day: getWeekDay(new Date()), week: date.getCurrentWeek(), year: date.getFullYear(), lastMouseUp: 0, userbarOpen: isMobile ? false : true })

    return (
        <AppContext.Provider value={[state, setState]}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}