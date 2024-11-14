const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { comparePassword } = require('../utils/encryption');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      //console.log(User);
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials Email' });
      }
      //console.log(user); 
      // Verify password
      const isMatch = password === user.password;
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials Password admin' });
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
          apellidos: user.apellidos
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
        nombres,
        apellidos,
        tipoDocumento,
        numeroDocumento,
        genero,
        email,
        telefono,
        password,
        fechaNacimiento
      } = req.body;

      // Validate required fields
      if (!email || !password || !nombres || !apellidos) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user
      const userData = {
        nombres,
        apellidos,
        tipoDocumento,
        numeroDocumento,
        genero,
        email,
        telefono,
        rol: 'USER', // Default role
        fechaNacimiento,
        password
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
  }
};

module.exports = authController;