import { UnparsedPayload } from "@/types/notes";
import { sqliteRepo } from "./notesRepository"

function createNote(data: {title: string; content: string;}) {}

export function useNoteRepository() {
    return sqliteRepo;
}

export function useCreateNote() {
    const repo = useNoteRepository();

    return async (data: UnparsedPayload) => {
        await repo.save(data);
    }
}
