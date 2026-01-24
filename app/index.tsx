import ListIcon from "@/components/icons/ListIcon";
import NoteIcon from "@/components/icons/NoteIcon";
import HeaderMain from "@/components/layout/HeaderMain";
import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { useNotes } from "@/contexts/NotesProvider";
import { useSelection } from "@/contexts/SelectionProvider";
import { NoteType, Payload } from "@/domain/notes/types";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Modal, NativeEventSubscription, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  /*
  Contexts 
  */
  const { notes, reload, setActiveNote } = useNotes();
  const { Colors } = useNotedTheme();
  const { i18n } = useLanguage();
  const { isSelecting } = useSelection();
  const { isSearchBarOpen, setIsSearchBarOpen } = useSearchBar();

  /* 
  Use cases / hooks
  */
  const router = useRouter();
  const createNote = useCreateNote();
  const sorter = useSorter();
  const insets = useSafeAreaInsets();

  /* 
  Animation / state of the add button and its options.
  */
  const [isAdding, setIsAdding] = useState(false);
  const AnimatedAddButton = Animated.createAnimatedComponent(AddButton);
  const rotation = useSharedValue(0);
  const bottom = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const animatedStyleAddButton = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  /* 
  Others 
  */
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  /**
   * Resets the animations and state of the add button.
   */
  const resetAddingState = () => {
    setIsAdding(false);
    rotation.value = withTiming(0, { duration: 150 });
    opacity.value = withTiming(0, { duration: 150 });
    bottom.value = withTiming(-50, { duration: 150 });
  };

  /**
   * @function
   * Passed as a callback for a useFocusEffect.
   * 
   * Reloads the notes' data when the screen is focused.
   * 
   * On blur, resets animations and state of the add button (by calling {@link resetAddingState}), and closes the search bar if it is opened.
   */
  const handleScreenFocus = useCallback(() => {
    reload();

    return () => {
      resetAddingState();
      setIsSearchBarOpen(false);
    };
  }, []);

  useFocusEffect(handleScreenFocus);

  /**
   * @function
   * Determines how the data of the sortable grid is to be rendered.
   */
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


  /**
   * @function
   * Callback called when the onDragEnd event is called by {@link Sortable.Grid}.
   * 
   * This function uses the {@link useSorter} use case by passing its intent to reorder items.
   * 
   * @param params Parameters passed as {@link SortableGridDragEndParams}.
   * @returns 
   */
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

  /**
   * @function
   * This function passes its intent to create a new note by using the {@link useCreateNote} use case.
   * 
   * If creation is successful, it navigates to the relevant screen.
   * 
   * @param type type of note to be created (as defined in {@link NoteType})
   */
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

  /**
   * @function
   * This function resets state of the add button when the user presses the "back" hardware (effectively "closing" the add button options).
   * 
   * It is used as an event handler for {@link BackHandler.addEventListener} "hardwareBackPress" event.
   * 
   * @returns always returns true as this return value tells BackHandler to stop bubbling up events.
   */
  const handleGoBack = () => {
    resetAddingState();
    return true;
  };

  useEffect(() => {
    let subscription: NativeEventSubscription;
    if (isAdding) {
      /* 
      This event is only added when the user has activated the add button (displaying its options).
      It is a way to make it possible to press the back hardware to close the add button options.
      */
      subscription = BackHandler.addEventListener('hardwareBackPress', handleGoBack);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    }
  }, [isAdding]);

  return (
    <>
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
          {/* <Debugger /> */}
        </GestureHandlerRootView>
      </SafeAreaView>
      {
        isAdding && (
          <Pressable
            onPress={resetAddingState}
            style={[
              styles.backdrop,
              { backgroundColor: Colors.backdrop },
            ]}
          >
          </Pressable>
        )
      }
      {
        // Displays FAB if not in selection mode
        (!isSelecting && !isSearchBarOpen) && (
          <View
            style={[
              styles.addContainer,
              {
                bottom: insets.bottom + 40,
                right: insets.right + 20,
              }
            ]}
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
                  ]}
                >
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
    </>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    position: 'absolute',
    rowGap: 30,
  },
  optContainer: {
    rowGap: 10,
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    opacity: .4,
  },
});