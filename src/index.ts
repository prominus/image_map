import {GameSystem, jsonExtractor} from "./workers/json_extractor";
import extractAllImages, { printAllImages } from "./workers/pdf_extractor";

(async () => {
  try {
    let json_schema = jsonExtractor(GameSystem.Starfinder, "Alien Archive 1");
    console.log(json_schema);
    json_schema = jsonExtractor(GameSystem.Starfinder, "garbage");
    console.log(json_schema);
    const pdf_path = "/home/riftraft/image_map/input/Starfinder - Alien Archive 1.pdf";
    const output_path = "/home/riftraft/image_map/output";
    let images = await extractAllImages(pdf_path);
    await printAllImages(output_path, images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
})();