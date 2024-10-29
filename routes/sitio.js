const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const sitioController = require('../controllers/sitioController');

router.post('/', 
  authMiddleware,
  sitioController.createSitio
);

router.get('/latest', 
  authMiddleware,
  sitioController.getLatestSitio
);

router.get('/', 
  authMiddleware,
  sitioController.getAllSitios
);

module.exports = router;