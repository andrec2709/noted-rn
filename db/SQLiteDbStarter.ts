import * as SQLite from 'expo-sqlite';
import { IDbStarter } from './IDbStarter';



export class SQLiteDbStarter implements IDbStarter {
  private static instance: SQLiteDbStarter | undefined;
  readonly db: SQLite.SQLiteDatabase = SQLite.openDatabaseSync('notes.db');

  private constructor() {
    this.initDb();
  }

  public static getInstance(): SQLiteDbStarter {
    if (SQLiteDbStarter.instance === undefined) {
      SQLiteDbStarter.instance = new SQLiteDbStarter();
    }
    return SQLiteDbStarter.instance;
  }

  async initDb(): Promise<void> {
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
}

export const sqliteDb = SQLiteDbStarter.getInstance();

export default sqliteDb;