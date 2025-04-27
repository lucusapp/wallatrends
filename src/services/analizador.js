import fs from 'fs/promises';

const detectarChollos = async (keyword = "ps5") => {
  const filePath = `./data/${keyword.replace(/\s+/g, "_")}_resultados.json`;

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const productos = JSON.parse(data);

    const precios = productos.map(p => {
      const match = p.price.match(/\d+/g);
      return match ? parseInt(match.join("")) : 0;
    }).filter(p => p > 0);

    const media = precios.reduce((a, b) => a + b, 0) / precios.length;
    const umbral = media * 0.7; // 30% más barato que la media

    const chollos = productos.filter(p => {
      const match = p.price.match(/\d+/g);
      const precio = match ? parseInt(match.join("")) : 0;
      return precio > 0 && precio <= umbral;
    });

    console.log(`📊 Precio medio: ${media.toFixed(2)}€`);
    console.log(`🔥 Detectados ${chollos.length} chollos (por debajo de ${umbral.toFixed(2)}€):\n`);

    chollos.forEach(p => {
      console.log(`🛒 ${p.title} — ${p.price} — ${p.location}`);
      console.log(`🔗 ${p.link}`);
      console.log('---');
    });
  } catch (error) {
    console.error("❌ Error leyendo o analizando el archivo:", error.message);
  }
};

const keyword = process.argv[2] || "ps5";
detectarChollos(keyword);
