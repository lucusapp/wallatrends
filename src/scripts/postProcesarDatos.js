// scripts/postProcesarDatos.js

import fs from 'fs';
import path from 'path';
import { guardarAnalisis } from '../utils/guardarDatos.js';

// Función para cargar los productos del día
function cargarProductos(fecha) {
  const filePath = path.join('datos', fecha, 'productos.json');
  if (!fs.existsSync(filePath)) {
    console.error('No se encontró el archivo de productos:', filePath);
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Función para procesar los datos
function procesarProductos(productos) {
  const analisis = [];

  productos.forEach(producto => {
    const analizado = {
      id: producto.id,
      titulo: producto.titulo,
      modelo: producto.modelo || producto.titulo, // fallback si no hay modelo definido
      precio_actual: producto.precio,
      visitas: producto.visitas || 0,
      favoritos: producto.favoritos || 0,
      estado: producto.estado || 'desconocido',
      reservado: producto.reservado || false,
      fecha_publicacion: producto.fecha_publicacion || 'desconocida',
      
      // Iniciamos histórico si no existía
      primer_scrapeo: producto.primer_scrapeo || new Date().toISOString().slice(0,10),
      historial_posiciones: [
        {
          fecha: new Date().toISOString().slice(0,10),
          posicion: producto.posicion_busqueda || null
        }
      ],

      // Métricas básicas que luego podemos ir ampliando
      cambios_precio: [],
      historial_visitas: [],
      historial_favoritos: [],
    };

    analisis.push(analizado);
  });

  return analisis;
}

// Función principal
function postProcesar(fecha) {
  const productos = cargarProductos(fecha);
  if (productos.length === 0) {
    console.log('No hay productos para procesar.');
    return;
  }

  const analisis = procesarProductos(productos);

  // Guardamos el análisis
  guardarAnalisis(analisis);

  console.log(`Procesamiento terminado para ${fecha}. Análisis generado.`);
}

// Para correr el script
const fechaHoy = new Date().toISOString().slice(0, 10);
postProcesar(fechaHoy);
