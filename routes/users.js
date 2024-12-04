const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Crear usuario
router.post('/', userController.createUser);

// Listar usuarios con rol cliente y agricultor
router.get('/', userController.getUsers);

// Obtener un usuario por username
router.get('/:username', userController.getUserByUsername);

// Actualizar un usuario por username
router.put('/:username', userController.updateUser);

// Eliminar un usuario por username
router.delete('/:username', userController.deleteUser);

module.exports = router;