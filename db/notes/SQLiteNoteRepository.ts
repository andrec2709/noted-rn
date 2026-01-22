import { ISorter } from "@/domain/notes/sorter/ISorter";
import { NoteType, UnparsedPayload } from "@/domain/notes/types";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import sorter from '../../domain/notes/sorter/Sorter';
import sqliteDb, { SQLiteDbStarter } from "../SQLiteDbStarter";
import { INoteRepository } from './INoteRepository';


export class SQLiteNoteRepository implements INoteRepository {

    constructor(private starter: SQLiteDbStarter, private sorter: ISorter) {}

    async create(title: string, content: string, type: NoteType): Promise<UnparsedPayload | null> {
        const id = uuidv4();
        const sortOrder = await this.sorter.create();

        const result = await this.starter.db.runAsync(
            `INSERT INTO notes (id, title, content, type, sort_order) VALUES (?, ?, ?, ?, ?)`,
            id, title, content, type, sortOrder
        )

        if (result.changes > 0 && result.lastInsertRowId !== undefined) {
            const createdItem = await this.getById(id);
            return createdItem;
        }

        return null;
    }

    async save(payload: UnparsedPayload): Promise<void> {
        const id = payload.id;
        const title = payload.title;
        const content = payload.content;
        const sortOrder = payload.sort_order;

        await this.starter.db.runAsync('UPDATE notes SET title = ?, content = ?, sort_order = ? WHERE id = ?', title, content, sortOrder, id);
    }

    async saveAll(payloads: UnparsedPayload[]): Promise<void> {
        await this.starter.db.withTransactionAsync(async () => {
            for (const payload of payloads) {
                await this.save(payload);
            }
        });
    }

    async getById(id: string): Promise<UnparsedPayload | null> {
        const payload = this.starter.db.getFirstAsync<UnparsedPayload>('SELECT * FROM notes WHERE id = ?', id);
        return payload;
    }

    async getAll(): Promise<UnparsedPayload[]> {
        const notes = await this.starter.db.getAllAsync<UnparsedPayload>('SELECT * FROM notes ORDER BY sort_order ASC');
        return notes;
    }

    async delete(id: string): Promise<void> {
        await this.starter.db.runAsync('DELETE FROM notes WHERE id = ?', id);
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.starter.db.withTransactionAsync(async () => {
            for (const id of ids) {
                await this.delete(id);
            }
        });
    }
}

export const sqliteRepo = new SQLiteNoteRepository(sqliteDb, sorter);

export default sqliteRepo;