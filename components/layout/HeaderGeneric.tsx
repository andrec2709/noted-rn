import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HeaderGeneric() {
    const { Colors } = useNotedTheme();
    const router = useRouter();

    return (
        <View style={[styles.headerContainer, { backgroundColor: Colors.background }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
            >
                <Ionicons
                    name="arrow-back"
                    size={20}
                    color={Colors.onBackground}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        width: '100%',
        height: 56
    },
});