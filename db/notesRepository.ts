import 'react-native-get-random-values';
import { ListContentType, NoteContentType, Payload, NoteType, UnparsedPayload } from "@/types/notes";
import { db } from ".";
import { v4 as uuidv4 } from 'uuid';
import { INotesRepository, NoteRepository } from './INotesRepository';
import * as SQLite from 'expo-sqlite';

// export const NotesRepository: INotesRepository = {
//     async createNote(
//         title: string,
//         content: NoteContentType | ListContentType,
//         type: NoteType = 'note',
//     ) {
//         const id = uuidv4();
//         const hSortOrder = await this.getHighestSortOrder();
//         let sortOrder;

//         if (!hSortOrder) sortOrder = 0;
//         else sortOrder = hSortOrder.sort_order + 10;

//         await db.runAsync(`
//           INSERT INTO notes (id, title, content, type, sort_order)
//           VALUES (?, ?, ?, ?, ?)
//         `, id, title, JSON.stringify(content), type, sortOrder);

//         const payload: Payload | null = await this.getNote(id);
//         return payload;
//     },

//     async getAllNotes(): Promise<Payload[]> {
//         const allNotesUnparsed: UnparsedPayload[] = await db.getAllAsync(`SELECT * FROM notes ORDER BY sort_order ASC`);
//         const allNotes = allNotesUnparsed.map(nt => {

//             return this.parseUnparsedPayload(nt);
//         });

//         return allNotes;
//     },

//     async updateNoteContent(
//         id: string,
//         title: string,
//         content: NoteContentType | ListContentType,
//     ) {
//         console.log('saving for id ', id);
//         console.log('saving...');
//         await db.runAsync(
//             `UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
//             title, JSON.stringify(content), id,
//         );
//     },

//     async deleteNote(noteId: string) {
//         await db.runAsync(
//             `DELETE FROM notes WHERE id = ?`,
//             noteId
//         );
//     },

//     parseUnparsedPayload(unparsed: UnparsedPayload) {

//         const content = JSON.parse(unparsed.content);

//         if (unparsed.type === 'note') {
//             return { ...unparsed, type: 'note' as const, content: content as NoteContentType };
//         }

//         return { ...unparsed, type: 'list' as const, content: content as ListContentType };
//     },

//     async getHighestSortOrder() {
//         const result: UnparsedPayload | null = await db.getFirstAsync(`SELECT * FROM notes ORDER BY sort_order DESC LIMIT 1;`);


//         if (result) return this.parseUnparsedPayload(result);

//         return null;
//     },

//     async getLowestSortOrder() {
//         const result: UnparsedPayload | null = await db.getFirstAsync(`SELECT * FROM notes ORDER BY sort_order ASC LIMIT 1;`);


//         if (result) return this.parseUnparsedPayload(result);

//         return null;
//     },

//     async updateSortOrder(id: string, sortOrder: number) {
//         await db.runAsync(`UPDATE notes SET sort_order = ? WHERE id = ?;`, sortOrder, id);
//     },

//     async normalizeSortOrder() {
//         const allNotes = await NotesRepository.getAllNotes();

//         let value = 0;

//         for (const note of allNotes) {
//             await this.updateSortOrder(note.id, value);
//             value += 10;
//         }
//     },

//     async swapSortOrders(id1: string, sortOrder1: number, id2: string, sortOrder2: number) {
//         const sentinel = Math.random() * -10000;

//         await this.updateSortOrder(id1, sentinel);
//         await this.updateSortOrder(id2, sortOrder1);
//         await this.updateSortOrder(id1, sortOrder2);

//     },

//     async getNote(id: string) {
//         const note: UnparsedPayload | null = await db.getFirstAsync(`SELECT * FROM notes WHERE id = ?;`, id);
//         if (note) {
//             return this.parseUnparsedPayload(note);
//         }
//         return null;
//     },

//     async getSearchMatches(text: string) {
//         const search = `*${text}*`;
//         const unparsed: UnparsedPayload[] = await db.getAllAsync(`SELECT * FROM notes WHERE title GLOB ? OR content GLOB ?;`, search, search);
//         const parsed: Payload[] = unparsed.map(nt => this.parseUnparsedPayload(nt));
//         return parsed;
//     },

//     async deleteAllNotes() {
//         await db.runAsync(`DELETE FROM notes;`);
//     },

// }


export class SQLiteNoteRepository implements NoteRepository {
    private static instance: SQLiteNoteRepository | undefined;
    private db = SQLite.openDatabaseSync('notes.db');

    private constructor() {
        this.initDb();
    }

    public static getInstance(): SQLiteNoteRepository {
        if (SQLiteNoteRepository.instance === undefined) {
            SQLiteNoteRepository.instance = new SQLiteNoteRepository();
        }

        return SQLiteNoteRepository.instance;
    }

    private async initDb() {
        await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
        id TEXT NOT NULL PRIMARY KEY, 
        title TEXT,
        content TEXT,
        type TEXT NOT NULL DEFAULT 'note',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        sort_order INTEGER NOT NULL UNIQUE
      );
    `);
    }

    async save(payload: UnparsedPayload): Promise<void> {
        const id = payload.id;
        const title = payload.title;
        const content = payload.content;
        const sortOrder = payload.sort_order;

        await this.db.runAsync('UPDATE notes SET title = ?, content = ?, sort_order = ? WHERE id = ?', title, content, sortOrder, id);
    }

    async saveAll(payloads: UnparsedPayload[]): Promise<void> {
        this.db.withTransactionAsync(async () => {
            for (const payload of payloads) {
                await this.save(payload);
            }
        });
    }

    async getById(id: string): Promise<UnparsedPayload | null> {
        const payload = this.db.getFirstAsync<UnparsedPayload>('SELECT * FROM notes WHERE id = ?', id);
        return payload;
    }

    async getAll(): Promise<UnparsedPayload[]> {
        const notes = await this.db.getAllAsync<UnparsedPayload>('SELECT * FROM notes ORDER BY sort_order ASC');
        return notes;
    }
}

export const sqliteRepo = SQLiteNoteRepository.getInstance();