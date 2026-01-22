import { IPayloadParser } from "@/domain/notes/parser/IPayloadParser";
import { Payload, UnparsedPayload } from "@/domain/notes/types";
import sqliteDb, { SQLiteDbStarter } from "../../db/SQLiteDbStarter";
import payloadParser from "../../domain/notes/parser/PayloadParser";

export interface ISearchNotesUseCase {
    search(value: string): Promise<Payload[]>;
}

export interface ISearchNotesRepository {
    getAll(): Promise<UnparsedPayload[]>; 
}

export class SQLiteSearchNotesRepository implements ISearchNotesRepository {
    constructor(private starter: SQLiteDbStarter) {}

    async getAll(): Promise<UnparsedPayload[]> {
        const result = await this.starter.db.getAllAsync<UnparsedPayload>(`SELECT * FROM notes ORDER BY sort_order`);
        return result;
    }
}

export class SearchNotesUseCase implements ISearchNotesUseCase {
    constructor(private repo: ISearchNotesRepository, private parser: IPayloadParser) {}
    
    async search(value: string): Promise<Payload[]> {
        const notes = await this.repo.getAll();
        const parsedNotes: Payload[] = [];
        const matchedNotes: Payload[] = [];
        const regex = new RegExp(value.trim().replaceAll(/\s|,/gi, '|'), 'i');
        
        for (const note of notes) {
            const parsed = this.parser.parse(note);
            if (parsed) {
                parsedNotes.push(parsed);
            }
        }

        for (const note of parsedNotes) {
            
            if (regex.test(note.title)) {
                matchedNotes.push(note);
                continue;
            }

            if (note.type === 'list') {
                for (const listItem of note.content.items) {
                    if (regex.test(listItem.content)) {
                        matchedNotes.push(note);
                        break;
                    }                   
                }
            } else if (note.type === 'note') {
                if (regex.test(note.content.plainText)) {
                    matchedNotes.push(note);
                    continue;
                }
            }
        }

        return matchedNotes;

    }
}

const searcherRepo = new SQLiteSearchNotesRepository(sqliteDb);

export const searcher = new SearchNotesUseCase(searcherRepo, payloadParser);

export default searcher;