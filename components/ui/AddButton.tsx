import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { ColorValue, Pressable, PressableProps, StyleProp, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native";
import PlusIcon from "../icons/PlusIcon";

type Props = Omit<TouchableOpacityProps, 'style' | 'activeOpacity' > & {
    style?: StyleProp<ViewStyle>;
};

export default function AddButton({style, ...props}: Props) {
    const { Colors } = useNotedTheme();
    return (
        <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors.primary, }, style]}
            activeOpacity={.7}
            {...props}
        >
            <PlusIcon color={Colors.onPrimary} size={48} />
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 40,
    aspectRatio: 1,
    width: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  }
});
