const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Rutas para usuarios
router.post('/', 
  //authMiddleware, 
  //checkRole(['administrador']), 
  userController.createUser
);

router.get('/', 
  authMiddleware, 
  checkRole(['SUPER_ADMIN']), 
  userController.getUsers
);

router.put('/:id', 
  authMiddleware, 
  checkRole(['SUPER_ADMIN']), 
  userController.updateUser
);

router.delete('/:id', 
  authMiddleware, 
  checkRole(['SUPER_ADMIN']), 
  userController.deactivateUser
);

router.delete('/:id', 
  authMiddleware, 
  checkRole(['SUPER_ADMIN']), 
  userController.deleteUser
);

module.exports = router;