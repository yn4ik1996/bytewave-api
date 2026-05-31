const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10080;

app.use(cors());
app.use(bodyParser.json());

console.log('✅ Server starting...');

const dataPath = path.join(__dirname, 'products.json');

let products = [];
if (fs.existsSync(dataPath)) {
  products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📦 Loaded ${products.length} products`);
} else {
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  console.log('📂 Created new products.json');
}

// Тестовый маршрут
app.get('/', (req, res) => {
  res.send('<h1>✅ ByteWave API is running!</h1><p>Try: <a href="/api/products">/api/products</a></p>');
});

// Основной маршрут
app.get('/api/products', (req, res) => {
  console.log('GET /api/products called');
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend успешно запущен на порту ${PORT}`);
  console.log(`🌐 API доступно по адресу: https://bytewave-api-6rib.onrender.com`);
});
