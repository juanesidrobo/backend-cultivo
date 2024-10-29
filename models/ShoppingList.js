const pool = require('../config/database');

class ShoppingList {
  static async create(userId) {
    const connection = await pool.getConnection();
    console.log(userId);
    try {
      const [result] = await connection.query(
        'INSERT INTO ListaCompras (idUser, fecha_registro) VALUES (?, NOW())',
        [userId]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async getLatest(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM ListaCompras WHERE idUser = ? ORDER BY fecha_registro DESC LIMIT 1',
      [userId]
    );
    return rows[0];
  }

  static async getAll(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM ListaCompras WHERE idUser = ? ORDER BY fecha_registro DESC',
      [userId]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM ListaCompras WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async addItem(listId, item) {
    const connection = await pool.getConnection();
    console.log(item);
    try {
      const [result] = await connection.query(
        'INSERT INTO ElementoLista (nombre, cantidad ,idSitio, idLista, estado, estadoEliminado) VALUES (?, ?, ?, ?, ?, ?)',
        [item.nombre, item.cantidad ,item.idSitio, listId, item.estado, item.estadoEliminado]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async updateItem(itemId, updatedItem) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'UPDATE elementoslista SET nombre = ?, id_sitio = ? WHERE id = ?',
        [updatedItem.nombre, updatedItem.idSitio, itemId]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
  
  static async removeItem(itemId) {
    const [result] = await pool.query(
      'DELETE FROM elementoslista WHERE id = ?',
      [itemId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ShoppingList;