import { AppStateProvider } from "@/contexts/AppStateProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { NotedThemeProvider } from "@/contexts/NotedThemeProvider";
import { NotesProvider } from "@/contexts/NotesProvider";
import { SearchBarProvider } from "@/contexts/SearchBarProvider";
import { SelectionProvider } from "@/contexts/SelectionProvider";
import { initDb } from "@/db";
import { getLocales } from "expo-localization";
import { SplashScreen, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index'
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  console.log(getLocales()[0].languageCode)
  useEffect(() => {
    async function initAsync() {
      try {
        await initDb();
      } catch (error) {
        console.warn(error);
      } finally {
        setTimeout(() => { setIsReady(true) }, 1000);
        // setIsReady(true);
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
