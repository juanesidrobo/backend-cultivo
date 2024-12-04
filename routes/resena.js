const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

// Obtener resenas de un producto
router.get('/:codigo_producto', resenaController.getResenasByProducto);

// Crear una nueva resena
router.post('/', resenaController.createResena);

module.exports = router;
