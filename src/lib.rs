use std::sync::{Arc, Mutex};
use std::thread;
use wasm_bindgen::prelude::*;
use web_sys;
mod shared;

use crate::shared::json_extractor;
use crate::shared::pdf_extractor;

#[wasm_bindgen]
pub fn run(file_data: &[u8], schema: &JsValue) {
    // let file_path = "C:\\Users\\Magenta\\Documents\\rust_webassembly\\image_map\\input\\PZO7105E.pdf";
    // let schema_path = "C:\\Users\\Magenta\\Documents\\rust_webassembly\\image_map\\schema\\starfinder_alien_archive_1.json";

    let schema = json_extractor::read_doc_from_value(schema.clone());
    println!("x");

    let t = temp_file::with_contents(file_data);

    let (_, images) = pdf_extractor::get_document(t.path());
    let folder_path = "output/alien_archive_1";
    // let folder_path = "output/alien_archive1";
    pdf_extractor::write_to_output(folder_path, images);

    // a dummy memory item to be read in
    let numbers: Vec<u32> = (1..=100).collect();

    // The top level stack
    let stack: Vec<u32> = Vec::with_capacity(numbers.capacity());

    // Provide ownership of stack between the readers and writers
    let w_stack_ref = Arc::new(Mutex::new(stack));
    let r_stack_ref = Arc::clone(&w_stack_ref);

    // Provide ownership of a cancellation token flag between readers and writers
    let w_cancellation_token = Arc::new(Mutex::new(false));
    let r_cancellation_token = Arc::clone(&w_cancellation_token);

    let writer = thread::spawn(move || {
        // Iteratively 'write' incoming buffer to the stack
        for n in numbers {
            let mut w = w_stack_ref.lock().unwrap();
            // will be a debut line
            println!("Pushing value of {}", n);
            w.push(n);
        }
        // When iteration is complete set the cancellation token
        let mut ct = w_cancellation_token.lock().unwrap();
        *ct = true;
    });

    let reader = thread::spawn(move || {
        // Infinitely check for new items in stack.
        // Breaks out only when cancellation token is set and the stack is empty.
        loop {
            let mut r = r_stack_ref.lock().unwrap();
            // Ordering for my use case is not important
            match r.pop() {
                Some(i) => {
                    // Right now we are just printing what we read
                    println!("Read value of {}", i);
                }
                None => {
                    let ct = r_cancellation_token.lock().unwrap();
                    if *ct == true {
                        // Will only be hit once the writer thread has raised the cancellation.
                        break;
                    }
                }
            }
        }
    });

    reader.join().unwrap();
    writer.join().unwrap();
}
