import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const { Colors, theme, changeTheme } = useNotedTheme();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
                <Text>Theme</Text>
                <Text>{theme}</Text>
            </Pressable>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
            >
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={{ backgroundColor: 'gray', borderRadius: 20, padding: 50, aspectRatio: 1 }}>
                        <Pressable>
                            <Text>Dark</Text>
                        </Pressable>
                        <Pressable>
                            <Text>Light</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text>cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}