import { getLocales } from "expo-localization";
import { createContext, useContext, useEffect, useState } from "react";
import { I18n } from 'i18n-js';
import ptBR from 'i18n-js/json/pt-BR.json';
import en from 'i18n-js/json/en.json';
import { Language, Translations } from "@/types/lang";
import translations from "@/language/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LanguageContextType = {
    lang: Language;
    setLang: React.Dispatch<React.SetStateAction<Language>>;
    i18n: I18n;
    changeLanguage: (lang: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be inside a LanguageProvider');

    return ctx;

};


export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const userPref = getLocales()[0].languageCode;
    const [lang, setLang] = useState<Language>(userPref === 'pt' ? 'pt-BR' : 'en');
    const i18n = new I18n({ ...ptBR, ...en });
    i18n.locale = lang;
    i18n.store(translations);

    const changeLanguage = async (newLang: Language) => {
        try {
            AsyncStorage.setItem('lang', newLang);
        } catch (e) {
            console.warn(e);
        } finally {
            setLang(newLang);
        }
    }

    const isLanguage = (testLang: string): testLang is Language => {
        return testLang === 'en' || testLang === 'pt-BR';
    }

    useEffect(() => {
        const fetchLang = async () => {

            try {
                const storedLang = await AsyncStorage.getItem('lang');

                if (storedLang && isLanguage(storedLang)) {
                    setLang(storedLang);
                    return;
                }

                AsyncStorage.setItem('lang', lang);
            } catch (e) {
                console.warn(e);
            }
        };

        fetchLang();
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, setLang, i18n, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};