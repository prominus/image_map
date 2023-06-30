import { PDFDocumentProxy, PDFPageProxy, getDocument, OPS, GlobalWorkerOptions } from "pdfjs-dist";
import ImageMap from "../mapping/image_map";

class PdfData{
    public images: ImageMap[];
    constructor(
        public title: string,
        public author: string,
        public creationDate: string,
    ) {
        this.images = [];
    }
}

// Setting worker path to worker bundle.
// Do not have webpack try to bundle with project. This just causes errors
GlobalWorkerOptions.workerSrc =
  "../node_modules/pdfjs-dist/build/pdf.worker.js";

/**
 * Extract all images and metadata from a PDF
 * 
 * @param path - Absolute file path to PDF
 * @returns A promised list of images and metadata from the PDF 
 */
export default async function getPdfDafa(path: string) {
    let pdf: PDFDocumentProxy = await getDocument(path).promise;

    const metadata = await pdf.getMetadata();
    let pdf_data = new PdfData(
        (metadata.info as any)['Title'],
        (metadata.info as any)['Author'],
        (metadata.info as any)['CreationDate']
    );
    const totalNumPages = pdf.numPages;

    // Iterate over all pages and push images to pagePromises
    for (let currentPage = 1; currentPage <= totalNumPages; currentPage += 1) {
        const images = getPageImages(currentPage, pdf);
        pdf_data.images.push(...await images);
    }

    return await pdf_data;
}

/**
 * Extract all images from the current PDF page
 * 
 * @param pageNum - The page number to grab
 * @param pdf - Reference to the PDF
 * @returns List of images from the PDF page
 */
async function getPageImages(pageNum: number, pdf: PDFDocumentProxy) {
    const images: ImageMap[] = [];
    try {
        const pdfPage: PDFPageProxy = await pdf.getPage(pageNum);
        const operatorList = await pdfPage.getOperatorList();

        // These indicate the element is an image
        const validObjectTypes = [
            OPS.paintJpegXObject,
            OPS.paintImageXObject,
            OPS.paintInlineImageXObject
        ];

        // Iterate over each element in the page and store any element inferred to be an image
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
