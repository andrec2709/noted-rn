import { Translations } from "@/types/lang";

/**
 * Translations used in the app
 */
export const translations: Translations = {
    en: {
        placeholderTitle: 'Title',
        placeholderEditor: 'Type here...',
        selection: {
            zero: '0 selected',
            one: '1 selected',
            other: '%{count} selected',
        },
        addListItem: 'Add list item',
        checkedItems: {
            zero: '0 checked items',
            one: '1 checked item',
            other: '%{count} checked items',
        },
        cancel: 'Cancel',
        language: 'Language',
        languageOptDescription: 'Display language for the interface',
        english: 'English',
        portuguese: 'Portuguese',
        theme: 'Theme',
        themeOptDescription: 'Display theme for the interface',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
        addNote: 'Note',
        addList: 'List',
        notes: 'Notes',
    },
    'pt-BR': {
        placeholderTitle: 'Título',
        placeholderEditor: 'Escreva aqui...',
        selection: {
            zero: '0 selecionadas',
            one: '1 selecionada',
            other: '%{count} selecionadas',
        },
        addListItem: 'Adicionar novo item',
        checkedItems: {
            zero: '0 completados',
            one: '1 completado',
            other: '%{count} completados'
        },
        cancel: 'Cancelar',
        language: 'Idioma',
        languageOptDescription: 'Idioma da interface',
        english: 'Inglês',
        portuguese: 'Português',
        theme: 'Tema',
        themeOptDescription: 'Tema da interface',
        darkMode: 'Modo escuro',
        lightMode: 'Modo claro',
        addNote: 'Nota',
        addList: 'Lista',
        notes: 'Notas',
    },
};

export default translations;