import { Payload, UnparsedPayload } from "@/domain/notes/types";
import { useNoteRepository } from "./useNoteRepository";
import { usePayloadParser } from "./usePayloadParser";

export function useSaveNote() {
    const repo = useNoteRepository();
    const parser = usePayloadParser();

    return async (payload: Payload) => {
        const unparsed: UnparsedPayload = parser.unparse(payload);

        await repo.save(unparsed);
    };
}
