// utils/estadisticasEstado.js

/**
 * Analiza productos por modelo agrupando por estado.
 * @param {Array<Object>} productos - Lista de productos del mismo modelo
 * @returns {Object} - Métricas por estado
 */
function analizarComparativaEstado(productos) {
    const resultados = {};
  
    for (const producto of productos) {
      const estado = producto.estado || 'Desconocido';
      const precio = parseFloat(producto.precio.replace(/[^\d,.-]/g, '').replace(',', '.'));
  
      if (!resultados[estado]) {
        resultados[estado] = {
          precios: [],
          ids: [],
        };
      }
  
      resultados[estado].precios.push(precio);
      resultados[estado].ids.push(producto.id);
    }
  
    const comparativa = {};
  
    for (const [estado, data] of Object.entries(resultados)) {
      const precios = data.precios.sort((a, b) => a - b);
      const promedio = precios.reduce((a, b) => a + b, 0) / precios.length;
      const mejor = precios[precios.length - 1];
      const peor = precios[0];
  
      comparativa[estado] = {
        promedio_estado: Number(promedio.toFixed(2)),
        mejor_estado: mejor,
        peor_estado: peor,
      };
    }
  
    return comparativa;
  }
  
  module.exports = {
    analizarComparativaEstado,
  };
  