const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const productoController = require('../controllers/productoController');

// Crear un nuevo producto
router.post('/', productoController.createProducto);

// Obtener todos los productos
router.get('/all', productoController.getAllProducts);

// Buscar productos por nombre
router.get('/search', productoController.searchByName);

// Buscar productos por codigo
router.get('/searchbyCodigo', productoController.searchbyCodigo);

// Obtener todos los productos de un agricultor
router.get('/', productoController.getProductosByAgricultor);

// Actualizar un producto
router.put('/:id', productoController.updateProducto);

// Eliminar un producto
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
