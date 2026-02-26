import { ListContentType, ListPayload, NoteContentType, NotePayload } from "@/domain/notes/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppState } from "./AppStateProvider";
import { useSaveNote } from "@/application/notes/useSaveNote";
import sanitize from "sanitize-html";
import { convert } from "html-to-text";

type NoteContextValue = {
    activeNoteRef: React.RefObject<NotePayload | undefined>;
};

const NoteContext = createContext<NoteContextValue | null>(null);

export const useNote = () => {
    const ctx = useContext(NoteContext);
    if (!ctx) throw new Error('useNote must be used inside an ActiveNoteProvider');
    return ctx;
};

export const ActiveNoteProvider = ({ children }: { children: React.ReactNode }) => {
    const activeNoteRef = useRef<NotePayload | undefined>(undefined);
    const { appStateVisible } = useAppState();
    const save = useSaveNote();

    useEffect(() => {
        const note = activeNoteRef.current;

        if (!note) return;

        const html = sanitize(note.content.html, {
            allowedTags: sanitize.defaults.allowedTags.concat(['html']),
        });

        const plainText = convert(html);
        const content: NoteContentType = {
            html,
            plainText,
        };

        save({ ...note, content });
    }, [appStateVisible]);

    return (
        <NoteContext.Provider value={{
            activeNoteRef,
        }}
        >
            {children}
        </NoteContext.Provider>
    );
};