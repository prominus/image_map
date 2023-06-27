import pkg, { PDFDocumentProxy} from "pdfjs-dist/legacy/build/pdf.js";
const { getDocument, OPS} = pkg;
import sharp from "sharp";
import Path from "path";
import { fileURLToPath } from "url";

const __dirname = Path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
//https://github.com/mablay/pdf-export-images/tree/main
// const p = "/home/riftraft/image_map/build/webpack/pdf.worker.bundle.js";
// // Setting worker path to worker bundle
// pdfjsLib.GlobalWorkerOptions.workerSrc = p;

async function main() {
  const path = "/home/riftraft/image_map/input/Starfinder - Alien Archive 1.pdf";
  let pdf = await getDocument(path).promise;

  const totalNumPages = pdf._pdfInfo.numPages;
  const pagesPromises = [];

  for (let currentPage = 1; currentPage <= totalNumPages; currentPage += 1) {
    pagesPromises.push(getPageImages(currentPage, pdf));
  }

  const pagesData = await Promise.all(pagesPromises);
  console.log(pagesData);

}

async function getPageImages(pageNum: number, pdf: PDFDocumentProxy) {
  try {
    const pdfPage = await pdf.getPage(pageNum);
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
            const bytes = image.data.length;
            const channels = bytes / width / height;
            const file = Path.join(__dirname, '..', 'output', `${imageName}.png`)
            await sharp(image.data, {
              // @ts-ignore
              raw: { width, height, channels }
            }).toFile(file);
            // console.log('canvas > toDataURL', canvas.toDataURL());
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  try {
    let t = main();
    console.log(t);
  } catch (error) {
    console.log(`Error running main: ${error}`);
  }
})();