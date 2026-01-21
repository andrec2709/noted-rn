import { ContentType, NoteContentType, NoteType, Payload, UnparsedPayload } from "@/types/notes";
import { sqliteRepo } from "./notesRepository"
import payloadParser from "./PayloadParser";
import sorter from './Sorter';
import searcher from "./Searcher";

export function useSorter() {
    return sorter;
}

export function usePayloadParser() {
    return payloadParser;
}

export function useNoteRepository() {
    return sqliteRepo;
}

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

export function useGetAllNotes() {
    const repo = useNoteRepository();
    const parser = usePayloadParser();

    return async () => {
        const result = await repo.getAll();
        const parsedResult: Payload[] = [];
        for (const payload of result) {
            const parsed = parser.parse(payload);
            if (parsed) {
                parsedResult.push(parsed);
            }
        }
        return parsedResult;
    };
}

export function useGetNoteById() {
    const repo = useNoteRepository();
    const parser = usePayloadParser();

    return async (id: string) => {
        const result = await repo.getById(id);

        if (!result) {
            return null;
        }

        return parser.parse(result);
    };
}

export function useSearch() {
    return searcher;
}

export function useSaveNote() {
    const repo = useNoteRepository();
    const parser = usePayloadParser();

    return async (payload: Payload) => {
        const unparsed: UnparsedPayload = parser.unparse(payload);

        await repo.save(unparsed);
    };
}
