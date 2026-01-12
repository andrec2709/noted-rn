import  'react-native-get-random-values';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NotesRepository } from "@/db/notesRepository";
import { NoteContentType, ListContentType } from "@/types/notes";
import { useNotes } from "@/contexts/NotesProvider";
import { v4 as uuidv4 } from 'uuid';

export default function Debugger() {
    const { reload } = useNotes();
    const addNotes = async (n: number) => {
        for (let x = 0; x < n; x++) {
            if (x % 2 == 0) {
                const content: NoteContentType = {
                    html: '<html><h1>Hello World</h1><br><p>this is example content</p></html>',
                    plainText: 'Hello World\n\nthis is example content',
                };
                await NotesRepository.createNote(`Note ${x}`, content, 'note');
            } else {
                const content: ListContentType = {
                    items: [
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello woooooooooorld', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'aaaaaaaaaaaaaaaaaa', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello woooooooooorld', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'aaaaaaaaaaaaaaaaaa', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello woooooooooorld', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'aaaaaaaaaaaaaaaaaa', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello', id: uuidv4() },
                        { checked: true, content: 'Hello woooooooooorld', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                        { checked: false, content: 'aaaaaaaaaaaaaaaaaa', id: uuidv4() },
                        { checked: false, content: 'Hello', id: uuidv4() },
                    ],
                };
                await NotesRepository.createNote(`Note ${x}`, content, 'list');
            }
        }

        await reload();

    };

    const deleteAndReload = async () => {
        await NotesRepository.deleteAllNotes();
        await reload();
    };

    return (
        <View style={styles.debuggerContainer}>
            <Pressable 
            style={styles.pressable}
            onPress={async () => await deleteAndReload() }
            >
                <Text style={styles.pressableText}>X</Text>
            </Pressable>
            <Pressable
                style={styles.pressable}
                onPress={async () => await addNotes(10)}
            >
                <Text style={styles.pressableText}>+10</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    debuggerContainer: {
        position: 'absolute',
        backgroundColor: '#a3fcffff',
        columnGap: 10,
        flexDirection: 'row',
        bottom: 70,
    },
    pressable: {
        backgroundColor: '#1bbeffff',
        paddingHorizontal: 30,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pressableText: {
        fontSize: 18
    }
});