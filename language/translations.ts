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
    },
};

export default translations;