/** Supported languages */
export type Language = 'pt-BR' | 'en';

/**
 * Defined the keys for translation
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
};

/**
 * The type of a 'translations' object. Defines that keys are
 * a type of Language and its values are of type Translation.
 */
export type Translations = Record<Language, Translation>;