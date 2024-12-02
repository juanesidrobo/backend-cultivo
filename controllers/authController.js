const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { comparePassword } = require('../utils/encryption');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // email = email.toLowerCase();
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      //console.log(User);
      const user = await User.findByEmail(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials Email' });
      }
      //console.log(user); 
      // Verify password
      const isMatch = password === user.password;
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials Password' });
      }

      // Generate token
      const token = jwt.sign(
        { 
          id_usuario: user.id_usuario, 
          username: user.username, 
          rol: user.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token,
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          rol: user.rol,
          id_cliente: user.id_cliente,
          id_agricultor: user.id_agricultor,
          id_administrador: user.id_administrador
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  register: async (req, res) => {
    try {
      const {
        username,
        password,
        rol,
        id_cliente,
        id_agricultor,
        id_administrador
      } = req.body;

      // Validate required fields
      if (!username || !password || !rol || (!id_cliente || !id_agricultor || !id_administrador)) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user
      const userData = {
        username,
        password,
        rol,
        id_cliente,
        id_agricultor,
        id_administrador
      };

      const userId = await User.create(userData);
      
      res.status(201).json({ 
        message: 'User registered successfully',
        userId 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.rol,
          nombres: user.nombres,
          apellidos: user.apellidos,
          estado: user.estado
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;