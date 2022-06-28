import { useState } from 'react';

import { createContext, useContext } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
    var date = new Date()
    const [state, setState] = useState({ week: date.getCurrentWeek(), year: date.getFullYear() })

    return (
        <AppContext.Provider value={[state, setState]}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}