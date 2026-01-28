const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');


// API: Get all companies
app.get('/api/companies', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM companies ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Update a company (for our data enrichment script)
app.put('/api/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { industry, website_url, careers_url } = req.body;

    // Use a transaction or simpler parameterized query for Turso
    // Note: COALESCE logic is standard SQL and should work
    try {
        const result = await db.execute({
            sql: `UPDATE companies SET industry = COALESCE(?, industry), website_url = COALESCE(?, website_url), careers_url = COALESCE(?, careers_url) WHERE id = ?`,
            args: [industry, website_url, careers_url, id]
        });

        // Turso result doesn't explicitly return "changes" in the same way, but it should be fine.
        // We can check rowsAffected if supported by the client version, or just return success.
        res.json({ message: "Updated", changes: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
