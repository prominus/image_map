import { ArgumentParser } from "argparse";
import { GameSystem, jsonExtractor } from "./workers/json_extractor";
import extractAllImages, { printAllImages } from "./workers/pdf_extractor";

// TODO: constants will be parameters

// const pdf_path = "C:/Users/Magenta/Documents/rust_webassembly/image_map/input/PZO7105E.pdf";
// const output_path = "C:/Users/Magenta/Documents/rust_webassembly/image_map/output";

const parser = new ArgumentParser({ description: "Extract some images"});

parser.add_argument('pdf_path', {
  type: 'string',
  help: "The absolute file path to the PDF",
});
parser.add_argument('output_path', {
  type: 'string',
  help: "The output folder",
});

let args = parser.parse_args();

async function main(args: any) {
  try {
    // TODO: title should be gathered from pdf
    const pdf_title = "PZ07105E.pdf"

    let images = await extractAllImages(pdf_path);

    let json_schema = jsonExtractor(GameSystem.Starfinder, "Alien Archive 1");
    console.log(json_schema);
    await printAllImages(output_path, images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
}

await main(args);