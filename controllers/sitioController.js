const Sitio = require('../models/Sitio');

const sitioController = {
  async createSitio(req, res) {
    try {
      const userId = req.user.id;
      const item = req.body;
      const sitioId = await Sitio.create(userId, item);
      res.status(201).json({ message: 'Sitio creado', sitioId });
    } catch (error) {
      console.error('Error al crear sitio:', error);
      res.status(500).json({ message: 'Error interno del servidor addSitio' });
    }
  },

  async getLatestSitio(req, res) {
    try {
      const userId = req.user.id;
      const latestSitio = await Sitio.getLatest(userId);
      res.json(latestSitio);
    } catch (error) {
      console.error('Error al obtener sitio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async getAllSitios(req, res) {
    try {
      const userId = req.user.id;
      const sitios = await Sitio.getAll(userId);
      res.json(sitios);
    } catch (error) {
      console.error('Error al obtener sitios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /*async getList(req, res) {
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
  },*/
};

module.exports = sitioController;