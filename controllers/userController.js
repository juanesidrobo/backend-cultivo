const User = require('../models/User');

const userController = {
  async createUser(req, res) {
    try {
      const userData = req.body;
      
      // Validar datos requeridos
      if (!userData.username || !userData.password ||  !userData.rol) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      // Verificar si el email ya existe
      const existingUser = await User.findByEmail(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      const userId = await User.create(userData);
      res.status(201).json({ 
        message: 'Usuario creado exitosamente',
        userId 
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // En el userController.js del backend
  async getUsers(req, res) {
  try {
    const { username } = req.query;
    let users;
    
    if (username) {
      users = await User.findByEmail(username);
    } else {
      users = await User.list();
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
},

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const success = await User.update(id, userData);
      if (success) {
        res.json({ message: 'Usuario actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const success = await User.deactivate(id);
      if (success) {
        res.json({ message: 'Usuario desactivado exitosamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const success = await User.delete(id);
      if (success) {
        res.json({ message: 'Usuario eliminado exitosamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
};

module.exports = userController;