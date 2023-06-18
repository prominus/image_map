// #![allow(unused)]
// #![allow(dead_code)]


use std::collections::VecDeque;
use std::thread;
use std::sync::{Arc, Mutex};

fn main() {

    // a dummy memory item to be read in
    let numbers: Vec<u32> = (1..=100).collect();
    
    // The top level queue.
    let queue: VecDeque<u32> = VecDeque::with_capacity(numbers.capacity());

    // Provide ownership of queue between the readers and writers
    let w_queue_ref = Arc::new(Mutex::new(queue));
    let r_queue_ref = Arc::clone(&w_queue_ref);

    // Provide ownership of a cancellation token flag between readers and writers
    let w_cancellation_token = Arc::new(Mutex::new(false));
    let r_cancellation_token = Arc::clone(&w_cancellation_token);

    let writer = thread::spawn(move || {
        // Iteratively 'write' incoming buffer to the queue
        for n in numbers {
            let mut w = w_queue_ref.lock().unwrap();
            // will be a debut line
            println!("Pushing value of {}", n);
            w.push_back(n);
        }
        // When iteration is complete set the cancellation token
        let mut ct = w_cancellation_token.lock().unwrap();
        *ct = true;
    });

    let reader = thread::spawn(move || {
        // Infinitely check for new items in queue.
        // Breaks out only when cancellation token is set and queue is empty.
        loop {
            let mut r = r_queue_ref.lock().unwrap();
            match r.pop_front() {
                Some(i) => { 
                    // Right now we are just printing what we read
                    println!("Read value of {}", i);
                },
                None => {
                    let ct = r_cancellation_token.lock().unwrap();
                    if *ct == true {
                        // Will only be hit once the writer thread has raised the cancellation.
                        break;
                    }
                },
            }
        }
    });

    reader.join().unwrap();
    writer.join().unwrap();
}
