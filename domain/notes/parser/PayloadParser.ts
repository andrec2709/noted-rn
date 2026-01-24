import { ContentType, ListContentType, NoteContentType, Payload, UnparsedPayload } from "@/domain/notes/types";
import { IPayloadParser } from "./IPayloadParser";

export class PayloadParser implements IPayloadParser {

    private isNoteContent(x: any): x is NoteContentType {
        return typeof x?.html === 'string' && typeof x?.plainText === 'string';
    }

    private isListContent(x: any): x is ListContentType {
        return Array.isArray(x?.items);
    }

    parse(payload: UnparsedPayload): Payload | null {
        const parsed: ContentType = JSON.parse(payload.content);
        
        if (payload.type === 'note' && this.isNoteContent(parsed)) {
            return {...payload, type: 'note', content: parsed};
        } 
        
        if (payload.type === 'list' && this.isListContent(parsed)) {
            return {...payload, type: 'list', content: parsed};
        }

        console.warn('payload is invalid and cannot be parsed');
        return null;
    }

    unparse(payload: Payload): UnparsedPayload {
        return {...payload, content: JSON.stringify(payload.content)};
    }

    parseContent(content: string): ContentType | null {
        const parsed: ContentType = JSON.parse(content);

        if (this.isNoteContent(parsed)) {
            return parsed;
        } else if (this.isListContent(parsed)) {
            return parsed;
        }

        return null;
    }

    unparseContent(content: ContentType): string | null {
        if (this.isNoteContent(content) || this.isListContent(content)) {
            return JSON.stringify(content);
        }
        return null;
    }
}

export const payloadParser = new PayloadParser();

export default payloadParser;