const pool = require('../config/database');

class User {
  constructor(data) {
    this.id_usuario = data.id_usuario;
    this.username = data.username;
    this.password = data.password;
    this.rol = data.rol;
  }

  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar usuario en la tabla usuarios
      const [result] = await connection.query(
        `INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)`,
        [userData.username, userData.password, userData.rol]
      );
      const userId = result.insertId;

      // Insertar en la tabla correspondiente según el rol
      switch (userData.rol) {
        case 'cliente':
          await connection.query(
            `INSERT INTO tbl_cliente (nombre, telefono, direccion, id_usuario) VALUES (?, ?, ?, ?)`,
            [userData.nombre, userData.telefono, userData.direccion, userId]
          );
          break;
        case 'agricultor':
          await connection.query(
            `INSERT INTO tbl_agricultor (nombre, telefono, id_usuario) VALUES (?, ?, ?)`,
            [userData.nombre, userData.telefono, userId]
          );
          break;
        case 'administrador':
          await connection.query(
            `INSERT INTO tbl_administrador (nombre, email, telefono, id_usuario) VALUES (?, ?, ?, ?)`,
            [userData.nombre, userData.email, userData.telefono, userId]
          );
          break;
        default:
          throw new Error('Rol inválido');
      }

      await connection.commit();
      return userId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  static async listByRole() {
    const [rows] = await pool.query(`
      SELECT u.id_usuario, u.username, u.rol,
             CASE
               WHEN u.rol = 'cliente' THEN c.nombre
               WHEN u.rol = 'agricultor' THEN a.nombre
             END AS nombre,
             CASE
               WHEN u.rol = 'cliente' THEN c.telefono
               WHEN u.rol = 'agricultor' THEN a.telefono
             END AS telefono,
             CASE
               WHEN u.rol = 'cliente' THEN c.direccion
               ELSE NULL
             END AS direccion
      FROM usuarios u
      LEFT JOIN tbl_cliente c ON u.id_usuario = c.id_usuario
      LEFT JOIN tbl_agricultor a ON u.id_usuario = a.id_usuario
      WHERE u.rol IN ('cliente', 'agricultor');
    `);
    return rows;
  }
  
  static async findByUsername(username) {
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE username = ?`,
      [username]
    );
    return rows[0];
  }

  static async findByUsernameWithDetails(username) {
    const [rows] = await pool.query(`
      SELECT u.id_usuario, u.username, u.rol,
             CASE
               WHEN u.rol = 'cliente' THEN c.nombre
               WHEN u.rol = 'agricultor' THEN a.nombre
             END AS nombre,
             CASE
               WHEN u.rol = 'cliente' THEN c.telefono
               WHEN u.rol = 'agricultor' THEN a.telefono
             END AS telefono,
             CASE
               WHEN u.rol = 'cliente' THEN c.direccion
               ELSE NULL
             END AS direccion
      FROM usuarios u
      LEFT JOIN tbl_cliente c ON u.id_usuario = c.id_usuario
      LEFT JOIN tbl_agricultor a ON u.id_usuario = a.id_usuario
      WHERE u.username = ?;
    `, [username]);
    return rows[0];
  }
  

  static async updateByUsername(username, userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Validar que el nuevo username no sea nulo ni undefined
      if (!userData.username) {
        throw new Error("El campo 'username' es obligatorio y no puede ser nulo");
      }
  
      // Actualizar usuario en la tabla principal
      await connection.query(
        `UPDATE usuarios SET username = ? WHERE username = ?`,
        [userData.username, username]
      );
  
      // Actualizar en la tabla correspondiente según el rol
      if (userData.rol === 'cliente') {
        await connection.query(
          `UPDATE tbl_cliente SET nombre = ?, telefono = ?, direccion = ? WHERE id_usuario = (
            SELECT id_usuario FROM usuarios WHERE username = ?
          )`,
          [userData.nombre, userData.telefono, userData.direccion, userData.username]
        );
      } else if (userData.rol === 'agricultor') {
        await connection.query(
          `UPDATE tbl_agricultor SET nombre = ?, telefono = ? WHERE id_usuario = (
            SELECT id_usuario FROM usuarios WHERE username = ?
          )`,
          [userData.nombre, userData.telefono, userData.username]
        );
      }
  
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async deleteByUsername(username) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Buscar el usuario y su rol
      const [user] = await pool.query(
        `SELECT rol, id_usuario FROM usuarios WHERE username = ?`,
        [username]
      );
      if (!user[0]) {
        return false; // Usuario no encontrado
      }
  
      const { rol, id_usuario } = user[0];
  
      // Eliminar de las tablas secundarias según el rol
      if (rol === 'cliente') {
        await connection.query(`DELETE FROM tbl_cliente WHERE id_usuario = ?`, [id_usuario]);
      } else if (rol === 'agricultor') {
        await connection.query(`DELETE FROM tbl_agricultor WHERE id_usuario = ?`, [id_usuario]);
      } else if (rol === 'administrador') {
        await connection.query(`DELETE FROM tbl_administrador WHERE id_usuario = ?`, [id_usuario]);
      }
  
      // Eliminar de la tabla usuarios
      await connection.query(`DELETE FROM usuarios WHERE username = ?`, [username]);
  
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  
}
module.exports = User;