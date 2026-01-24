/** Supported languages */
export type Language = 'pt-BR' | 'en';

/**
 * Defines the keys for translation
 */
export type Translation = {
    placeholderTitle: string;
    placeholderEditor: string;
    selection: {
        zero: string;
        one: string;
        other: string;
    };
    addListItem: string;
    checkedItems: {
        zero: string;
        one: string;
        other: string;
    };
    cancel: string;
    language: string;
    languageOptDescription: string;
    english: string;
    portuguese: string;
    theme: string;
    themeOptDescription: string;
    darkMode: string;
    lightMode: string;
    addNote: string;
    addList: string;
    notes: string;
    list: string;
};

/**
 * The type of a 'translations' object. Defines that keys are
 * a type of Language and its values are of type Translation.
 */
export type Translations = Record<Language, Translation>;