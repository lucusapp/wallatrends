import fs from 'fs/promises';
import path from 'path';

const actualizarProductos = async (productosNuevos, keyword = "ps5") => {
  const filePath = `./data/${keyword.replace(/\s+/g, "_")}_resultados.json`;

  let productosAntiguos = [];

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    productosAntiguos = JSON.parse(data);
  } catch (err) {
    console.warn("No existe archivo previo, se creará uno nuevo.");
  }

  const productosActualizados = productosNuevos.map((nuevo) => {
    const anterior = productosAntiguos.find(p => p.id === nuevo.id);

    if (anterior) {
      nuevo.primer_scrapeo = anterior.primer_scrapeo || nuevo.primer_scrapeo || new Date().toISOString();
      nuevo.historial_cambios = anterior.historial_cambios || [];

      // Comparamos precio
      const precioAntiguo = extraerNumero(anterior.price);
      const precioNuevo = extraerNumero(nuevo.price);

      if (precioAntiguo !== precioNuevo) {
        nuevo.historial_cambios.push({
          fecha: new Date().toISOString(),
          tipo: 'cambio_precio',
          de: precioAntiguo,
          a: precioNuevo
        });
      }

      // Comparamos favoritos
      if (anterior.favoritos !== undefined && nuevo.favoritos !== undefined && anterior.favoritos !== nuevo.favoritos) {
        nuevo.historial_cambios.push({
          fecha: new Date().toISOString(),
          tipo: 'cambio_favoritos',
          de: anterior.favoritos,
          a: nuevo.favoritos
        });
      }

      // Comparamos visitas
      if (anterior.visitas !== undefined && nuevo.visitas !== undefined && anterior.visitas !== nuevo.visitas) {
        nuevo.historial_cambios.push({
          fecha: new Date().toISOString(),
          tipo: 'cambio_visitas',
          de: anterior.visitas,
          a: nuevo.visitas
        });
      }

      // Comparamos estado (opcional)
      if (anterior.estado && nuevo.estado && anterior.estado !== nuevo.estado) {
        nuevo.historial_cambios.push({
          fecha: new Date().toISOString(),
          tipo: 'cambio_estado',
          de: anterior.estado,
          a: nuevo.estado
        });
      }

    } else {
      // Es producto nuevo
      nuevo.primer_scrapeo = new Date().toISOString();
      nuevo.historial_cambios = [];
    }

    return nuevo;
  });

  await fs.writeFile(filePath, JSON.stringify(productosActualizados, null, 2));
  console.log("✅ Productos actualizados correctamente.");
};

// Helper
const extraerNumero = (cadena) => {
  const match = cadena.match(/\d+/g);
  return match ? parseInt(match.join("")) : 0;
};

export default actualizarProductos;
