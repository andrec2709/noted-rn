import { useNotes } from "@/contexts/NotesProvider";
import { useSearchBar } from "@/contexts/SearchBarProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { Payload } from "@/types/notes";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Sortable from "react-native-sortables";
import DragIcon from "../icons/DragIcon";
import ListIcon from "../icons/ListIcon";
import NoteIcon from "../icons/NoteIcon";
import Checkbox from "./Checkbox";
import { NotesRepository } from "@/db/notesRepository";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";

export default function ItemPreview({
    type,
    title,
    contentPreview,
    id,
    payload,
}: {
    type: 'note' | 'list';
    title: string;
    contentPreview: string;
    id: string;
    payload: Payload;
}) {
    const { isSelecting, setIsSelecting, setSelectionBuffer } = useSelection();
    const [checked, setChecked] = useState(false);
    const { isSearchBarOpen } = useSearchBar();
    const { setActiveNote } = useNotes();
    const { Colors } = useNotedTheme();
    const router = useRouter();
    let itemIcon: React.ReactNode | null = null;

    if (type === 'note') {
        itemIcon = <NoteIcon size={24} color={Colors.onNoteBackground} />;
    } else {
        itemIcon = <ListIcon size={24} color={Colors.onNoteBackground} />;
    }

    const truncateContent = (content: string, caller: 'title' | 'content') => {
        const newContent = content.replaceAll('\n', ' ');
        const limit = caller === 'title' ? 20 : 30;

        if (content.length <= limit) return newContent;

        return newContent.substring(0, limit).concat('...');
    };

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
                if (isSelecting) handlePress();
                else {
                    const note = await NotesRepository.getNote(id);
                    if (!note) return;
                    setActiveNote(note);
                    if (note.type === 'note') router.navigate('./note');
                    else if (note.type === 'list') router.navigate('./list');
                }
            }}
        >
            {itemIcon}
            <View>
                <Text
                    style={[styles.title, { color: Colors.onNoteBackground }]}
                >
                    {truncateContent(title, 'title')}
                </Text>
                <Text
                    style={[styles.content, { color: Colors.onNoteBackground }]}
                >
                    {truncateContent(contentPreview, 'content')}
                </Text>
            </View>
            <View
                style={styles.selectionContainer}
            >
                {
                    isSelecting
                        ? <Checkbox size={24} checkedState={checked} onPress={handlePress} colorChecked={Colors.onNoteBackground} color={Colors.onNoteBackground} />
                        : ''
                }
                {
                    isSelecting
                        ? <Sortable.Handle><DragIcon size={24} color={Colors.onNoteBackground} /></Sortable.Handle>
                        : ''
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