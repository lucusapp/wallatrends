// utils/guardarDatos.js

import fs from 'fs';
import path from 'path';

// Función auxiliar para crear carpeta si no existe
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Guardar productos brutos del scrapeo
export function guardarProductos(productos) {
  const fechaHoy = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
  const dirPath = path.join('datos', fechaHoy);
  ensureDirSync(dirPath);

  const filePath = path.join(dirPath, 'productos.json');
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
}

// Guardar análisis procesado
export function guardarAnalisis(analisis) {
  const fechaHoy = new Date().toISOString().slice(0, 10);
  const dirPath = path.join('datos', fechaHoy);
  ensureDirSync(dirPath);

  const filePath = path.join(dirPath, 'analisis.json');
  fs.writeFileSync(filePath, JSON.stringify(analisis, null, 2));
}
