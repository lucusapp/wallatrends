import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const searchTerm = process.argv[2];

export async function scrapeWallapop(query) {
    console.log(`🔍 Buscando "${query}" en Wallapop...`);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Muy importante: Evita que te sirvan HTML vacío o diferente
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    const url = `https://es.wallapop.com/app/search?keywords=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // Espera a que los productos aparezcan
    await page.waitForSelector(".ItemCard__title");

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".ItemCard"));
      return items.map(item => {
        const title = item.querySelector(".ItemCard__title")?.innerText.trim() || "";
        const price = item.querySelector(".ItemCard__price")?.innerText.trim() || "";
        const image = item.querySelector("img")?.src || "";
        return { title, price, image };
      });
    });

    console.log(`📦 Títulos encontrados: ${products.length}`);
    const filePath = path.resolve(`./data/${query}_scraped.json`);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
    console.log(`✅ Guardado en ${filePath} con ${products.length} productos.`);
    
    await browser.close();
    
    return products

}

scrapeWallapop(searchTerm).catch(err => {
    console.error("❌ Error durante el scraping:", err);
});
