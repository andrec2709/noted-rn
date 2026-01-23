import { useNotes } from "@/contexts/NotesProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";
import Sortable from "react-native-sortables";
import DragIcon from "../icons/DragIcon";
import Checkbox from "./Checkbox";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";

type Props = {
    isChecked: boolean;
    content: string;
    onDelete: (id: string, checked: boolean) => void;
    id: string;
    onPress: (id: string, state: boolean) => void;
    onChangeText: (text: string, id: string) => void;
    onSubmit: (...args: any) => any;
};

export default function ListItem({ isChecked, content, onDelete, id, onPress, onChangeText, onSubmit }: Props) {
    const { selectedListItem, setSelectedListItem } = useNotes();
    const { Colors } = useNotedTheme();
    const [checked, setChecked] = useState(isChecked);
    const submittingRef = useRef(false);

    const handlePress = () => {
        setChecked(!checked);
        Keyboard.dismiss();
        onPress(id, !checked);
    };

    /**
     * This function is used to avoid duplicate events triggered by a hardware keyboard.
     * 
     * @returns 
     */
    const onSubmitSafe = () => {
        
        if (submittingRef.current) return;
        submittingRef.current = true;

        onSubmit();

        setTimeout(() => {
            submittingRef.current = false;
        }, 100);
    };

    return (
        <View
            style={[
                styles.itemContainer,
                { opacity: checked ? .5 : 1 }
            ]}
        >
            <Sortable.Handle style={styles.itemIcon}>
                <DragIcon size={24} color={Colors.onBackground} />
            </Sortable.Handle>
            <Checkbox
                checkedState={checked}
                size={24}
                style={[styles.itemIcon]}
                onPress={handlePress}
                color={Colors.onBackground}
                colorChecked={Colors.noteChecked}
            />
            <View
                style={{ flex: 1, flexDirection: 'row', }}
            >
                <TextInput
                    style={[
                        styles.itemInput,
                        {
                            color: Colors.onBackground,
                            textDecorationLine: checked ? 'line-through' : 'none',
                        },
                    ]}
                    defaultValue={content}
                    multiline
                    autoFocus={selectedListItem === id}
                    submitBehavior="submit"
                    onChangeText={text => onChangeText(text, id)}
                    onFocus={() => setSelectedListItem(id)}
                    onSubmitEditing={onSubmitSafe}

                />
                <Ionicons
                    name="close-sharp"
                    size={32}
                    onPress={() => {
                        onDelete(id, checked);
                    }}
                    color={Colors.onBackground}
                    style={[styles.itemIcon, { opacity: selectedListItem === id ? 1 : 0 }]}
                    disabled={!(selectedListItem === id)}

                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    itemIcon: {
        marginTop: 12,
        alignSelf: 'flex-start'
    },
    itemInput: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Inter',
    },
});