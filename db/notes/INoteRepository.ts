import { NoteType, UnparsedPayload } from "@/domain/notes/types";

/**
 * Provides database functionality related to note operations, like save, read, delete, create.
 */
export interface INoteRepository {
    /**
     * Creates a new note and persists it to the database
     * @param title title of the note
     * @param content content of the note
     * @param type the type of the note
     * @returns A promise of the created item as {@link UnparsedPayload}, or null if it fails
     */
    create(title: string, content: string, type: NoteType): Promise<UnparsedPayload | null>;

    /**
     * Persists the given payload to the database
     * @param payload The item to be saved
     */
    save(payload: UnparsedPayload): Promise<void>;

    /**
     * Persists the given payloads to the database
     * @param payloads The items to be saved
     */
    saveAll(payloads: UnparsedPayload[]): Promise<void>;

    /**
     * Retrieves information of an item based on its id
     * @param id the id of the item to retrieve
     * @returns A promise of the item or null if it fails
     */
    getById(id: string): Promise<UnparsedPayload | null>;

    /**
     * Gets all items from the database
     * @returns an array with the items
     */
    getAll(): Promise<UnparsedPayload[]>;

    /**
     * Deletes an item from the database based on its id
     * @param id the id of the item to be deleted
     */
    delete(id: string): Promise<void>;

    /**
     * Deletes items from the database based on the provided id's
     * @param ids an array of the id's to be deleted
     */
    deleteAll(ids: string[]): Promise<void>;
}