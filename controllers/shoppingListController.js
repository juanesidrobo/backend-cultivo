const ShoppingList = require('../models/ShoppingList');

const shoppingListController = {
  async createList(req, res) {
    try {
      const userId = req.user.id;
      const listId = await ShoppingList.create(userId);
      res.status(201).json({ message: 'Lista de compras creada', listId });
    } catch (error) {
      console.error('Error al crear lista de compras:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async getLatestList(req, res) {
    try {
      const userId = req.user.id;
      const latestList = await ShoppingList.getLatest(userId);
      res.json(latestList);
    } catch (error) {
      console.error('Error al obtener lista de compras:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async getAllLists(req, res) {
    try {
      const userId = req.user.id;
      const lists = await ShoppingList.getAll(userId);
      res.json(lists);
    } catch (error) {
      console.error('Error al obtener listas de compras:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async getList(req, res) {
    try {
      const { id } = req.params;
      console.log('ID de la lista:', id);
      const list = await ShoppingList.getById(id);
      if (list) {
        res.json(list);
      } else {
        res.status(404).json({ message: 'Lista de compras no encontrada' });
      }
    } catch (error) {
      console.error('Error al obtener lista de compras:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async addItem(req, res) {
    try {
      const { id: listId } = req.params;
      const item = req.body;
      const itemId = await ShoppingList.addItem(listId, item);
      res.status(201).json({ message: 'Elemento agregado a la lista', itemId });
    } catch (error) {
      console.error('Error al agregar elemento a la lista:', error);
      res.status(500).json({ message: 'Error interno del servidor add' });
    }
  },

  async updateItem(req, res) {
    try {
      const { itemId } = req.params;
      const updatedItem = req.body;
      const success = await ShoppingList.updateItem(itemId, updatedItem);
      if (success) {
        res.json({ message: 'Elemento actualizado' });
      } else {
        res.status(404).json({ message: 'Elemento no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async changeState(req, res) {
    try {
      const { itemId } = req.params;
      const updatedItem = req.body;
      const success = await ShoppingList.updateItem(itemId, updatedItem);
      if (success) {
        res.json({ message: 'Elemento actualizado' });
      } else {
        res.status(404).json({ message: 'Elemento no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async changeStateDelete(req, res) {
    try {
      const { itemId } = req.params;
      const updatedItem = req.body;
      const success = await ShoppingList.updateItem(itemId, updatedItem);
      if (success) {
        res.json({ message: 'Elemento actualizado' });
      } else {
        res.status(404).json({ message: 'Elemento no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async removeItem(req, res) {
    try {
      const { itemId } = req.params;
      const success = await ShoppingList.removeItem(itemId);
      if (success) {
        res.json({ message: 'Elemento eliminado de la lista' });
      } else {
        res.status(404).json({ message: 'Elemento no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

module.exports = shoppingListController;