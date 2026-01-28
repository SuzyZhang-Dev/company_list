const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 1. 托管当前目录下的静态文件 (index.html, styles.css 等)
app.use(express.static(__dirname));

// 2. API 路由
app.get('/api/companies', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM companies ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 首页路由：显式返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. 兼容性配置：如果是本地运行则监听端口，Vercel 不需要
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// 5. 必须导出 app，否则 Vercel 找不到入口
module.exports = app;