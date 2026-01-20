import { NoteRepository } from "./INotesRepository";

interface ISorter {
    moveAfter(moveId: string, afterId: string): Promise<void>;
    moveBefore(): Promise<void>;
    normalize(): Promise<void>;
    getHighest(): Promise<void>;
    getLowest(): Promise<void>;
}

export class Sorter implements ISorter {
    private readonly NORMALIZATION_BASE: number = 100;
    private readonly NORMALIZATION_STEP: number = 10;

    constructor(private db: NoteRepository) {}

    async normalize(): Promise<void> {
        const notes = await this.db.getAll();
        let value = this.NORMALIZATION_BASE;
        const newNotes = [];

        for (const note of notes) {
            note.sort_order = value;
            newNotes.push(note);
            value += this.NORMALIZATION_STEP;
        }

        await this.db.saveAll(newNotes);
    }

    async moveAfter(moveId: string, afterId: string): Promise<void> {
        const notes = await this.db.getAll();
        
    }
}