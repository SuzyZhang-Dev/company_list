const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');

const app = express();
// Vercel 环境下 process.env.PORT 是自动注入的
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 关键：必须显式托管静态资源，否则 index.html 无法访问
app.use(express.static(path.join(__dirname, '/')));

// API 路由
app.get('/api/companies', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM companies ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 处理根目录访问，确保返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 关键修改：如果是 Vercel 环境，不需要 app.listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// 必须导出 app，Vercel 才能找到入口！
module.exports = app;