import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import ListIcon from "../icons/ListIcon";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { IconProps } from "@/ui/icon/types";

type Props = Omit<TouchableOpacityProps, 'style' | 'activeOpacity'> & {
    text: string;
    Icon: React.ComponentType<IconProps>;
};

export default function AddButtonOpt({ text, Icon, ...props }: Props) {
    const { Colors } = useNotedTheme();


    return (
        <TouchableOpacity
            style={[styles.addOpt, { backgroundColor: Colors.primary }]}
            activeOpacity={.7}
            {...props}
        >
            <Icon color={Colors.onPrimary} size={24} />
            <Text
                style={[styles.addOptText, { color: Colors.onPrimary }]}
            >{text}</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    addOpt: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
        columnGap: 10,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',

    },
    addOptText: {
        fontSize: 16,
        fontFamily: 'Inter'
    },
});
