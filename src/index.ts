import fs from "fs";
import { GameSystem, iDictionary, iStarfinderDoc, isiDictionary } from "./mapping/json_map";
import { jsonExtractor } from "./workers/json_extractor";
import getPdfData from "./workers/pdf_extractor";
import { printAllImagesToPng, printAllImagesToWebP, generateJNodeImages } from "./workers/image_saver";
import { Args, args, } from "./args";


async function main(args: Args) {
  try {
    // Get PDF
    let pdf_data = await getPdfData(args.pdf_path);

    // Get schema
    let json_schema = (jsonExtractor(GameSystem.Starfinder, pdf_data.title) as iStarfinderDoc);
    if (json_schema === undefined) {
      console.log("schema not found");
      return;
    }

    // Map images
    Object.entries(json_schema.assets).forEach(async ([assetType, dictionary]) => {
        // const key = Object.keys(json_schema.alien_archives)[0];
        const folder = `${args.output_path}/${json_schema.name}/${assetType}`;
        await fs.promises.mkdir(folder, { recursive: true });
        await generateJNodeImages(folder, ['actor', 'token'], dictionary, pdf_data.images);

    });

    // TODO: determine what images to save
    // await printAllImagesToWebP(args.output_path, pdf_data.images);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
}

await main(args);