const User = require('../models/User');

const userController = {
  async createUser(req, res) {
    try {
      const userData = req.body;

      // Validar datos requeridos
      if (!userData.username || !userData.password || !userData.rol) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }

      // Verificar si el username ya existe
      const existingUser = await User.findByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'El username ya está registrado' });
      }

      // Validar datos adicionales según el rol
      switch (userData.rol) {
        case 'cliente':
          if (!userData.nombre || !userData.telefono || !userData.direccion) {
            return res.status(400).json({ message: 'Faltan datos del cliente' });
          }
          break;
        case 'agricultor':
          if (!userData.nombre || !userData.telefono) {
            return res.status(400).json({ message: 'Faltan datos del agricultor' });
          }
          break;
        case 'administrador':
          if (!userData.nombre || !userData.email || !userData.telefono) {
            return res.status(400).json({ message: 'Faltan datos del administrador' });
          }
          break;
        default:
          return res.status(400).json({ message: 'Rol inválido' });
      }

      // Crear usuario y asignarlo a la tabla correspondiente
      const userId = await User.create(userData);

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        userId,
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // En el userController.js del backend
  async getUsers(req, res) {
    try {
      const users = await User.listByRole();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;
      const user = await User.findByUsernameWithDetails(username);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },  

  async updateUser(req, res) {
    try {
      const { username } = req.params;
      const userData = req.body;
  
      if (!userData.username) {
        return res.status(400).json({ message: "El campo 'username' es obligatorio" });
      }
  
      const success = await User.updateByUsername(username, userData);
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
  
  async deleteUser(req, res) {
    try {
      const { username } = req.params;
  
      const success = await User.deleteByUsername(username);
      if (success) {
        res.json({ message: 'Usuario eliminado exitosamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async getCedulaByUserId(req, res) {
    try {
      const { id_usuario } = req.params; // Recoge el id_usuario desde los parámetros de la URL
      const cedula = await User.getCedulaByUserId(id_usuario);
  
      if (!cedula) {
        return res.status(404).json({ message: 'Cédula no encontrada para este usuario.' });
      }
  
      res.json({ cedula });
    } catch (error) {
      console.error('Error al obtener la cédula:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
  
  
};

module.exports = userController;