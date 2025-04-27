// utils/estadisticasRendimiento.js

/**
 * Analiza el rendimiento histórico de un producto concreto.
 * @param {Object} producto - Un producto con historial
 * @returns {Object} - Métricas de rendimiento
 */
function analizarRendimientoProducto(producto) {
    const historial = producto.historial || [];
    if (historial.length === 0) return {};
  
    const posiciones = [];
    const visitas = [];
    const favoritos = [];
  
    for (const registro of historial) {
      if (registro.posicion != null) posiciones.push(registro.posicion);
      if (registro.visitas != null) visitas.push(registro.visitas);
      if (registro.favoritos != null) favoritos.push(registro.favoritos);
    }
  
    const promedio = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  
    const posicionMedia = Number(promedio(posiciones).toFixed(2));
    const visitasTotales = visitas[visitas.length - 1] - visitas[0];
    const favoritosTotales = favoritos[favoritos.length - 1] - favoritos[0];
  
    const interesRelativo = Number(
      ((visitasTotales + favoritosTotales * 2) / posiciones.length).toFixed(2)
    );
  
    return {
      posicion_media: posicionMedia,
      visitas_totales: visitasTotales,
      favoritos_totales: favoritosTotales,
      interes_relativo: interesRelativo,
    };
  }
  
  module.exports = {
    analizarRendimientoProducto,
  };
  