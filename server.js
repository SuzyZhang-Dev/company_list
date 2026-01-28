const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');

const app = express(); // 必须定义 app
const PORT = process.env.PORT || 3000; // 必须定义 PORT

app.use(cors());
app.use(bodyParser.json());

// --- 关键修改：静态文件托管 ---
// 这行代码告诉 Express，当前目录下所有的静态文件（html, css, js）都可以直接访问
app.use(express.static(path.join(__dirname, '/')));

// API: Get all companies
app.get('/api/companies', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM companies ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Update a company
app.put('/api/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { industry, website_url, careers_url } = req.body;

    try {
        const result = await db.execute({
            sql: `UPDATE companies SET industry = COALESCE(?, industry), website_url = COALESCE(?, website_url), careers_url = COALESCE(?, careers_url) WHERE id = ?`,
            args: [industry, website_url, careers_url, id]
        });
        res.json({ message: "Updated", changes: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 关键修改：处理根目录访问 ---
// 访问网址首页时，返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 仅在本地开发时执行 app.listen
// Vercel 会自动处理端口，但在 serverless 环境中这一行通常会被忽略或报错，建议保留如下写法
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// 必须导出 app 供 Vercel 使用
module.exports = app;