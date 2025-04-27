// utils/detectorVenta.js

const dayjs = require('dayjs'); // Necesitamos instalar dayjs para manejar fechas

/**
 * Detecta si un producto fue vendido (reservado) y calcula el tiempo hasta su venta.
 * @param {Object} producto - Producto a analizar
 * @returns {Object} - Información sobre la venta
 */
function detectarVentaProducto(producto) {
  const historial = producto.historial || [];
  if (historial.length === 0) return { vendido: false };

  let fechaVenta = null;

  for (const registro of historial) {
    if (registro.estado === 'reservado') {
      fechaVenta = registro.fecha;
      break;
    }
  }

  if (!fechaVenta) {
    return { vendido: false };
  }

  const fechaPrimerScrapeo = producto.primer_scrapeo || historial[0]?.fecha;
  const diasHastaVenta = dayjs(fechaVenta).diff(dayjs(fechaPrimerScrapeo), 'day');

  return {
    vendido: true,
    fecha_venta: fechaVenta,
    dias_hasta_venta: diasHastaVenta,
  };
}

module.exports = {
  detectarVentaProducto,
};
