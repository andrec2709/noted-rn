import { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

type AppStateContextType = {
    appState: RefObject<AppStateStatus>;
    appStateVisible: AppStateStatus;
};

const AppStateContext = createContext<AppStateContextType | null>(null);

export const useAppState = () => {
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error('useAppState must be used inside an AppStateProvider');
    return ctx;
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => { 

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <AppStateContext.Provider value={{ appStateVisible, appState }}>
            {children}
        </AppStateContext.Provider>
    );
};