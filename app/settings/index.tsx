import HeaderGeneric from "@/components/layout/HeaderGeneric";
import SettingWithModal from "@/components/ui/SettingWithModal";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const { Colors, changeTheme } = useNotedTheme();
    const { i18n, changeLanguage } = useLanguage();

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors.background}]} >
            <HeaderGeneric />
            <SettingWithModal
                name={i18n.t('language')}
                description={i18n.t('languageOptDescription')}
                opts={[
                    { value: i18n.t('english'), callback: () => changeLanguage('en') },
                    { value: i18n.t('portuguese'), callback: () => changeLanguage('pt-BR') },
                ]}
            />
            <SettingWithModal
                name={i18n.t('theme')}
                description={i18n.t('themeOptDescription')}
                opts={[
                    { value: i18n.t('darkMode'), callback: () => changeTheme('dark') },
                    { value: i18n.t('lightMode'), callback: () => changeTheme('light') },
                ]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});