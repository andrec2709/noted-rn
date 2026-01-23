import { IconProps } from "@/ui/icon/types";
import { ColorValue, Pressable, PressableProps, StyleSheet } from "react-native";

type Props = Omit<PressableProps, 'style'> & {
    Icon: React.ComponentType<IconProps>;
    color: ColorValue;
};

export default function ToolbarButton({ Icon, color, ...props }: Props) {
    return (
        <Pressable
            style={styles.toolbarButton}
            {...props}
        >
            <Icon size={24} color={color} style={{ alignSelf: 'center' }} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    toolbarButton: {
        padding: 10,
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

    }
});
