import { SortOrderType } from "@/domain/notes/sorter/types";

export interface ISorterRepository {
    getAll(): Promise<SortOrderType[]>;
    save(item: SortOrderType): Promise<void>;
    saveAll(items: SortOrderType[]): Promise<void>;
    getSortOrder(id: string): Promise<SortOrderType | null>;
    getHighest(): Promise<SortOrderType | null>;
    getLowest(): Promise<SortOrderType | null>;
}

