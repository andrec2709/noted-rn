import { UnparsedPayload, Payload, ContentType } from "../types";

export interface IPayloadParser {
    /**
     * Parses an {@link UnparsedPayload} into a {@link Payload}.
     * @param payload the payload to parse
     * @returns the parsed payload, or null if it fails
     */
    parse(payload: UnparsedPayload): Payload | null;

    /**
     * Unparses a {@link Payload} into an {@link UnparsedPayload}.
     * @param payload the payload to unparse
     * @returns the unparsed payload, or null if it fails
     */
    unparse(payload: Payload): UnparsedPayload;

    /**
     * Parses a string into a {@link ContentType}.
     * @param content the content to parse
     * @returns the parsed content, or null if it fails.
     */
    parseContent(content: string): ContentType | null;
    
    /**
     * Unparses a {@link ContentType} into a string.
     * @param content the content to unparse
     * @returns the unparsed content, or null if it fails.
     */
    unparseContent(content: ContentType): string | null;
}
