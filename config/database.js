const mysql = require('mysql2/promise');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Detectar si estamos en producción y si tenemos INSTANCE_CONNECTION_NAME
if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_CONNECTION_NAME) {
  // Conexión a través del socket Unix
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  console.log(`Conectando a la base de datos mediante socketPath: ${config.socketPath}`);
} else {
  // Conexión local o en desarrollo
  config.host = process.env.DB_HOST || 'localhost';
  console.log(`Conectando a la base de datos mediante host: ${config.host}`);
}

const pool = mysql.createPool(config);

// Probar la conexión
pool.getConnection()
  .then(connection => {
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error);
  });

module.exports = pool;
