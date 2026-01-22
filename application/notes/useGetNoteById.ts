import { useNoteRepository } from "./useNoteRepository";
import { usePayloadParser } from "./usePayloadParser";

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
