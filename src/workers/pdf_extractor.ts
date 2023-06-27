import pkg, { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/legacy/build/pdf.js";
const { getDocument, OPS } = pkg;
import Path from "path";
import sharp from "sharp";
import ImageMap from "./image_map.js";

// Props to mablay for having a project to demonstrate the capability of pdfjs in a straightforward way!
// Here was their project: https://github.com/mablay/pdf-export-images/tree/main

export default async function extractAllImages(path: string): Promise<ImageMap[]> {
    let pdf: PDFDocumentProxy = await getDocument(path).promise;

    const totalNumPages = pdf.numPages;
    const pagesPromises = [];

    for (let currentPage = 1; currentPage <= totalNumPages; currentPage += 1) {
        const images = getPageImages(currentPage, pdf);
        pagesPromises.push(...await images);
    }

    return await Promise.all(pagesPromises);
}

async function getPageImages(pageNum: number, pdf: PDFDocumentProxy) {
    const images: ImageMap[] = [];
    try {
        const pdfPage: PDFPageProxy = await pdf.getPage(pageNum);
        const operatorList = await pdfPage.getOperatorList();

        const validObjectTypes = [
            OPS.paintJpegXObject,
            OPS.paintImageXObject,
            OPS.paintInlineImageXObject
        ];

        operatorList.fnArray
            .forEach((element, idx) => {
                if (validObjectTypes.includes(element)) {
                    const imageName = operatorList.argsArray[idx][0];
                    console.log('page', pageNum, 'imageName', imageName);

                    pdfPage.objs.get(imageName, async (image: any) => {
                        const { width, height, _kind } = image;
                        images.push(new ImageMap(imageName, width, height, image.data));
                    });
                }
            });
    } catch (error) {
        console.log(error);
    }
    return images;
}

export async function printAllImages(outputFolder: string, images: ImageMap[]) {
    images.forEach(async (image: ImageMap) => {
        const file = Path.join(outputFolder, `${image.name}.png`);
        const width = image.width;
        const height = image.height;
        const channels = image.channels();
        await sharp(image.data, {
            raw: { width, height, channels }
        }).toFile(file);
    });
}