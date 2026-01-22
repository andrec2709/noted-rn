import { truncateDecimals } from "@/utils";
import sqliteDb from "../../../db/SQLiteDbStarter";
import { ISorter } from "./ISorter";
import { ISorterRepository } from "@/db/sorter/ISorterRepository";
import { SQLiteSorterRepository } from "@/db/sorter/SQLiteSorterRepository";


export class Sorter implements ISorter {

    private readonly NORMALIZATION_BASE: number = 100;
    private readonly NORMALIZATION_STEP: number = 10;
    private readonly NORMALIZATION_THRESHOLD: number = .01;
    private readonly NORMALIZATION_DECIMAL_COUNT: number = this.NORMALIZATION_THRESHOLD.toString(10).split('.')[1]?.length ?? 0;

    constructor(private repo: ISorterRepository) {}

    async normalize(): Promise<void> {
        console.log('HERE___normalizer()')
        const notes = await this.repo.getAll();
        let value = this.NORMALIZATION_BASE;
        let sentinelValue = -9999;
        let newNotes = [];

        for (const note of notes) {
            note.sort_order = sentinelValue;
            newNotes.push(note);
            sentinelValue += this.NORMALIZATION_STEP;
        }

        await this.repo.saveAll(newNotes);

        newNotes = [];

        for (const note of notes) {
            note.sort_order = value;
            newNotes.push(note);
            value += this.NORMALIZATION_STEP;
        }

        await this.repo.saveAll(newNotes);
    }

    async create(): Promise<number> {
        const highest = await this.repo.getHighest();

        if (highest) {
            return highest.sort_order + this.NORMALIZATION_STEP;
        }

        return this.NORMALIZATION_BASE;
    }

    async moveAfter(targetId: string, afterId: string): Promise<void> {
        
        const notes = (await this.repo.getAll()).sort((a, b) => a.sort_order - b.sort_order);
        let target;
        let bottom;
        let top;
        let listIndex = 0;
        let bottomIndex: number | undefined;
        let needsNormalization = false;

        for (const note of notes) {
            if (bottomIndex !== undefined && listIndex === bottomIndex + 1) {
                top = note;
            }
            if (note.id === targetId) {
                target = note;
            }
            if (note.id === afterId) {
                bottom = note;
                bottomIndex = listIndex;
            }
            listIndex++;
        }

        if (!target) {
            console.warn('target id does not exist');
            return;
        }

        if (!bottom) {
            console.warn('after id does not exist');
            return;
        }

        let newSortOrder

        if (top) {
            newSortOrder = (top.sort_order + bottom.sort_order) / 2;
        } else {
            newSortOrder = bottom.sort_order + this.NORMALIZATION_STEP;
        }
        
        const targetDiff = truncateDecimals(target.sort_order - Math.trunc(target.sort_order), this.NORMALIZATION_DECIMAL_COUNT);
        
        if (targetDiff && targetDiff <= this.NORMALIZATION_THRESHOLD) {
            needsNormalization = true;
        }

        await this.repo.save({id: targetId, sort_order: newSortOrder});

        if (needsNormalization) {
            await this.normalize();
        }

    }
    
    async moveBefore(targetId: string, beforeId: string): Promise<void> {
        
        const notes = (await this.repo.getAll()).sort((a, b) => b.sort_order - a.sort_order);
        let target;
        let bottom;
        let top;
        let listIndex = 0;
        let bottomIndex: number | undefined;
        let needsNormalization = false;

        for (const note of notes) {
            if (bottomIndex !== undefined && listIndex === bottomIndex + 1) {
                top = note;
            }
            if (note.id === targetId) {
                target = note;
            }
            if (note.id === beforeId) {
                bottom = note;
                bottomIndex = listIndex;
            }
            listIndex++;
        }

        if (!target) {
            console.warn('target id does not exist');
            return;
        }

        if (!bottom) {
            console.warn('after id does not exist');
            return;
        }

        if (top) {
            target.sort_order = (top.sort_order + bottom.sort_order) / 2;
        } else {
            target.sort_order = bottom.sort_order - this.NORMALIZATION_STEP;
        }

        const targetDiff = truncateDecimals(target.sort_order - Math.trunc(target.sort_order), this.NORMALIZATION_DECIMAL_COUNT);

        if (targetDiff && targetDiff <= this.NORMALIZATION_THRESHOLD) {
            needsNormalization = true;
        }

        await this.repo.save(target);

        if (needsNormalization) {
            await this.normalize();
        }

    }
}

const sqliteSorterRepo = new SQLiteSorterRepository(sqliteDb);

export const sorter = new Sorter(sqliteSorterRepo);

export default sorter;