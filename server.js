const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shopping_list_MJ',
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Rutas (ejemplo para registrar usuarios)
app.post('/register', (req, res) => {
  const { nombres, apellidos, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO users (nombres, apellidos, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [nombres, apellidos, email, hashedPassword], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuario registrado' });
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
