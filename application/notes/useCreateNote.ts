import { ContentType, NoteType, Payload } from "@/domain/notes/types";
import { useNoteRepository } from "./useNoteRepository";
import { usePayloadParser } from "./usePayloadParser";

export function useCreateNote() {
    const repo = useNoteRepository();
    const parser = usePayloadParser();

    return async (title: string, content: ContentType, type: NoteType): Promise<Payload | null> => {
        const strContent = parser.unparseContent(content);

        if (!strContent) {
            console.warn('invalid ContentType, cannot create item');
            return null;
        }

        const result = await repo.create(title, strContent, type);
        
        if (result) {
            const parsed = parser.parse(result);
            return parsed;
        }

        return null;
    }
}
