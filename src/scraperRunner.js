// src/scraperRunner.js (o como se llame tu script principal)

import { scrapeWallapop } from './scraper.js'; // Tu scraper real
import actualizarProductos from '../postprocesador.js'; // El nuevo postprocesador
import fs from 'fs/promises';

// 👇 Aquí defines qué keyword quieres buscar
const keyword = process.argv[2] || "ps5"; // Puedes pasar la keyword como argumento

async function ejecutarScraping() {
  try {
    console.log(`🔎 Iniciando scraping para la keyword: "${keyword}"...`);

    // Ejecutamos tu scraper (esto ya lo tienes)
    const productos = await scrapeWallapop(keyword);

    console.log(`📥 Productos capturados: ${productos.length}`);

    // Ahora en lugar de escribir directamente, llamamos al postprocesador
    await actualizarProductos(productos, keyword);

    console.log("✅ Postprocesamiento completado y datos actualizados.");

  } catch (error) {
    console.error("❌ Error durante el scraping:", error);
  }
}

ejecutarScraping();
