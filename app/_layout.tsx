import { AppStateProvider } from "@/contexts/AppStateProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { NotedThemeProvider } from "@/contexts/NotedThemeProvider";
import { NotesProvider } from "@/contexts/NotesProvider";
import { SearchBarProvider } from "@/contexts/SearchBarProvider";
import { SelectionProvider } from "@/contexts/SelectionProvider";
import sqliteDb from "@/db/SQLiteDbStarter";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index'
};

export default function RootLayout() {
  /* Determines whether or not the splash screen can be hidden */
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    /**
     * Makes sure SQLite db is initialized before hiding the splash screen
     */
    async function initAsync() {
      try {
        await sqliteDb.initDb();
      } catch (error) {
        console.warn(error);
      } finally {
        setTimeout(() => { setIsReady(true) }, 1000);
      }
    }

    initAsync();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  return (
    <AppStateProvider>
      <LanguageProvider>
        <KeyboardProvider>
          <SafeAreaProvider>
            <NotedThemeProvider>
              <SearchBarProvider>
                <NotesProvider>
                  <SelectionProvider>
                    <Stack>
                      <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="note/index"
                        options={{ title: '', headerShown: false }}
                      />
                      <Stack.Screen
                        name="list/index"
                        options={{ title: '', headerShown: false }}
                      />
                      <Stack.Screen 
                        name="settings/index"
                        options={{ title: '', headerShown: false }}
                      />
                    </Stack>
                  </SelectionProvider>
                </NotesProvider>
              </SearchBarProvider>
            </NotedThemeProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </LanguageProvider>
    </AppStateProvider>
  );
}
