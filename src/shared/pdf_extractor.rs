// Referencing: https://github.com/pdf-rs/pdf/blob/677152fa8e84a2dcfbc3d927535148bb8d0369ba/pdf/examples/read.rs#L58
use std::{collections::HashMap, fs, rc::Rc, sync::Arc};

use pdf::{
    self,
    enc::StreamFilter,
    file::FileOptions,
    object::{RcRef, Resolve, XObject},
};

pub struct PdfInfo {
    pub title: String,
    pub author: String,
    // TODO: check a UUID on the book?
}

impl PdfInfo {
    pub fn new() -> Self {
        PdfInfo {
            title: String::new(),
            author: String::new(),
        }
    }
}

pub struct ImageObject {
    extension: Rc<str>,
    raw_image_data: Arc<[u8]>,
}

pub fn get_document(file_path: &str) -> (PdfInfo, HashMap<u32, ImageObject>) {
    // Read in the file to a buffer
    let file = FileOptions::cached().open(&file_path).unwrap();
    let mut pdf_info: PdfInfo = PdfInfo::new();
    if let Some(ref info) = file.trailer.info_dict {
        for (&ref name, &ref prim) in info {
            println!("Here is info {} value {}", name, prim)
        }
        let title = info.get("Title").and_then(|p| p.to_string_lossy().ok());
        match title {
            Some(t) => pdf_info.title = t,
            _ => (),
        }
        let author = info.get("Author").and_then(|p| p.to_string_lossy().ok());
        match author {
            Some(a) => pdf_info.author = a,
            _ => (),
        }
    }

    // The raw images
    let mut raw_images: Vec<RcRef<XObject>> = vec![];

    // Iterate over images and extract raw images
    for page in file.pages() {
        let page = page.unwrap();
        let resources = page.resources().unwrap();

        raw_images.extend(
            resources
                .xobjects
                .iter()
                .map(|(_name, &r)| file.get(r).unwrap())
                .filter(|o| matches!(**o, XObject::Image(_))),
        );
    }

    // Create a image vector to map with the JSON file
    let mut images: HashMap<u32, ImageObject> = HashMap::with_capacity(raw_images.capacity());

    // Iterate over raw images and generate the image vector
    for (image_index, o) in (0u32..).zip(raw_images.iter()) {
        let img = match **o {
            XObject::Image(ref im) => im,
            _ => continue,
        };
        let Ok((data, filter)) = img.raw_image_data(&file) else { continue };
        let ext = match filter {
            Some(StreamFilter::DCTDecode(_)) => "jpeg",
            Some(StreamFilter::JBIG2Decode) => "jbig2",
            Some(StreamFilter::JPXDecode) => "jp2k",
            _ => {
                // TODO: handle indexes and ICC color profiles
                // Maybe this can help with te icc profile: https://github.com/kornelski/rust-lcms2
                // let color_space = &img.color_space;
                // let color_type = match color_space {
                //     Some(ColorSpace::Indexed(b_box, i)) => {
                //         println!("Indexed");
                //         continue;
                //     }
                //     Some(ColorSpace::Icc(ref_e)) => {
                //         println!("Icc");
                //         continue;
                //     }
                //     _ => continue,
                // };
                continue;
            }
        };
        images.insert(
            image_index,
            ImageObject {
                extension: ext.into(),
                raw_image_data: Arc::clone(&data),
            },
        );
    }
    // Return the vector
    println!("Found {} image(s).", images.len());
    (pdf_info, images)
}

pub fn write_to_output(folder_path: &str, images: HashMap<u32, ImageObject>) {
    for (index, image) in images {
        if let Err(err) = fs::create_dir_all(folder_path) {
            println!("Failed to create folder: {}", err);
        } else {
            println!("Folder created successfully.")
        }

        let fname = format!("{}/image_{}.{}", folder_path, index, image.extension);

        let _ = fs::write(fname.as_str(), image.raw_image_data);
    }
}