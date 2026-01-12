import { DarkColors, LightColors } from "@/constants/theme";
import { Theme, ThemeColors } from "@/types/theme";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
    theme: string;
    changeTheme: (newTheme: Theme) => Promise<void>;
    Colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useNotedTheme = () => {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error('useNotedTheme must be used inside a NotedThemeProvider');
    }

    return ctx;
};

export const NotedThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const prefColorScheme = useColorScheme();
    // const [theme, setTheme] = useState<Theme>(prefColorScheme ?? 'light');
    const [theme, setTheme] = useState<Theme>('dark');
    const Colors: ThemeColors = theme === 'light' ? LightColors : DarkColors;

    useEffect(() => {
        /**
         * @function
         * 
         * Sets the theme state to the in-app defined preference of the user.
         * 
         * If a valid value is not present, sets AsyncStorage to the value of the theme state.
         * 
         */
        const defineTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('theme');
                if (storedTheme === 'light' || storedTheme === 'dark') {
                    setTheme(storedTheme);
                    return;
                }

                await AsyncStorage.setItem('theme', theme);

            } catch (e) {
                console.warn('Could not fetch theme information.', e);                
            }
        };

        // defineTheme();
    }, []);

    const changeTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem('theme', newTheme);
            setTheme(newTheme);
        } catch (e) {
            console.warn('Failed to persist theme', e);
        }
    };

    return (
        <ThemeContext.Provider value={{theme, changeTheme, Colors}}>
            {children}
        </ThemeContext.Provider>
    );

};