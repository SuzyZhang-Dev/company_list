const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { db, initDb } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from root

// Initialize DB on start
initDb();

// API: Get all companies
app.get('/api/companies', (req, res) => {
    db.all("SELECT * FROM companies ORDER BY name ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Update a company (for our data enrichment script)
app.put('/api/companies/:id', (req, res) => {
    const { id } = req.params;
    const { industry, website_url, careers_url } = req.body;

    db.run(
        `UPDATE companies SET industry = COALESCE(?, industry), website_url = COALESCE(?, website_url), careers_url = COALESCE(?, careers_url) WHERE id = ?`,
        [industry, website_url, careers_url, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Updated", changes: this.changes });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
