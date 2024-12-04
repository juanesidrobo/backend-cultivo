const pool = require('../config/database');

const resenaController = {
  // Obtener reseñas por producto
  async getResenasByProducto(req, res) {
    const { codigo_producto } = req.params;
    try {
      // Calcular el promedio de estrellas
      const [promedio] = await pool.query(
        `SELECT AVG(numero_estrellas) AS promedio 
         FROM tbl_resenas 
         JOIN tbl_resenas_productos ON tbl_resenas.id_resena = tbl_resenas_productos.id_resena 
         WHERE tbl_resenas_productos.codigo_producto = ?`,
        [codigo_producto]
      );

      // Obtener las reseñas con detalles de clientes
      const [resenas] = await pool.query(
        `SELECT r.numero_estrellas, r.comentario, c.nombre AS cliente 
         FROM tbl_resenas r 
         JOIN tbl_resenas_productos rp ON r.id_resena = rp.id_resena 
         JOIN tbl_cliente_resenas cr ON r.id_resena = cr.id_resena 
         JOIN tbl_cliente c ON cr.id_cliente = c.cedula 
         WHERE rp.codigo_producto = ?`,
        [codigo_producto]
      );

      // Responder con el promedio y las reseñas
      res.json({
        promedio: parseFloat(promedio[0]?.promedio || 0).toFixed(1), // Formatear el promedio a 1 decimal
        resenas, // Devuelve solo el array de reseñas
      });
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      res.status(500).json({ message: 'Error al obtener reseñas.' });
    }
  },

  // Crear una nueva reseña
  async createResena(req, res) {
    const { id_cliente, codigo_producto, numero_estrellas, comentario } = req.body;
    try {
      // Insertar la reseña en tbl_resenas
      const [result] = await pool.query(
        `INSERT INTO tbl_resenas (numero_estrellas, comentario) VALUES (?, ?)`,
        [numero_estrellas, comentario]
      );
      const id_resena = result.insertId;

      // Relacionar la reseña con el producto en tbl_resenas_productos
      await pool.query(
        `INSERT INTO tbl_resenas_productos (id_resena, codigo_producto) VALUES (?, ?)`,
        [id_resena, codigo_producto]
      );

      // Relacionar la reseña con el cliente en tbl_cliente_resenas
      await pool.query(
        `INSERT INTO tbl_cliente_resenas (id_cliente, id_resena) VALUES (?, ?)`,
        [id_cliente, id_resena]
      );

      res.status(201).json({ message: 'Reseña creada con éxito.' });
    } catch (error) {
      console.error('Error al crear reseña:', error);
      res.status(500).json({ message: 'Error al crear reseña.' });
    }
  },
};

module.exports = resenaController;
