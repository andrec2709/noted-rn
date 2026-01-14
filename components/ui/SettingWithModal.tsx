import { useLanguage } from "@/contexts/LanguageProvider";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

function ModalOption({ opt, setModalVisible }: { opt: optType; setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { Colors } = useNotedTheme();
    return (
        <Pressable
            onPress={() => { opt.callback(); setModalVisible(false) }}
        >
            <Text
                style={{
                    color: Colors.onBackgroundContainer,
                    fontSize: 20,
                    fontFamily: 'Inter'
                }}
            >
                {opt.value}
            </Text>
        </Pressable>
    );
}

type optType = {
    value: string;
    callback: (...args: any) => any;
};

type Props = {
    name: string;
    description: string;
    opts: optType[];
};

export default function SettingWithModal({ name, description, opts }: Props) {
    const { Colors } = useNotedTheme();
    const { i18n } = useLanguage();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Pressable
                style={styles.settingContainer}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.infoContainer}>
                    <Text style={{ color: Colors.onBackground, fontSize: 20, fontFamily: 'Inter' }}>
                        {name}
                    </Text>
                    <Text style={{ color: Colors.onBackground, fontSize: 16, fontFamily: 'Inter' }}>
                        {description}
                    </Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    color={Colors.onBackground}
                    size={24}
                    style={{
                        marginLeft: 'auto',
                    }}
                />
            </Pressable>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
            >
                <View style={[styles.modalContainer, {}]}>
                    <View style={[
                        styles.optContainer,
                        { backgroundColor: Colors.backgroundContainer }
                    ]}
                    >
                        {opts.map(opt => <ModalOption opt={opt} key={opt.value} setModalVisible={setModalVisible} />)}
                        <Pressable
                            onPress={() => setModalVisible(false)}
                        >
                            <Text
                                style={{ color: Colors.onBackgroundContainer, fontSize: 20, fontWeight: 'bold', fontFamily: 'Inter' }}
                            >
                                {i18n.t('cancel')}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    settingContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    infoContainer: {

    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    optContainer: {
        paddingHorizontal: 50,
        paddingVertical: 15,
        minWidth: 100,
        width: '60%',
        maxWidth: 300,
        borderRadius: 5,
        rowGap: 10,
        alignItems: 'center'
    }
});