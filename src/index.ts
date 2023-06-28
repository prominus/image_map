import { ArgumentParser } from "argparse";
import { GameSystem, jsonExtractor } from "./workers/json_extractor";
import getPdfDafa, { printAllImages } from "./workers/pdf_extractor";

const parser = new ArgumentParser({ description: "Extract some images"});

interface Args {
  pdf_path:string,
  output_path:string
}

parser.add_argument('pdf_path', {
  type: 'string',
  help: "The absolute file path to the PDF",
});
parser.add_argument('output_path', {
  type: 'string',
  help: "The output folder",
});

let args: Args = parser.parse_args();

async function main(args: Args) {
  try {
    // Get PDF
    let pdf_data = await getPdfDafa(args.pdf_path);
    
    // Get Schema
    let json_schema = jsonExtractor(GameSystem.Starfinder, pdf_data.title);
    if (json_schema === undefined) {
        console.log("schema not found");
        return;
    }

    // TODO: determine what images to save
    // await printAllImages(args.output_path, images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
}

await main(args);