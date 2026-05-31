const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10080;

app.use(cors());
app.use(bodyParser.json());

console.log('🚀 SERVER.JS ЗАПУЩЕН');

const dataPath = path.join(__dirname, 'products.json');

let products = [];
if (fs.existsSync(dataPath)) {
  products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📦 Загружено товаров: ${products.length}`);
} else {
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  console.log('📂 Создан products.json');
}

// === ТЕСТОВЫЕ РОУТЫ ===
app.get('/', (req, res) => {
  console.log('GET /');
  res.send('<h1>✅ ByteWave API РАБОТАЕТ!</h1><p><a href="/api/products">Перейти к товарам</a></p>');
});

app.get('/api/products', (req, res) => {
  console.log('GET /api/products — OK');
  res.json(products);
});

console.log(`✅ Все роуты зарегистрированы. Сервер слушает порт ${PORT}`);

app.listen(PORT, () => {
  console.log(`🚀 Backend запущен на https://bytewave-api-6rib.onrender.com`);
});
