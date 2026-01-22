import { UnparsedPayload, Payload, ContentType } from "../types";

export interface IPayloadParser {
    parse(payload: UnparsedPayload): Payload | null;
    unparse(payload: Payload): UnparsedPayload;
    parseContent(content: string): ContentType | null;
    unparseContent(content: ContentType): string | null;
}
