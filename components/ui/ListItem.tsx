import { useNotes } from "@/contexts/NotesProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import Sortable from "react-native-sortables";
import DragIcon from "../icons/DragIcon";
import Checkbox from "./Checkbox";

type Props = {
    isChecked: boolean;
    content: string;
    onDelete: (id: string, checked: boolean) => void;
    id: string;
    onPress: (id: string, state: boolean) => void;
    onChangeText: (text: string, id: string) => void;
};

export default function ListItem({ isChecked, content, onDelete, id, onPress, onChangeText }: Props) {
    const { selectedListItem, setSelectedListItem } = useNotes();
    const [checked, setChecked] = useState(isChecked);

    const handlePress = () => {
        setChecked(!checked);
        Keyboard.dismiss();
        onPress(id, !checked);
    };

    return (
        <View style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            opacity: checked ? .5 : 1
        }}
        

        >
            <Sortable.Handle>
                <DragIcon size={32} style={{ marginTop: 8 }} />
            </Sortable.Handle>
            <Checkbox
                checkedState={checked}
                size={32}
                style={{
                    marginTop: 8
                }}
                onPress={handlePress}
            />
            <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}
            >
                <TextInput
                    style={{
                        color: 'black',
                        flex: 1,
                        fontSize: 18,
                        textDecorationLine: checked ? 'line-through' : 'none',
                    }}
                    defaultValue={content}
                    placeholderTextColor={'black'}
                    multiline
                    autoFocus={selectedListItem === id}
                    onChangeText={text => onChangeText(text, id)}
                    onFocus={() => setSelectedListItem(id)}
                    
                />
                <Ionicons
                    name="close"
                    size={32}
                    onPress={() => {
                        onDelete(id, checked);
                    }}
                    
                    style={{ opacity: selectedListItem === id ? 1 : 0 }}
                    disabled={!(selectedListItem === id)}

                />
            </View>
        </View>
    );
}