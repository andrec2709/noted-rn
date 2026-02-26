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
    
    const getAll = useGetAllNotes();
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

    useEffect(() => {
        reload();
    }, []);

    return (
        <NotesContext.Provider value={{
            notes,
            reload,
            deleteNotes,
            changeNotes,
        }}>
            {children}
        </NotesContext.Provider>
    );
};