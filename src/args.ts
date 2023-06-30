import { ArgumentParser } from "argparse";

// CLI argument parsing
const parser = new ArgumentParser({ description: "Extract some images" });
export interface Args {
    pdf_path: string,
    output_path: string
}
parser.add_argument('pdf_path', {
    type: 'str',
    help: "The absolute file path to the PDF",
});
parser.add_argument('output_path', {
    type: 'str',
    help: "The output folder",
});
export const args: Args = parser.parse_args();