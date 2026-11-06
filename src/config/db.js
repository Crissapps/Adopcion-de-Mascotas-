const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea el archivo base_datos.db en la raíz del proyecto.
const dbPath = path.resolve(__dirname, '../../base_datos.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
        return;
    }

    console.log('Conexión establecida con la base de datos local (SQLite)');
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS usuario (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_completo TEXT,
            correo TEXT UNIQUE,
            contrasena TEXT,
            rol TEXT DEFAULT 'usuario'
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS mascota (
            id_mascota INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            especie TEXT,
            raza TEXT,
            edad INTEGER,
            descripcion TEXT,
            estado TEXT DEFAULT 'disponible'
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS solicitud_adopcion (
            id_solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
            mascota TEXT NOT NULL,
            nombre TEXT NOT NULL,
            celular TEXT NOT NULL,
            direccion TEXT NOT NULL,
            correo TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
});

// Adaptador para que las rutas que usan la sintaxis de PostgreSQL también
// funcionen con SQLite.
db.query = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        const sqlCorregida = sql.replace(/\$\d+/g, '?');
        if (sqlCorregida.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sqlCorregida, params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows });
            });
        } else {
            db.run(sqlCorregida, params, function (err) {
                if (err) reject(err);
                else resolve({ rows: [{ id_usuario: this.lastID, id_mascota: this.lastID }] });
            });
        }
    });
};

module.exports = db;
