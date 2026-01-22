import 'react-native-get-random-values';
import ListItem from '@/components/ui/ListItem';
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { useCallback, useEffect, useMemo, useState } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { useNotes } from "@/contexts/NotesProvider";
import { ListContentType, ListItemType } from "@/domain/notes/types";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from '@/utils';
import { useFocusEffect } from 'expo-router';
import { useKeyboardState } from 'react-native-keyboard-controller';
import { useNotedTheme } from '@/contexts/NotedThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import HeaderGeneric from '@/components/layout/HeaderGeneric';
import { useSaveNote } from '@/application/notes/useSaveNote';


export default function ListScreen() {
    const { activeNoteRef, setSelectedListItem } = useNotes();
    const { Colors } = useNotedTheme();
    const { i18n } = useLanguage();
    const save = useSaveNote();
    if (activeNoteRef.current && activeNoteRef.current.type !== 'list') return null;

    const [isCheckedItemsOpen, setIsCheckedItemsOpen] = useState(true);
    const [submitVersion, setSubmitVersion] = useState(0);
    const ks = useKeyboardState();

    const [data, setData] = useState(activeNoteRef.current?.content.items);
    const checkedItemCount = data?.filter(item => item.checked).length;

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const renderItem = useCallback<SortableGridRenderItem<ListItemType>>(
        ({ item }) => {
            return <ListItem
                content={item.content}
                isChecked={item.checked}
                id={item.id}
                onDelete={handleDeleteItem}
                onPress={handleChangeState}
                onChangeText={handleChangeText}
                onSubmit={() => setSubmitVersion(prev => prev + 1)}
            />
        },
        []
    )

    useEffect(() => {
        if (submitVersion > 0) {
            handleAddItem()
        }
    }, [submitVersion]);

    const handleChangeState = (id: string, state: boolean) => {

        const active = activeNoteRef.current;
        if (!active || active.type !== 'list') return;

        const contentItems = active.content.items;

        if (contentItems && contentItems.length > 0) {
            const filtered = contentItems.filter((item) => item.id === id || item.checked !== state);
            const deletedIndex = filtered.findLastIndex(item => item.id === id);
            const filterSize = filtered.length;
            if (filterSize > 0 && deletedIndex !== -1) {
                console.log('................');
                if (deletedIndex === 0 && filterSize > 1) {
                    setSelectedListItem(filtered[1].id);
                } else if (deletedIndex === filterSize - 1 && filterSize > 1) {
                    setSelectedListItem(filtered[filterSize - 2].id);
                } else if (deletedIndex < filterSize - 1 && deletedIndex > 0) {
                    setSelectedListItem(filtered[deletedIndex - 1].id);
                }
            }
        }
        setData(prev => {
            const newData = prev?.map(item => {
                if (item.id === id) {
                    return { ...item, checked: state };
                }
                return item;
            });
            return newData;
        });
    };

    const handleAddItem = () => {
        const id = uuidv4();
        const item: ListItemType = {
            checked: false,
            content: '',
            id: id,
        };

        setData(prev => {
            if (prev) {
                const newData = prev.slice();
                newData.push(item);
                return newData;
            }
        });

        setSelectedListItem(id);
    };

    const handleDeleteItem = (id: string, checked: boolean) => {

        const active = activeNoteRef.current;
        if (!active || active.type !== 'list') return;

        const contentItems = active.content.items;

        if (contentItems && contentItems.length > 0) {
            const filtered = contentItems.filter((item) => item.id === id || item.checked === checked);
            const deletedIndex = filtered.findLastIndex(item => item.id === id);
            const filterSize = filtered.length;
            if (filterSize > 0 && deletedIndex !== -1) {
                console.log('................');
                if (deletedIndex === 0 && filterSize > 1) {
                    setSelectedListItem(filtered[1].id);
                } else if (deletedIndex === filterSize - 1 && filterSize > 1) {
                    setSelectedListItem(filtered[filterSize - 2].id);
                } else if (deletedIndex < filterSize - 1 && deletedIndex > 0) {
                    setSelectedListItem(filtered[deletedIndex - 1].id);
                }
            }
        }

        setData(prev => {
            const newData = prev?.filter(item => item.id !== id);
            return newData;
        });

    };

    const handleChangeText = (text: string, id: string) => {
        setData(prev => {
            const newData = prev?.map(item => {
                if (item.id === id) {
                    return { ...item, content: text };
                }
                return item;
            });

            return newData;
        });
    };

    const handleChangeTitle = async () => {
        const active = activeNoteRef.current;

        if (active && active.type === 'list') {
            const content: ListContentType = {
                items: active.content.items,
            };

            save({ ...active, content: content });
        }
    };

    const handleUpdateList = async () => {
        const active = activeNoteRef.current;

        if (active && active.type === 'list') {
            const content: ListContentType = {
                items: active.content.items,
            };

            save({ ...active, content: content });
        }
    };

    const debouncedHandleUpdateList = useMemo(() => debounce(handleUpdateList, 500), []);
    const debouncedHandleChangeTitle = useMemo(() => debounce(handleChangeTitle, 500), []);

    useFocusEffect(useCallback(() => {

        return () => {
            setSelectedListItem('');
            const active = activeNoteRef.current;
            if (active && active.type === 'list') {
                const content: ListContentType = {
                    items: active.content.items,
                };

                save({ ...active, content: content });

            }
        };

    }, []));

    useEffect(() => {
        if (data && activeNoteRef.current && activeNoteRef.current.type === 'list') activeNoteRef.current.content.items = data;
        debouncedHandleUpdateList();
    }, [data]);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Colors.background,
        }}
        >
            <HeaderGeneric />
            <GestureHandlerRootView style={{ flex: 1, marginBottom: ks.height }}>
                <Animated.ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    keyboardShouldPersistTaps='always'
                >
                    <TextInput
                        style={[styles.titleInput,
                        {
                            color: Colors.onBackground,
                        }
                        ]}
                        placeholder={i18n.t('placeholderTitle')}
                        placeholderTextColor={Colors.onBackground}
                        defaultValue={activeNoteRef.current?.title || ''}
                        onChangeText={text => {
                            if (activeNoteRef.current) activeNoteRef.current.title = text;
                            debouncedHandleChangeTitle();
                        }}

                    >
                    </TextInput>
                    <Sortable.Grid
                        columns={1}
                        renderItem={renderItem}
                        data={data?.filter(item => !item.checked)!}
                        overDrag="vertical"
                        customHandle
                        activeItemScale={1.05}
                        dragActivationDelay={0}
                        scrollableRef={scrollRef}
                    />
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 20, marginLeft: 15 }}
                        onPress={handleAddItem}
                    >
                        <Entypo name='plus' size={20} color={Colors.onBackground} />
                        <Text style={{ fontSize: 18, fontFamily: 'Inter', color: Colors.onBackground }}>{i18n.t('addListItem')}</Text>
                    </Pressable>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 30, marginLeft: 15 }}
                        onPress={() => setIsCheckedItemsOpen(!isCheckedItemsOpen)}
                    >
                        <Ionicons name={isCheckedItemsOpen ? 'chevron-down' : 'chevron-forward'} size={20} color={Colors.onBackground} />
                        <Text style={{ fontSize: 18, fontFamily: 'Inter', color: Colors.onBackground }}>{i18n.t('checkedItems', { count: checkedItemCount })}</Text>
                    </Pressable>
                    {isCheckedItemsOpen && (
                        <Sortable.Grid
                            columns={1}
                            renderItem={renderItem}
                            data={data?.filter(item => item.checked)!}
                            overDrag="vertical"
                            customHandle
                            activeItemScale={1.05}
                            dragActivationDelay={0}
                            scrollableRef={scrollRef}
                        />
                    )}
                </Animated.ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleInput: {
        fontSize: 30,
        height: 'auto',
        marginHorizontal: 15,
        fontFamily: 'Inter'
    },
});