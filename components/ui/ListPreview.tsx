import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSearchBar } from "@/contexts/SearchBarProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { ListPayload, Payload } from "@/domain/notes/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoteIcon from "../icons/NoteIcon";
import { truncateContent } from "@/utils";
import Checkbox from "./Checkbox";
import Sortable from "react-native-sortables";
import DragIcon from "../icons/DragIcon";
import ListIcon from "../icons/ListIcon";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useGetNoteById } from "@/application/notes/useGetNoteById";

type Props = {
    payload: ListPayload;
};

export default function ListPreview({
    payload,
}: Props
) {
    /* 
    Contexts
    */
    const { isSelecting, setIsSelecting, setSelectionBuffer } = useSelection();
    const { i18n } = useLanguage();
    const { isSearchBarOpen } = useSearchBar();
    const { setActiveNote } = useNotes();
    const { Colors } = useNotedTheme();

    /*
    Use cases / hooks
    */
    const getById = useGetNoteById();
    const router = useRouter();

    /* 
    Others
    */
    const [checked, setChecked] = useState(false);

    /**
     * @function
     * Handles whether or not this preview is selected (when in selection mode)
     */
    const handlePress = () => {
        if (checked) {
            setSelectionBuffer(prev => prev.filter(nt => nt.id !== payload.id));
            setChecked(false);
        } else {
            setSelectionBuffer(prev => [...prev, payload]);
            setChecked(true);
        }
    };

    useEffect(() => {
        if (!isSelecting) {
            setChecked(false);
        }
    }, [isSelecting]);

    return (
        <TouchableOpacity
            style={[styles.noteContainer, { backgroundColor: Colors.noteBackground }]}
            activeOpacity={.5}
            onLongPress={() => {
                if (!isSearchBarOpen) setIsSelecting(true);
            }}
            onPress={async () => {
                if (isSelecting) {
                    handlePress();
                } else {
                    const note = await getById(payload.id);
                    if (!note) return;
                    setActiveNote(note);
                    router.navigate('./list');
                }
            }}
        >
            <ListIcon size={24} color={Colors.onNoteBackground} />
            <View>
                <Text
                    style={[styles.title, { color: Colors.onNoteBackground }]}
                >
                    {truncateContent(payload.title)}
                </Text>
                <Text
                    style={[styles.content, { color: Colors.onNoteBackground }]}
                >
                    {i18n.t('list')}
                </Text>
            </View>
            <View
                style={styles.selectionContainer}
            >
                {
                    isSelecting &&
                    <>
                        <Checkbox size={24} checkedState={checked} onPress={handlePress} colorChecked={Colors.noteChecked} color={Colors.onNoteBackground} />
                        <Sortable.Handle><DragIcon size={24} color={Colors.onNoteBackground} /></Sortable.Handle>
                    </>
                }
            </View>
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: 'Inter'
    },
    content: {
        fontFamily: 'Inter',
        fontSize: 16,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,

    },
    selectionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
    }
});