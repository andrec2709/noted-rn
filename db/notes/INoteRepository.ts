import { NoteType, UnparsedPayload } from "@/domain/notes/types";

export interface INoteRepository {
    create(title: string, content: string, type: NoteType): Promise<UnparsedPayload | null>;
    save(payload: UnparsedPayload): Promise<void>;
    saveAll(payloads: UnparsedPayload[]): Promise<void>;
    getById(id: string): Promise<UnparsedPayload | null>;
    getAll(): Promise<UnparsedPayload[]>;
    delete(id: string): Promise<void>;
    deleteAll(ids: string[]): Promise<void>;
}