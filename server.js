const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// 连接 MongoDB
mongoose.connect('mongodb://localhost/info-collector', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 定义数据模型
const Submission = mongoose.model('Submission', {
    name: String,
    email: String,
    phone: String,
    message: String,
    image: String,
    signature: String,
    timestamp: String
});

// 添加文件上传支持
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// API 路由
app.post('/api/submit', upload.single('image'), async (req, res) => {
    try {
        const submission = new Submission({
            ...req.body,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
        await submission.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await Submission.find().sort({ timestamp: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 