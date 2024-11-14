const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', 
  authMiddleware,
  shoppingListController.createList
);

router.get('/latest', 
  authMiddleware,
  shoppingListController.getLatestList
);

router.get('/', 
  authMiddleware,
  shoppingListController.getAllLists
);

router.get('/:id', 
  authMiddleware,
  shoppingListController.getList
);

router.post('/:id/items',
  authMiddleware,
  shoppingListController.addItem
);

router.put('/items/:itemId',
  authMiddleware,
  shoppingListController.updateItem
);
router.put('/items/:itemId',
  authMiddleware,
  shoppingListController.changeState
);
router.put('/items/:itemId',
  authMiddleware,
  shoppingListController.changeStateDelete
);

router.delete('/items/:itemId',
  authMiddleware,
  shoppingListController.removeItem
);

module.exports = router;