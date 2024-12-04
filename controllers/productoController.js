const Producto = require('../models/Producto');

const productoController = {
  async createProducto(req, res) {
    try {
      const id_agricultor = req.body.id_agricultor; // Simula el ID del agricultor
      const item = { ...req.body, id_agricultor };
      const productoId = await Producto.create(item);
      res.status(201).json({ message: 'Producto creado', productoId });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async getProductosByAgricultor(req, res) {
    try {
      const id_agricultor = req.query.id_agricultor || 51; // Simula el ID del agricultor desde query params
      const productos = await Producto.getAllByAgricultor(id_agricultor);
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async getAllProducts(req, res) {
    try {
      const productos = await Producto.getAllProducts();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async searchByName(req, res) {
    try {
      const { nombre } = req.query;
      if (!nombre) {
        return res.status(400).json({ message: 'El parámetro nombre es requerido' });
      }
      const productos = await Producto.searchByName(nombre);
      res.json(productos);
    } catch (error) {
      console.error('Error al buscar productos por nombre:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async searchbyCodigo(req, res) {
    try {
      const { codigo } = req.query;
      if (!codigo) {
        return res.status(400).json({ message: 'El parámetro codigo es requerido' });
      }
      const productos = await Producto.searchByCodigo(codigo);
      res.json(productos);
    } catch (error) {
      console.error('Error al buscar productos por codigo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  async updateProducto(req, res) {
    try {
      const productoId = req.params.id;
      const id_agricultor = req.body.id_agricultor; // Simula el ID del agricultor
      const item = req.body;
      const result = await Producto.update(productoId, id_agricultor, item);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });
      }
      res.json({ message: 'Producto actualizado' });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async deleteProducto(req, res) {
    try {
      const productoId = req.params.id;
      const id_agricultor = req.query.id_agricultor; // Simula el ID del agricultor desde query params
      const result = await Producto.delete(productoId, id_agricultor);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });
      }
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

module.exports = productoController;
