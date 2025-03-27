const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key_123';
const users = []; // Хранение пользователей в памяти

// Указываем абсолютный путь к папке с фронтендом
const frontendPath = path.join('C:', 'Users', 'User', 'Base-5', 'frontend');

// Middleware для статических файлов (CSS, JS, изображения)
app.use(express.static(frontendPath));

// Маршруты для HTML страниц
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'register.html'));
});

// API маршруты
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Нет такого пользователя' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});


app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.json({ message: `Hello, ${decoded.username}!` });
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));