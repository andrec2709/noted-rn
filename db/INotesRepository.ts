import { ListContentType, NoteContentType, Payload, NoteType, UnparsedPayload } from "@/types/notes";

export interface INotesRepository {
    getAllNotes(): Promise<Payload[]>;
    createNote(title: string, content: NoteContentType | ListContentType, type: NoteType): Promise<Payload | null>;
    updateNoteContent(id: string, title: string, content: NoteContentType | ListContentType): Promise<void>;
    deleteNote(id: string): Promise<void>;
    getHighestSortOrder(): Promise<Payload | null>;
    parseUnparsedPayload(unparsed: UnparsedPayload): Payload;
    getLowestSortOrder(): Promise<Payload | null>;
    updateSortOrder(id: string, sortOrder: number): Promise<void>;
    normalizeSortOrder(): Promise<void>;
    swapSortOrders(id1: string, sortOrder1: number, id2: string, sortOrder2: number): Promise<void>;
    getNote(id: string): Promise<Payload | null>;
    getSearchMatches(text: string): Promise<Payload[]>;
    deleteAllNotes(): Promise<void>;
}