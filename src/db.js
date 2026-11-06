const { Pool } = require('pg');

// Configuración de la conexión usando las variables de entorno de Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras en la nube
  }
});

pool.on('connect', () => {
  console.log('Base de datos conectada exitosamente');
});

module.exports = pool;
