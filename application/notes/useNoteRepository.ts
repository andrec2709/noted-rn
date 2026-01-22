import sqliteRepo from "@/db/notes/SQLiteNoteRepository";

export function useNoteRepository() {
    return sqliteRepo;
}
