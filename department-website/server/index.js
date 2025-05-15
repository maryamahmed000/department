const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// مثال على Route خاص بالسيرفر
app.use('/api/auth', require('./authRoutes'));

// 🟢 تقديم ملفات React بعد البناء
app.use(express.static(path.join(__dirname, '../client/build')));

// 🔁 أي Route غير معروف يرجع index.html الخاص بـ React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// 🟢 تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
