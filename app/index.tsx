import ListIcon from "@/components/icons/ListIcon";
import NoteIcon from "@/components/icons/NoteIcon";
import HeaderMain from "@/components/layout/HeaderMain";
import ItemPreview from "@/components/ui/ItemPreview";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { NotesRepository } from "@/db/notesRepository";
import { Payload } from "@/types/notes";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Sortable, { SortableGridDragEndParams, SortableGridRenderItem } from "react-native-sortables";
import Svg, { Path } from "react-native-svg";
import Debugger from "@/components/ui/Debugger";

export default function Index() {
  const router = useRouter();
  const { Colors } = useNotedTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const { notes, reload, setActiveNote } = useNotes();
  const { isSelecting } = useSelection();
  const [isAdding, setIsAdding] = useState(false);

  const handleScreenFocus = useCallback(() => {
    reload();
  }, []);

  useFocusEffect(handleScreenFocus);

  const renderItem = useCallback<SortableGridRenderItem<Payload>>(
    ({ item }) => {
      return <ItemPreview title={item.title} contentPreview={item.type === 'list' ? '' : item.content.plainText} key={item.id} type={item.type} id={item.id} payload={item} />;
    }
    , []);

  const handleDragEnd = async ({ key, fromIndex, toIndex, indexToKey, keyToIndex, data }: SortableGridDragEndParams<Payload>) => {

    const prevIndex = toIndex === 0 ? 0 : toIndex - 1;
    const nextIndex = toIndex === data.length - 1 ? data.length - 1 : toIndex + 1;
    let newSortOrder;

    const prevItem = data[prevIndex];
    const nextItem = data[nextIndex];
    const selfItem = data[toIndex];
    let selfSO = selfItem.sort_order;
    let prevSO = prevItem.sort_order;
    let nextSO = nextItem.sort_order;
    const isFirst = prevItem.id === selfItem.id;
    const isLast = nextItem.id === selfItem.id;
    // item is first on the list
    if (isFirst) {
      if (selfSO > nextSO) {
        await NotesRepository.swapSortOrders(selfItem.id, selfSO, nextItem.id, nextSO);
      }
    } else if (isLast) {
      if (selfSO < prevSO) {
        await NotesRepository.swapSortOrders(selfItem.id, selfSO, prevItem.id, prevSO);
      }
    } else {
      newSortOrder = (prevSO + nextSO) / 2;
      await NotesRepository.updateSortOrder(selfItem.id, newSortOrder);
    }

    await reload();

  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}

    >
      <HeaderMain />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 5 }}>
          <Sortable.Grid
            columns={1}
            rowGap={5}
            data={notes}
            renderItem={renderItem}
            overDrag='vertical'
            activeItemScale={1.05}
            dragActivationDelay={0}
            scrollableRef={scrollRef}
            customHandle
            onDragEnd={handleDragEnd}
          />
        </Animated.ScrollView>
        {
          // Displays FAB if not in selection mode
          !isSelecting && (
            <View
              style={styles.addContainer}
            >
              {
                // Displays options when user is adding
                isAdding && (
                  <View style={styles.optContainer}>
                    <Pressable
                      style={[styles.addOpt, { backgroundColor: Colors.primary }]}
                      onPress={async () => {
                        const newNote = await NotesRepository.createNote('', { items: [] }, 'list');

                        if (newNote) {
                          setActiveNote(newNote);
                          router.navigate('./list');
                        }
                      }}
                    >
                      <ListIcon color={Colors.onPrimary} size={24} />
                      <Text
                        style={[styles.addOptText, { color: Colors.onPrimary }]}
                      >Add list</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.addOpt, { backgroundColor: Colors.primary }]}
                      onPress={async () => {
                        const newNote = await NotesRepository.createNote('', { html: '', plainText: '' }, 'note');
                        
                        if (newNote) {
                          setActiveNote(newNote);
                          router.navigate('./note');
                        }
                      }}
                    >
                      <NoteIcon color={Colors.onPrimary} size={24} />
                      <Text
                        style={[styles.addOptText, { color: Colors.onPrimary }]}
                      >Add note</Text>
                    </Pressable>
                  </View>
                )
              }
              <Pressable
                style={[styles.addButton, { backgroundColor: Colors.primary }]}
                onPress={() => {
                  setIsAdding(!isAdding);
                }}
              >
                <Svg
                  // xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={48}
                  fill={Colors.onPrimary}
                  viewBox="0 -960 960 960"
                >
                  <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </Svg>
              </Pressable>
            </View>
          )
        }
        <Debugger />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    rowGap: 30,
  },
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
  optContainer: {
    rowGap: 10,
    position: 'relative',
  },
  addOptText: {
    fontSize: 16,
    fontFamily: 'Inter'
  },
  addButton: {
    borderRadius: 40,
    aspectRatio: 1,
    width: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end'
  }
});