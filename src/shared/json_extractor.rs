use serde::{Deserialize, Serialize};
use serde_json;
use serde_wasm_bindgen;
use wasm_bindgen::JsValue;
use std::{error, fs::File, io::BufReader, path::Path, collections::HashMap};

#[derive(Serialize, Deserialize)]
pub struct Npc2 {
    pub id: String,
    pub full: u32,
    pub icon: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Doc {
    pub title: String,
    pub author: String,
    pub creation_date: String,
    pub npc2: HashMap<String, Npc2>,
}


pub fn read_doc_from_file<P: AsRef<Path>>(path: P) -> Result<Doc, Box<dyn error::Error>> {
    // Open the file in read-only mode with buffer.
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    // Read the JSON contents of the file as an instance of `User`.
    let doc: Doc = serde_json::from_reader(reader)?;

    Ok(doc)
}


pub fn read_doc_from_value(val: JsValue) -> Result<Doc, serde_wasm_bindgen::Error> {
    let doc: Doc = serde_wasm_bindgen::from_value(val)?;

    Ok(doc)
}
