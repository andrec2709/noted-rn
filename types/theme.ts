import { ColorValue } from "react-native";

export type Theme = 'light' | 'dark';

export type ThemeColors = {
    background: ColorValue;
    backgroundContainer: ColorValue;
    deleteIcon: ColorValue;
    noteBackground: ColorValue;
    noteChecked: ColorValue;
    onBackground: ColorValue;
    onBackgroundContainer: ColorValue;
    onNoteBackground: ColorValue;
    onPrimary: ColorValue;
    primary: ColorValue;
    toolbarActive: ColorValue;
};