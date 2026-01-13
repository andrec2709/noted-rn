import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EnrichedTextInput } from 'react-native-enriched';
import type {
    EnrichedTextInputInstance,
    OnChangeStateEvent,
} from 'react-native-enriched';
import { debounce } from "@/utils";
import { useNotes } from "@/contexts/NotesProvider";
import { NotesRepository } from "@/db/notesRepository";
import { NoteContentType } from "@/types/notes";
import { useFocusEffect } from "expo-router";
import { useKeyboardState } from 'react-native-keyboard-controller';
import { useLanguage } from "@/contexts/LanguageProvider";
import HeaderGeneric from "@/components/layout/HeaderGeneric";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import H1Icon from "@/components/icons/H1Icon";
import BoldIcon from "@/components/icons/BoldIcon";
import UnderlineIcon from "@/components/icons/UnderlineIcon";
import ItalicIcon from "@/components/icons/ItalicIcon";
import FormatClearIcon from "@/components/icons/FormatClearIcon";
import OrderedListIcon from "@/components/icons/OrderedListIcon";


export default function NoteScreen() {
    const { activeNoteRef } = useNotes();
    const { i18n } = useLanguage();
    const { Colors } = useNotedTheme();

    if (activeNoteRef.current && activeNoteRef.current.type !== 'note') return null;

    const ref = useRef<EnrichedTextInputInstance>(null);
    const [stylesState, setStylesState] = useState<OnChangeStateEvent | null>();
    const ks = useKeyboardState();

    const handleChangeText = async () => {
        const active = activeNoteRef.current;
        if (active && active.type === 'note') {
            const html = active.content.html;
            const content: NoteContentType = {
                html: html,
                plainText: active.content.plainText,
            };

            await NotesRepository.updateNoteContent(active.id, active.title, content);
        }
    };


    const debouncedHandleChangeText = useMemo(() => debounce(handleChangeText, 500), []);
    useFocusEffect(useCallback(() => { return () => { handleChangeText(); } }, []));
    console.log('Re-rendered, ', activeNoteRef.current?.content.html);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <HeaderGeneric />
            <TextInput
                style={{
                    fontSize: 25,
                    height: 'auto',
                    color: Colors.onBackground,
                    fontFamily: 'Inter'
                }}
                placeholder={i18n.t('placeholderTitle')}
                placeholderTextColor={Colors.onBackground}
                defaultValue={activeNoteRef.current?.title || ''}
                onChangeText={text => {
                    if (activeNoteRef.current && activeNoteRef.current.type === 'note') activeNoteRef.current.title = text;
                    debouncedHandleChangeText();
                }}
            >
            </TextInput>
            <EnrichedTextInput
                ref={ref}
                onChangeState={e => {
                    console.log('onChangeState fired');
                    setStylesState(e.nativeEvent);
                    debouncedHandleChangeText();
                }}
                style={{ ...styles.input, color: Colors.onBackground }}
                placeholder={i18n.t('placeholderEditor')}
                placeholderTextColor={Colors.onBackground}
                defaultValue={activeNoteRef.current?.content.html || ''}
                onChangeText={e => {
                    console.log('onChangeText fired');
                    if (activeNoteRef.current && activeNoteRef.current.type === 'note') {
                        console.log('setting content.plainText');
                        activeNoteRef.current.content.plainText = e.nativeEvent.value;

                    }
                    debouncedHandleChangeText();
                }}
                onChangeHtml={e => {
                    console.log('onChangeHtml fired');
                    if (activeNoteRef.current && activeNoteRef.current.type === 'note') {
                        console.log('setting content.html');
                        activeNoteRef.current.content.html = e.nativeEvent.value;

                    }
                    debouncedHandleChangeText();
                }}
            />

            <ScrollView
                style={[styles.toolbar, { marginBottom: ks.height, backgroundColor: Colors.backgroundContainer }]}
                contentContainerStyle={styles.toolbarContent}
                horizontal
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
            >
                <Pressable
                    style={[
                        styles.toolbarButton,
                    ]}
                    onPress={() => ref.current?.toggleH1()}
                >
                    <H1Icon color={stylesState?.isH1 ? Colors.toolbarActive : Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                <Pressable
                    style={[
                        styles.toolbarButton
                    ]}
                    onPress={() => ref.current?.toggleBold()}
                    disabled={stylesState?.isH1}
                >
                    <BoldIcon color={stylesState?.isBold ? Colors.toolbarActive : Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                <Pressable
                    style={[
                        styles.toolbarButton
                    ]}
                    onPress={() => ref.current?.toggleUnderline()}
                >
                    <UnderlineIcon color={stylesState?.isUnderline ? Colors.toolbarActive : Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                <Pressable
                    style={[
                        styles.toolbarButton
                    ]}
                    onPress={() => ref.current?.toggleItalic()}
                >
                    <ItalicIcon color={stylesState?.isItalic ? Colors.toolbarActive : Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                <Pressable
                    style={[
                        styles.toolbarButton
                    ]}
                    onPress={() => {
                        if (stylesState?.isBold) ref.current?.toggleBold();
                        if (stylesState?.isUnderline) ref.current?.toggleUnderline();
                        if (stylesState?.isItalic) ref.current?.toggleItalic();
                    }}
                >
                    <FormatClearIcon color={Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                <Pressable
                    onPress={() => ref.current?.toggleOrderedList()}
                    style={[
                        styles.toolbarButton
                    ]}
                >
                    <OrderedListIcon color={stylesState?.isOrderedList ? Colors.toolbarActive : Colors.onBackgroundContainer} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        flex: 1,
        fontFamily: 'Inter'

    },
    toolbar: {
        maxWidth: 500,
        paddingVertical: 5,
        borderRadius: 40,
        marginBottom: 20,
        alignSelf: 'center',
        height: 30,
        maxHeight: 50,
        width: '70%',
    },
    toolbarContent: {
        columnGap: 20,
        paddingHorizontal: 10
    },
    toolbarButton: {
        padding: 10,
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

    }
});