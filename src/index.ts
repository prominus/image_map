import Path from "path";
import { fileURLToPath } from "url";
import extractAllImages, { printAllImages } from "./workers/pdf_extractor.js";

const __dirname = Path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);


(async () => {
  try {
    const path = "/home/riftraft/image_map/input/Starfinder - Alien Archive 1.pdf";
    let images = await extractAllImages(path);
    await printAllImages(Path.join(__dirname, "..", "output"), images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
})();