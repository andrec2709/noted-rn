import { useLanguage } from "@/contexts/LanguageProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSearchBar } from "@/contexts/SearchBarProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { NotesRepository } from "@/db/notesRepository";
import { debounce } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CancelIcon from "../icons/CancelIcon";
import DeleteIcon from "../icons/DeleteIcon";
import { useRouter } from "expo-router";

export default function HeaderMain() {
    const { Colors } = useNotedTheme();
    const { isSelecting, setIsSelecting, selectionBuffer, setSelectionBuffer } = useSelection();
    const { deleteNotes, reload, changeNotes } = useNotes();
    const { isSearchBarOpen, setIsSearchBarOpen } = useSearchBar();
    const { i18n } = useLanguage();
    const router = useRouter();

    /**
     *  Reloads data on main screen with notes that match the search term 
     * @param text The search term typed by the user
     * */
    const handleChangeText = async (text: string) => {
        const results = await NotesRepository.getSearchMatches(text);
        changeNotes(results);
    };

    const debouncedHandleChangeText = useMemo(() => debounce(handleChangeText, 350), [handleChangeText]);

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
                        style={[
                            styles.searchBarContainer,
                            { backgroundColor: Colors.backgroundContainer },
                        ]}
                    >

                        <TextInput
                            style={[styles.searchText, { color: Colors.onBackgroundContainer, flex: 1 }]}
                            onChangeText={debouncedHandleChangeText}
                        />
                        <Ionicons
                            name="close"
                            size={20}
                            color={Colors.onBackgroundContainer}
                            style={{ marginLeft: 'auto' }}
                            onPress={() => { setIsSearchBarOpen(false); reload(); }}
                        />

                    </View>
                    :
                    <>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            style={{
                                marginRight: 'auto'
                            }}
                            color={Colors.onBackground}
                            onPress={() => router.navigate('./settings')}
                        />
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
                                        color={Colors.onBackground}
                                        style={{ marginRight: 20 }}
                                    />
                                    <CancelIcon
                                        onPress={() => {
                                            setIsSelecting(false);
                                            setSelectionBuffer([]);
                                        }}
                                        color={Colors.onBackground}
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
                                        Notes
                                    </Text>
                                    <Ionicons
                                        name="search"
                                        size={20}
                                        color={Colors.onBackground}
                                        style={{ marginLeft: 'auto' }}
                                        onPress={() => setIsSearchBarOpen(true)}
                                    />
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10
    },
    searchText: {
        fontFamily: 'Inter',
    },
});