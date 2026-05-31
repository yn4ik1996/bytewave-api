const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const dataPath = path.join(__dirname, 'products.json');

let products = [];
if (fs.existsSync(dataPath)) {
  products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} else {
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
}

// Получить все товары
app.get('/api/products', (req, res) => res.json(products));

// Добавить товар
app.post('/api/products', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  res.json(newProduct);
});

// Обновить товар
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

// Удалить товар
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend запущен на порту ${PORT}`);
});
