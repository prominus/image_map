import extractAllImages, { printAllImages } from "./workers/pdf_extractor";

(async () => {
  try {
    const pdf_path = "/home/riftraft/image_map/input/Starfinder - Alien Archive 1.pdf";
    const output_path = "/home/riftraft/image_map/output";
    let images = await extractAllImages(pdf_path);
    await printAllImages(output_path, images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
})();