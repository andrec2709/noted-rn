import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('notes.db');

export async function initDb() {
    await db.execAsync(`
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
