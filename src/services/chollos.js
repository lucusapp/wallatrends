// services/chollos.js

import fs from 'fs/promises';

export async function detectarChollos(nombreArchivo) {
  try {
    const data = await fs.readFile(nombreArchivo, 'utf-8');
    const productos = JSON.parse(data);

    const precios = productos.map(p => {
      const match = p.price?.toString().match(/\d+/g);
      return match ? parseInt(match.join("")) : 0;
    }).filter(p => p > 0);

    if (precios.length === 0) {
      console.log('⚠️ No hay precios válidos para analizar.');
      return [];
    }

    const media = precios.reduce((a, b) => a + b, 0) / precios.length;
    const umbral = media * 0.7; // Definimos chollo como 30% más barato que media

    const chollos = productos.filter(p => {
      const match = p.price?.toString().match(/\d+/g);
      const precio = match ? parseInt(match.join("")) : 0;
      return precio > 0 && precio <= umbral;
    }).map(p => ({
      titulo: p.title,
      precio: p.price,
      ubicacion: p.location,
      link: p.link
    }));

    console.log(`📈 Precio medio: ${media.toFixed(2)}€`);
    console.log(`🔥 Detectados ${chollos.length} chollos por debajo de ${umbral.toFixed(2)}€`);

    return chollos;

  } catch (error) {
    console.error("❌ Error analizando chollos:", error.message);
    return [];
  }
}
