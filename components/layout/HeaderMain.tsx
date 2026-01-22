import { useLanguage } from "@/contexts/LanguageProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSearchBar } from "@/contexts/SearchBarProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { debounce } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { BackHandler, NativeEventSubscription, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CancelIcon from "../icons/CancelIcon";
import DeleteIcon from "../icons/DeleteIcon";
import { useRouter } from "expo-router";
import { Payload } from "@/domain/notes/types";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

export default function HeaderMain() {
    const { Colors } = useNotedTheme();
    const { isSelecting, setIsSelecting, selectionBuffer, setSelectionBuffer } = useSelection();
    const { deleteNotes, reload, changeNotes } = useNotes();
    const { isSearchBarOpen, setIsSearchBarOpen, searcher } = useSearchBar();
    const { i18n } = useLanguage();
    const router = useRouter();
    const width = useSharedValue<`${number}%`>('0%');

    /**
     *  Reloads data on main screen with notes that match the search term 
     * @param text The search term typed by the user
     * */
    const handleChangeText = async (text: string) => {
        const results: Payload[] = await searcher.search(text);
        changeNotes(results);
    };

    const debouncedHandleChangeText = useMemo(() => debounce(handleChangeText, 350), [handleChangeText]);

    const handleGoBack = () => {
        setIsSearchBarOpen(false);
        return true;
    };

    useEffect(() => {
        let subscription: NativeEventSubscription;
        if (isSearchBarOpen) {
            subscription = BackHandler.addEventListener('hardwareBackPress', handleGoBack);
            width.value = withTiming('100%', { duration: 150 });
        } else {
            width.value = withTiming('0%', { duration: 150 });
        }

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [isSearchBarOpen]);

    return (
        <View
            style={[
                styles.headerContainer,
                { backgroundColor: Colors.background },
            ]}
        >
            {
                isSearchBarOpen
                    ?
                    <View
                        style={{
                            justifyContent: 'flex-end',
                            flex: 1,
                            flexDirection: 'row'
                        }}
                    >
                        <Animated.View
                            style={[
                                styles.searchBarContainer,
                                { backgroundColor: Colors.backgroundContainer, width },
                            ]}
                        >

                            <TextInput
                                style={[styles.searchText, { color: Colors.onBackgroundContainer, flex: 1 }]}
                                onChangeText={debouncedHandleChangeText}
                            />
                            <TouchableOpacity
                                onPress={() => { setIsSearchBarOpen(false); reload(); }}
                                style={{ marginLeft: 'auto' }}
                                hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={Colors.onBackgroundContainer}
                                />
                            </TouchableOpacity>

                        </Animated.View>
                    </View>
                    :
                    <>
                        <TouchableOpacity
                            style={{
                                marginRight: 'auto'
                            }}
                            onPress={() => router.navigate('./settings')}
                            hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
                        >
                            <Ionicons
                                name="ellipsis-vertical"
                                size={20}
                                color={Colors.onBackground}
                            />
                        </TouchableOpacity>
                        {
                            isSelecting
                                ?
                                <>
                                    <Text style={[styles.headerText, { marginRight: 20, color: Colors.onBackground }]}>
                                        {i18n.t('selection', { count: selectionBuffer.length })}
                                    </Text>
                                    <DeleteIcon
                                        onPress={async () => {
                                            const ids = selectionBuffer.map(nt => nt.id);

                                            await deleteNotes(ids);
                                            setSelectionBuffer([]);
                                        }}
                                        color={Colors.deleteIcon}
                                        style={{ marginRight: 20 }}
                                    />
                                    <CancelIcon
                                        onPress={() => {
                                            setIsSelecting(false);
                                            setSelectionBuffer([]);
                                        }}
                                        color={Colors.deleteIcon}
                                    />
                                </>
                                :
                                <>
                                    <Text
                                        style={[
                                            styles.headerText,
                                            { color: Colors.onBackground },
                                        ]}
                                    >
                                        {i18n.t('notes')}
                                    </Text>
                                    <TouchableOpacity
                                        style={{ marginLeft: 'auto' }}
                                        onPress={() => setIsSearchBarOpen(true)}
                                        hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
                                    >
                                        <Ionicons
                                            name="search"
                                            size={20}
                                            color={Colors.onBackground}
                                        />
                                    </TouchableOpacity>
                                </>
                        }
                    </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        height: 56,
    },
    headerText: {
        fontFamily: 'Inter',
        fontSize: 18
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10
    },
    searchText: {
        fontFamily: 'Inter',
    },
});