import ListIcon from "@/components/icons/ListIcon";
import NoteIcon from "@/components/icons/NoteIcon";
import HeaderMain from "@/components/layout/HeaderMain";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { NoteType, Payload } from "@/domain/notes/types";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, NativeEventSubscription, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Sortable, { SortableGridDragEndParams, SortableGridRenderItem } from "react-native-sortables";
import { useLanguage } from "@/contexts/LanguageProvider";
import NotePreview from "@/components/ui/NotePreview";
import ListPreview from "@/components/ui/ListPreview";
import { useCreateNote } from "@/application/notes/useCreateNote";
import { useSorter } from "@/application/notes/useSorter";
import { useSearchBar } from "@/contexts/SearchBarProvider";
import AddButton from "@/components/ui/AddButton";
import AddButtonOpt from "@/components/ui/AddButtonOpt";

export default function Index() {
  const router = useRouter();
  const { Colors } = useNotedTheme();
  const { i18n } = useLanguage();
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const { notes, reload, setActiveNote } = useNotes();
  const { isSelecting } = useSelection();
  const [isAdding, setIsAdding] = useState(false);
  const createNote = useCreateNote();
  const sorter = useSorter();
  const { isSearchBarOpen } = useSearchBar();

  const AnimatedAddButton = Animated.createAnimatedComponent(AddButton);
  const rotation = useSharedValue(0);
  const bottom = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const animatedStyleAddButton = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const resetAddingState = () => {
    setIsAdding(false);
    rotation.value = withTiming(0, { duration: 150 });
    opacity.value = withTiming(0, { duration: 150 });
    bottom.value = withTiming(-50, { duration: 150 });
  };

  const handleScreenFocus = useCallback(() => {
    reload();

    return () => {
      resetAddingState();
    };
  }, []);

  useFocusEffect(handleScreenFocus);

  const renderItem = useCallback<SortableGridRenderItem<Payload>>(
    ({ item }) => {
      switch (item.type) {
        case 'list':
          return <ListPreview key={item.id} payload={item} />;
        case 'note':
          return <NotePreview key={item.id} payload={item} />;
      }
    }
    , []);

  const handleDragEnd = async ({ key, fromIndex, toIndex, indexToKey, keyToIndex, data }: SortableGridDragEndParams<Payload>) => {
    const isSingle = data.length === 1;

    if (fromIndex === toIndex) {
      return;
    }
    if (isSingle) {
      return;
    }

    if (toIndex === 0) {
      await sorter.moveBefore(key, data[1].id);
    } else if (toIndex === data.length - 1) {
      await sorter.moveAfter(key, data[data.length - 2].id);
    } else {
      await sorter.moveAfter(key, data[toIndex - 1].id);
    }

    await reload();
  };

  const handleAdd = async (type: NoteType) => {
    let newNote;
    let route: Href;

    switch (type) {
      case 'note':
        newNote = await createNote('', { html: '', plainText: '' }, 'note');
        route = './note';
        break;
      case 'list':
        newNote = await createNote('', { items: [] }, 'list');
        route = './list';
        break;
    }

    if (newNote) {
      setActiveNote(newNote);
      router.navigate(route);
    }
  };

  const handleGoBack = () => {
    resetAddingState();
    return true;
  };

  useEffect(() => {
    let subscription: NativeEventSubscription;
    if (isAdding) {
      subscription = BackHandler.addEventListener('hardwareBackPress', handleGoBack);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    }
  }, [isAdding]);

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
          (!isSelecting && !isSearchBarOpen) && (
            <View
              style={styles.addContainer}
            >
              {
                // Displays options when user is adding
                isAdding && (
                  <Animated.View
                    style={[
                      styles.optContainer,
                      {
                        bottom,
                        opacity
                      }
                    ]}>
                    <AddButtonOpt text={i18n.t('addList')} Icon={ListIcon} onPress={() => handleAdd('list')} />
                    <AddButtonOpt text={i18n.t('addNote')} Icon={NoteIcon} onPress={() => handleAdd('note')} />
                  </Animated.View>
                )
              }
              <AnimatedAddButton
                onPress={() => {
                  rotation.value = rotation.value === 0 ? withTiming(90, { duration: 150 }) : withTiming(0, { duration: 150 });
                  bottom.value = bottom.value === -50 ? withTiming(0, { duration: 150 }) : withTiming(-50, { duration: 150 });
                  opacity.value = opacity.value === 0 ? withTiming(100, { duration: 150 }) : withTiming(0, { duration: 150 });

                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setIsAdding(!isAdding);
                    });
                  });
                }}
                style={animatedStyleAddButton}
              />
            </View>
          )
        }
        {/* <Debugger /> */}
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
  optContainer: {
    rowGap: 10,
    position: 'relative',
  },
});