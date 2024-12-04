const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Asegúrate de importar la conexión a la base de datos
const User = require('../models/User');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validar entrada
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Buscar usuario
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials: username' });
      }

      // Verificar contraseña (simple comparación, mejorar en producción)
      const isMatch = password === user.password;
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials: password' });
      }

      // Obtener datos adicionales según el rol
      let additionalData = {};
      if (user.rol === 'cliente') {
        const [cliente] = await pool.query(
          'SELECT nombre FROM tbl_cliente WHERE id_usuario = ?',
          [user.id_usuario]
        );
        additionalData.nombre = cliente[0]?.nombre || null;
      } else if (user.rol === 'agricultor') {
        const [agricultor] = await pool.query(
          'SELECT id_agricultor, nombre FROM tbl_agricultor WHERE id_usuario = ?',
          [user.id_usuario]
        );
        additionalData.id_agricultor = agricultor[0]?.id_agricultor || null;
        additionalData.nombre = agricultor[0]?.nombre || null;
      } else if (user.rol === 'administrador') {
        const [administrador] = await pool.query(
          'SELECT nombre FROM tbl_administrador WHERE id_usuario = ?',
          [user.id_usuario]
        );
        additionalData.nombre = administrador[0]?.nombre || null;
      }

      // Generar token
      const token = jwt.sign(
        {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Responder con el token y datos del usuario
      res.json({
        token,
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          ...additionalData,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = authController;
