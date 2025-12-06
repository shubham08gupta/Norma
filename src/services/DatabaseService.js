import * as SQLite from 'expo-sqlite';

let db;

export class DatabaseService {
    static async init() {
        try {
            console.log('DatabaseService: Opening database...');
            db = await SQLite.openDatabaseAsync('norma.db');
            console.log('DatabaseService: Database opened, executing PRAGMA...');
            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_text TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );
      `);
            console.log('DatabaseService: Table created successfully');
        } catch (error) {
            console.error('DatabaseService: Error initializing database', error);
            throw error;
        }
    }

    static async addEvent(text, timestamp) {
        if (!db) await this.init();
        try {
            const result = await db.runAsync(
                'INSERT INTO events (event_text, timestamp) VALUES (?, ?)',
                [text, timestamp]
            );
            return result;
        } catch (error) {
            console.error('Error adding event', error);
            throw error;
        }
    }

    static async searchEvents(query, startDate, endDate) {
        if (!db) await this.init();

        let sql = 'SELECT * FROM events WHERE 1=1';
        const args = [];

        if (startDate) {
            sql += ' AND timestamp >= ?';
            args.push(startDate);
        }

        if (endDate) {
            sql += ' AND timestamp <= ?';
            args.push(endDate);
        }

        if (query) {
            sql += ' AND event_text LIKE ?';
            args.push(`%${query}%`);
        }

        sql += ' ORDER BY timestamp DESC';

        try {
            const rows = await db.getAllAsync(sql, args);
            return rows;
        } catch (error) {
            console.error('Error searching events', error);
            throw error;
        }
    }

    static async getAllEvents() {
        if (!db) await this.init();
        try {
            const rows = await db.getAllAsync('SELECT * FROM events ORDER BY timestamp DESC');
            return rows;
        } catch (error) {
            console.error('Error getting all events', error);
            throw error;
        }
    }
}
