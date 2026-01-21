import { Payload, UnparsedPayload } from "@/types/notes";
import sqliteDb, { SQLiteDbStarter } from ".";
import payloadParser, { IPayloadParser } from "./PayloadParser";

export interface ISearcher {
    search(value: string): Promise<Payload[]>;
}

export interface ISearcherRepository {
    getAll(): Promise<UnparsedPayload[]>; 
}

export class SQLiteSearcherRepository implements ISearcherRepository {
    constructor(private starter: SQLiteDbStarter) {}

    async getAll(): Promise<UnparsedPayload[]> {
        const result = await this.starter.db.getAllAsync<UnparsedPayload>(`SELECT * FROM notes ORDER BY sort_order`);
        return result;
    }
}

export class Searcher implements ISearcher {
    constructor(private repo: ISearcherRepository, private parser: IPayloadParser) {}
    
    async search(value: string): Promise<Payload[]> {
        const notes = await this.repo.getAll();
        const parsedNotes: Payload[] = [];
        const matchedNotes: Payload[] = [];
        const regex = new RegExp(value.trim().replaceAll(/\s|,/gi, '|'), 'gi');
        
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

const searcherRepo = new SQLiteSearcherRepository(sqliteDb);

export const searcher = new Searcher(searcherRepo, payloadParser);

export default searcher;