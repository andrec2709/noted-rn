import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HeaderGeneric() {
    const { Colors } = useNotedTheme();
    const router = useRouter();

    return (
        <View style={[styles.headerContainer, { backgroundColor: Colors.background }]}>
            <Ionicons
                name="arrow-back"
                size={20}
                color={Colors.onBackground}
                onPress={() => router.back()}
            />
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