import ImageMap from "../mapping/image_map";
import { iDictionary } from "../mapping/json_map";
import sharp from "sharp";

/**
 * Save images to an output folder
 * @param outputFolder - Location to save the images
 * @param images - List of images to save
 */
export async function printAllImagesToPng(outputFolder: string, images: ImageMap[]) {
    images.forEach(async (image: ImageMap) => {
        const file = outputFolder + `/${image.name}.png`;
        const width = image.width;
        const height = image.height;
        const channels = image.channels();
        await sharp(image.data, {
            raw: { width, height, channels }
        }).toFile(file);
    });
}

/**
 * Save images to an output folder
 * @param outputFolder - Location to save the images
 * @param images - List of images to save
 */
export async function printAllImagesToWebP(outputFolder: string, images: ImageMap[]) {
    images.forEach(async (image: ImageMap) => {
        const file = outputFolder + `/${image.name}.webp`;
        await saveWebPImage(image, file);
    });
}

// 
export async function generateJNodeImages(prefix: string, extMods: string[], dictionary: iDictionary, images: ImageMap[]) {
    const re1 = /[ ]/gi;
    const re2 = /[\W]/gi;
    const re3 = /[_]/gi;
    Object.entries(dictionary).forEach(([key, value]) => {

        // let files = extMod.map(x => `${outputFolder}/${jsonKey.toLowerCase().replace(re1, '_').replace(re2, '').replace(re3, '-')}.${x}.webp`);
        extMods.forEach(async x => {
            // Create the file
            const file = `${prefix}/${key.toLowerCase().replace(re1, '_').replace(re2, '').replace(re3, '-')}.${x}.webp`;
            // Special case for token
            if (x === 'token' && value.icon !== undefined) {
                const image = images.find(y => y.name === value.icon);
                // TODO - put it in a circle banner
                await saveWebPImage(image, file);
            } else {
                const image = images.find(y => y.name === value.orig);
                await saveWebPImage(image, file);
            }

        });
    });
}

async function saveWebPImage(image: ImageMap | undefined, file: string) {
    if (image != undefined) {
        const width = image.width;
        const height = image.height;
        const channels = image.channels();
        await sharp(image.data, {
            raw: { width, height, channels }
        }).toFile(file);
        console.log(`Image saved ${file}`);
    }
}
