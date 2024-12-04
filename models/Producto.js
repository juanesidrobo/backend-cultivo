const pool = require('../config/database');

class Producto {
  static async create(item) {
    const connection = await pool.getConnection();
    try {
      // Insertar producto en tbl_producto
      const [productoResult] = await connection.query(
        'INSERT INTO tbl_producto (nombre, precio, descripcion, cantidadDisponible, direccion) VALUES (?, ?, ?, ?, ?)',
        [item.nombre, item.precio, item.descripcion, item.cantidadDisponible, item.direccion]
      );

      // Insertar relación en tbl_agricultor_producto
      await connection.query(
        'INSERT INTO tbl_agricultor_producto (id_agricultor, codigo) VALUES (?, ?)',
        [item.id_agricultor, productoResult.insertId]
      );

      return productoResult.insertId;
    } finally {
      connection.release();
    }
  }

  static async getAllByAgricultor(id_agricultor) {
    const [rows] = await pool.query(
      `SELECT p.* 
       FROM tbl_producto p
       INNER JOIN tbl_agricultor_producto ap ON p.codigo = ap.codigo
       WHERE ap.id_agricultor = ?`,
      [id_agricultor]
    );
    return rows;
  }
  static async getAllProducts() {
    const [rows] = await pool.query(`
      SELECT p.codigo, p.nombre AS producto_nombre, p.precio, p.descripcion, p.cantidadDisponible, p.direccion,
             a.nombre AS agricultor_nombre
      FROM tbl_producto p
      JOIN tbl_agricultor_producto ap ON p.codigo = ap.codigo
      JOIN tbl_agricultor a ON ap.id_agricultor = a.id_agricultor
    `);
    return rows;
  }

  static async searchByName(name) {
    const [rows] = await pool.query(`
      SELECT p.codigo, p.nombre AS producto_nombre, p.precio, p.descripcion, p.cantidadDisponible, p.direccion,
             a.nombre AS agricultor_nombre
      FROM tbl_producto p
      JOIN tbl_agricultor_producto ap ON p.codigo = ap.codigo
      JOIN tbl_agricultor a ON ap.id_agricultor = a.id_agricultor
      WHERE p.nombre LIKE ?
    `, [`%${name}%`]);
    return rows;
  }

  static async update(id, id_agricultor, item) {
    const connection = await pool.getConnection();
    try {
      // Verificar que el producto pertenece al agricultor
      const [checkResult] = await connection.query(
        'SELECT * FROM tbl_agricultor_producto WHERE codigo = ? AND id_agricultor = ?',
        [id, id_agricultor]
      );

      if (checkResult.length === 0) {
        throw new Error('Producto no encontrado o no pertenece al agricultor');
      }

      // Actualizar producto en tbl_producto
      const [result] = await connection.query(
        'UPDATE tbl_producto SET nombre = ?, precio = ?, descripcion = ?, cantidadDisponible = ?, direccion = ? WHERE codigo = ?',
        [item.nombre, item.precio, item.descripcion, item.cantidadDisponible, item.direccion, id]
      );

      return result;
    } finally {
      connection.release();
    }
  }

  static async delete(id, id_agricultor) {
    const connection = await pool.getConnection();
    try {
      // Verificar que el producto pertenece al agricultor
      const [checkResult] = await connection.query(
        'SELECT * FROM tbl_agricultor_producto WHERE codigo = ? AND id_agricultor = ?',
        [id, id_agricultor]
      );

      if (checkResult.length === 0) {
        throw new Error('Producto no encontrado o no pertenece al agricultor');
      }

      // Eliminar relación en tbl_agricultor_producto
      await connection.query(
        'DELETE FROM tbl_agricultor_producto WHERE codigo = ? AND id_agricultor = ?',
        [id, id_agricultor]
      );

      // Eliminar producto de tbl_producto
      const [result] = await connection.query(
        'DELETE FROM tbl_producto WHERE codigo = ?',
        [id]
      );

      return result;
    } finally {
      connection.release();
    }
  }
}

module.exports = Producto;
