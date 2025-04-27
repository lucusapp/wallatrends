// utils/analizarLoteProductos.js

const { analizarProductoCompleto } = require('./analizarProductoCompleto');

/**
 * Analiza un lote completo de productos
 * @param {Array} productos - Array de productos a analizar
 * @returns {Array} - Array de métricas de cada producto
 */
function analizarLoteProductos(productos) {
  if (!Array.isArray(productos)) {
    throw new Error('El lote de productos debe ser un array.');
  }

  return productos.map(producto => analizarProductoCompleto(producto));
}

module.exports = {
  analizarLoteProductos,
};
