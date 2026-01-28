const { createClient } = require("@libsql/client");
require("dotenv").config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Fallback to local file if no Turso credentials (useful for dev before migration)
// BUT for Vercel, we want Turso.
const db = createClient({
    url: url || "file:companies.db",
    authToken: authToken,
});

module.exports = { db };
