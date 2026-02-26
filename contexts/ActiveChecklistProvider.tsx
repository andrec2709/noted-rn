import { ListContentType, ListPayload } from "@/domain/notes/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppState } from "./AppStateProvider";
import { useSaveNote } from "@/application/notes/useSaveNote";

type ChecklistContextValue = {
    activeListRef: React.RefObject<ListPayload | undefined>;
    selectedListItem: string;
    setSelectedListItem: React.Dispatch<React.SetStateAction<string>>;
};

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

export const useChecklist = () => {
    const ctx = useContext(ChecklistContext);
    if (!ctx) throw new Error('useChecklist must be used inside an ActiveChecklistProvider');
    return ctx;
};

export const ActiveChecklistProvider = ({ children }: { children: React.ReactNode }) => {
    const activeListRef = useRef<ListPayload | undefined>(undefined);
    const [selectedListItem, setSelectedListItem] = useState('');
    const { appStateVisible } = useAppState();
    const save = useSaveNote();

    useEffect(() => {
        const list = activeListRef.current;

        if (!list) return;

        const content: ListContentType = {
            items: list.content.items,
        };

        save({ ...list, content });
    }, [appStateVisible]);

    return (
        <ChecklistContext.Provider value={{
            activeListRef,
            selectedListItem,
            setSelectedListItem,
        }}
        >
            {children}
        </ChecklistContext.Provider>
    );
};