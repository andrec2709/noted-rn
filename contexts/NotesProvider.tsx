import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import { ListContentType, NoteContentType, Payload } from "@/domain/notes/types";
import { useAppState } from "./AppStateProvider";
import { useGetAllNotes } from "@/application/notes/useGetAllNotes";
import { useNoteRepository } from "@/application/notes/useNoteRepository";
import { useSaveNote } from "@/application/notes/useSaveNote";

type NotesContextType = {
    notes: Payload[];
    reload: () => Promise<void>;
    deleteNotes: (ids: string[]) => Promise<void>;
    changeNotes: (newNotes: Payload[]) => void;
    activeNote: Payload | undefined;
    setActiveNote: React.Dispatch<React.SetStateAction<Payload | undefined>>;
    reconcileVersion: number;
    setReconcileVersion: React.Dispatch<React.SetStateAction<number>>;
    activeNoteRef: RefObject<Payload | undefined>;
    selectedListItem: string;
    setSelectedListItem: React.Dispatch<React.SetStateAction<string>>;
};

const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
    const ctx = useContext(NotesContext);

    if (!ctx) throw new Error('useNotes must be used inside a NotesProvider');

    return ctx;
};

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
    /* 
    Represents the data that is displayed inside app/index.
    */
    const [notes, setNotes] = useState<Payload[]>([]);
    
    /* active note state. Might be removed in the future */
    const [activeNote, setActiveNote] = useState<Payload | undefined>(undefined);
    /* 
    Currently not in use. 
    Is supposed to represent the version of reconciliation with database.
    Might be removed 
    */
    const [reconcileVersion, setReconcileVersion] = useState(0);
    /* 
    Ref of the active note.
    */
    const activeNoteRef = useRef<Payload | undefined>(undefined);
    /* 
    Represents the currently selected item inside of a list note.
    This is used in order to determine keyboard autofocus and
    the visibility of 'delete' icon next to the item.
    */
    const [selectedListItem, setSelectedListItem] = useState('');
    
    const { appStateVisible } = useAppState();
    const getAll = useGetAllNotes();
    const save = useSaveNote();
    const repo = useNoteRepository();

    /**
     * Reloads notes state data, fetching the most recent data from SQLite.
     */
    const reload = async () => {
        const data = await getAll();
        setNotes(data);
    };

    /**
     * Deletes multiple notes by id.
     * @param ids the id of the notes to be deleted
     */
    const deleteNotes = async (ids: string[]) => {
        await repo.deleteAll(ids);
        await reload();
    };

    /**
     * Updates the notes state (data displayed on app/index).
     * @param newNotes new array of notes to set 'notes' to
     */
    const changeNotes = (newNotes: Payload[]) => {
        setNotes(newNotes);
    };

    /* 
    Keep activeNoteRef updated with activeNote state.
    */
    useEffect(() => {
        if (activeNote) {
            activeNoteRef.current = activeNote;
        }
    }, [activeNote]);

    /* 
    Updates the active note on DB when app changes visibility (e.g. goes to background).
    */
    useEffect(() => {   
        if (activeNoteRef.current) {
            if (activeNoteRef.current.type === 'list') {
                const content: ListContentType = {
                    items: activeNoteRef.current.content.items,
                };
                save({...activeNoteRef.current, content: content});

            } else if (activeNoteRef.current.type === 'note') {
                const content: NoteContentType = {
                    html: activeNoteRef.current.content.html,
                    plainText: activeNoteRef.current.content.plainText,
                };
                save({...activeNoteRef.current, content: content});
            }
        }
    }, [appStateVisible]);

    useEffect(() => {
        reload();
    }, []);

    return (
        <NotesContext.Provider value={{
            notes,
            reload,
            deleteNotes,
            changeNotes,
            activeNote,
            setActiveNote,
            reconcileVersion,
            setReconcileVersion,
            activeNoteRef,
            selectedListItem,
            setSelectedListItem,
        }}>
            {children}
        </NotesContext.Provider>
    );
};