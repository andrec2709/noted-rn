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

export interface INoteRepository {
    create(title: string, content: string, type: NoteType): Promise<UnparsedPayload | null>;
    save(payload: UnparsedPayload): Promise<void>;
    saveAll(payloads: UnparsedPayload[]): Promise<void>;
    getById(id: string): Promise<UnparsedPayload | null>;
    getAll(): Promise<UnparsedPayload[]>;
    delete(id: string): Promise<void>;
    deleteAll(ids: string[]): Promise<void>;
}