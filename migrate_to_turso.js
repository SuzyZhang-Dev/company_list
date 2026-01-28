const sqlite3 = require('sqlite3').verbose();
const { createClient } = require("@libsql/client");
require("dotenv").config();

// Local DB (Source)
const localDbPath = './companies.db';
const localDb = new sqlite3.Database(localDbPath);

// Remote DB (Target - Turso)
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || tursoUrl === 'libsql://your-database-name.turso.io') {
    console.error("Please configure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env before running migration.");
    process.exit(1);
}

const turso = createClient({
    url: tursoUrl,
    authToken: tursoToken,
});

async function migrate() {
    console.log("Starting migration...");

    // 1. Create Table in Turso
    console.log("Creating table in Turso if not exists...");
    await turso.execute(`
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            industry TEXT,
            website_url TEXT,
            careers_url TEXT,
            it_tech_relevance TEXT
        );
    `);

    // 2. Read from Local DB
    console.log("Reading data from local SQLite...");
    localDb.all("SELECT * FROM companies", [], async (err, rows) => {
        if (err) {
            console.error("Error reading local DB:", err);
            return;
        }

        console.log(`Found ${rows.length} rows to migrate.`);

        // 3. Insert into Turso
        // Using a loop for simplicity, but could be batched transactions for speed
        for (const row of rows) {
            try {
                // Check if exists to avoid duplicates
                const existing = await turso.execute({
                    sql: "SELECT id FROM companies WHERE id = ?",
                    args: [row.id]
                });

                if (existing.rows.length === 0) {
                    await turso.execute({
                        sql: `INSERT INTO companies (id, name, industry, website_url, careers_url, it_tech_relevance) 
                              VALUES (?, ?, ?, ?, ?, ?)`,
                        args: [row.id, row.name, row.industry, row.website_url, row.careers_url, row.it_tech_relevance]
                    });
                    process.stdout.write("."); // Progress dot
                } else {
                    process.stdout.write("s"); // Skipped
                }
            } catch (insertErr) {
                console.error(`\nError inserting ${row.name}:`, insertErr.message);
            }
        }

        console.log("\nMigration completed.");
        localDb.close();
    });
}

migrate().catch(console.error);
