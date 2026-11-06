// Configuración básica para levantar el servidor sin errores de base de datos local
console.log('Módulo de base de datos cargado correctamente.');

const db = {
  query: async (text, params) => {
    console.log('Ejecutando consulta simulada:', text);
    return { rows: [] };
  }
};

module.exports = db;
