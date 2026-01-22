import { SortOrderType } from "@/domain/notes/sorter/types";
import { ISorterRepository } from "./ISorterRepository";
import { SQLiteDbStarter } from "../SQLiteDbStarter";

export class SQLiteSorterRepository implements ISorterRepository {
    constructor(private starter: SQLiteDbStarter) {}

    async getAll(): Promise<SortOrderType[]> {
        const items = await this.starter.db.getAllAsync<SortOrderType>(`SELECT id, sort_order FROM notes ORDER BY sort_order ASC`);
        return items;
    }

    async save(item: SortOrderType): Promise<void> {
        await this.starter.db.runAsync(`UPDATE notes SET sort_order = ? WHERE id = ?`, item.sort_order, item.id);
    }

    async saveAll(items: SortOrderType[]): Promise<void> {
        await this.starter.db.withTransactionAsync(async () => {
            for (const item of items) {
                await this.save(item);
            }
        });
    }

    async getSortOrder(id: string): Promise<SortOrderType | null> {
        const item = await this.starter.db.getFirstAsync<SortOrderType>(`SELECT id, sort_order FROM notes WHERE id = ?`, id);
        return item;
    }

    async getHighest(): Promise<SortOrderType | null> {
        const items = (await this.getAll()).sort((a, b) => b.sort_order - a.sort_order);
        
        if (items.length > 0) {
            return items[0];
        }

        return null;
    }

    async getLowest(): Promise<SortOrderType | null> {
        const items = (await this.getAll()).sort((a, b) => a.sort_order - b.sort_order);

        if (items.length > 0) {
            return items[0];
        }

        return null;
    }
}
