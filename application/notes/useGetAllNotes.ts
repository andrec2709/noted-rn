import { Payload } from "@/domain/notes/types";
import { useNoteRepository } from "./useNoteRepository";
import { usePayloadParser } from "./usePayloadParser";

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
