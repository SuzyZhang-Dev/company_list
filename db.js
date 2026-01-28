const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'companies.db');
const sqlPath = path.resolve(__dirname, 'companies_fi.sql');

const db = new sqlite3.Database(dbPath);

function initDb() {
    db.serialize(() => {
        // Check if table exists
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='companies'", (err, row) => {
            if (err) {
                console.error("Error checking for table:", err);
                return;
            }

            if (!row) {
                console.log("Initializing database from SQL file...");
                const sql = fs.readFileSync(sqlPath, 'utf8');
                
                // Very basic SQL runner: split by semicolon. 
                // Note: This is fragile if SQL contains semicolons in strings.
                // companies_fi.sql seems simple enough for this.
                const statements = sql.split(';').filter(s => s.trim());

                db.serialize(() => {
                    statements.forEach(stmt => {
                        if (stmt.trim()) {
                            db.run(stmt, (err) => {
                                if (err) {
                                    console.error("Error running statement:", err);
                                    console.error("Statement:", stmt);
                                }
                            });
                        }
                    });
                });
                console.log("Database initialized.");
            } else {
                console.log("Database already exists.");
            }
        });
    });
}

module.exports = { db, initDb };
