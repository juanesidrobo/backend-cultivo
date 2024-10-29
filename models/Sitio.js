const pool = require('../config/database');

class Sitio {
  static async create(userId, item) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO Sitio (idUser, nombre, fecha_registro) VALUES (?, ?, NOW())',
        [userId, item.nombre]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async getAll(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM Sitio WHERE idUser = ? ORDER BY fecha_registro DESC',
      [userId]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM Sitio WHERE id = ?',
      [id]
    );
    return rows[0];
  }

}

module.exports = Sitio;