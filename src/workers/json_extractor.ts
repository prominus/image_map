// DnD5e imports
// ..

// Pathfinder1e imports
// ..

// Pathfinder2e imports
// ..

// Starfinder imports
import alien_archive_1 from "../system_mapping/sfrpg/alien_archive_1.json";
import alien_archive_2 from "../system_mapping/sfrpg/alien_archive_2.json";
import alien_archive_3 from "../system_mapping/sfrpg/alien_archive_3.json";

export enum GameSystem {
    DnD5e,
    Pathfinder,
    Patfhinder2e,
    Starfinder,
}

/**
 * Interface to provide name key for all JSON schemas
 */
interface namedJson {
    title: string
}

const dnd_list: namedJson[] = [
    // TODO
]

const pathfinder1_list: namedJson[] = [
    // TODO
]

const pathfinder2_list: namedJson[] = [
    // TODO
]

const starfinder_list: namedJson[] = [
    alien_archive_1,
    alien_archive_2,
    alien_archive_3,
];

/**
 * 
 * @param system - Specify the gaming system of choice
 * @param doc_name - Specify the name of the file
 * @returns The JSON schema for the PDF if found
 */
export function jsonExtractor(system: GameSystem, doc_name: string) {
    switch (system) {
        // Right now Starfinder is the only system so putting this at the top
        case GameSystem.Starfinder:
            return starfinderFactory(doc_name);
        case GameSystem.DnD5e:
            return dndFactory(doc_name);
        case GameSystem.Pathfinder:
            return pathfinder1Factory(doc_name);
        case GameSystem.Patfhinder2e:
            return pathfinder2Factory(doc_name);
        default:
            return undefined;
    }
}

/**
 * The system factory to retrieve a Starfinder schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function starfinderFactory(doc_name: string)  {
    return starfinder_list.find(schema => schema.title == doc_name);
}

/**
 * The system factory to retrieve a DND5e schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function dndFactory(doc_name: string) {
    return dnd_list.find(schema => schema.title == doc_name);
}

/**
 * The system factory to retrieve a Pathfinder schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder1Factory(doc_name:string) {
    return pathfinder1_list.find(schema => schema.title == doc_name);
}

/**
 * The system factory to retrieve a Pathfinder2e schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder2Factory(doc_name:string) {
    return pathfinder2_list.find(schema => schema.title == doc_name);
}

// TODO: Add other gaming system factories