// utils/analizarProductoCompleto.js

const dayjs = require('dayjs');

/**
 * Analiza en profundidad un producto a partir de su historial de cambios
 * @param {Object} producto - Producto a analizar
 * @returns {Object} - Métricas completas
 */
function analizarProductoCompleto(producto) {
  const historial = producto.historial || [];
  if (historial.length === 0) {
    return { error: 'No hay historial disponible' };
  }

  let vendido = false;
  let fechaVenta = null;
  let precios = [];
  let posiciones = [];
  let visitas = [];
  let favoritos = [];

  historial.forEach((registro) => {
    if (registro.estado === 'reservado' && !vendido) {
      vendido = true;
      fechaVenta = registro.fecha;
    }
    if (registro.precio) precios.push(registro.precio);
    if (registro.posicion != null) posiciones.push(registro.posicion);
    if (registro.visitas != null) visitas.push(registro.visitas);
    if (registro.favoritos != null) favoritos.push(registro.favoritos);
  });

  const fechaPrimerScrapeo = producto.primer_scrapeo || historial[0].fecha;
  const diasHastaVenta = vendido ? dayjs(fechaVenta).diff(dayjs(fechaPrimerScrapeo), 'day') : null;

  const precioInicial = precios.length > 0 ? precios[0] : null;
  const precioFinal = precios.length > 0 ? precios[precios.length - 1] : null;
  const precioMin = precios.length > 0 ? Math.min(...precios) : null;
  const precioMax = precios.length > 0 ? Math.max(...precios) : null;

  const posicionMedia = posiciones.length > 0 ? (posiciones.reduce((a, b) => a + b, 0) / posiciones.length).toFixed(2) : null;
  const visitasTotales = visitas.length > 0 ? visitas[visitas.length - 1] : 0;
  const favoritosTotales = favoritos.length > 0 ? favoritos[favoritos.length - 1] : 0;

  return {
    id: producto.id,
    primer_scrapeo: fechaPrimerScrapeo,
    vendido,
    fecha_venta: fechaVenta,
    dias_hasta_venta: diasHastaVenta,
    precio_inicial: precioInicial,
    precio_final: precioFinal,
    precio_min: precioMin,
    precio_max: precioMax,
    posicion_media: posicionMedia,
    visitas_totales: visitasTotales,
    favoritos_totales: favoritosTotales,
  };
}

module.exports = {
  analizarProductoCompleto,
};
