const pool = require('../config/database');
const { encryptPassword } = require('../utils/encryption');

class User {
  constructor(data) {
    //console.log('Datos recibidos en el constructor:', data);
    this.id_usuario = data.id_usuario;
    this.username = data.username;
    this.password = data.password;
    this.rol = data.rol;
    this.id_cliente = data.id_cliente;
    this.id_agricultor = data.id_agricultor;
    this.id_administrador = data.id_administrador;
  }
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      
      const [result] = await connection.query(
        `INSERT INTO usuarios (
          username, password, rol, id_cliente, id_agricultor, id_administrador
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userData.username,
          userData.password,
          userData.rol,
          userData.id_cliente  || null,
          userData.id_agricultor || null,
          userData.id_administrador  || null

        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }
  

  static async findByEmail(username) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    console.log('Resultado de la consulta:', rows[0]);
    if (rows.length > 0) {
      return new User(rows[0]);
    }
    return null;
  }

  static async findById(id_usuario) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const connection = await pool.getConnection();
    try {
      // Formatear la fecha de nacimiento
      const fecha_nacimiento_formatted = new Date(userData.fecha_nacimiento).toISOString().slice(0, 10);
  
      const [result] = await connection.query(
        `UPDATE users SET 
          nombres = ?,
          apellidos = ?,
          tipo_documento = ?,
          numero_documento = ?,
          genero = ?,
          email = ?,
          telefono = ?,
          estado = ?,
          fecha_nacimiento = ?
        WHERE id = ?`,
        [
          userData.nombres,
          userData.apellidos,
          userData.tipo_documento,
          userData.numero_documento,
          userData.genero,
          userData.email,
          userData.telefono,
          userData.estado,
          fecha_nacimiento_formatted, // Usar la fecha formateada
          id
        ]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
  

  static async deactivate(id) {
    const [result] = await pool.query(
      'UPDATE users SET estado = false WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
  

  static async list() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  }
}

module.exports = User;