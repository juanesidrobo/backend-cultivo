const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const productoController = require('../controllers/productoController');

// Crear un nuevo producto
router.post('/', productoController.createProducto);

// Obtener todos los productos de un agricultor
router.get('/', productoController.getProductosByAgricultor);

// Actualizar un producto
router.put('/:id', productoController.updateProducto);

// Eliminar un producto
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
