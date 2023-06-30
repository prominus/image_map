import { GameSystem, iDocument, iStarfinderDoc } from "../mapping/json_map";

// DnD5e imports
// ..

// Pathfinder1e imports
// ..

// Pathfinder2e imports
// ..

// Starfinder imports
import alien_archive_1 from "../schemas/sfrpg/alien_archive_1.json";
import alien_archive_2 from "../schemas/sfrpg/alien_archive_2.json";
import alien_archive_3 from "../schemas/sfrpg/alien_archive_3.json";


const dnd_list: iDocument[] = [
    // TODO
]

const pathfinder1_list: iDocument[] = [
    // TODO
]

const pathfinder2_list: iDocument[] = [
    // TODO
]

const starfinder_list: iStarfinderDoc[] = [
    alien_archive_1,
    alien_archive_2,
    alien_archive_3,
];

/**
 * 
 * @param system - Specify the gaming system of choice
 * @param docName - Specify the name of the file
 * @returns The JSON schema for the PDF if found
 */
export function jsonExtractor(system: GameSystem, docName: string) {
    switch (system) {
        // Right now Starfinder is the only system so putting this at the top
        case GameSystem.Starfinder:
            return starfinderFactory(docName);
        case GameSystem.DnD5e:
            return dndFactory(docName);
        case GameSystem.Pathfinder:
            return pathfinder1Factory(docName);
        case GameSystem.Patfhinder2e:
            return pathfinder2Factory(docName);
        default:
            return undefined;
    }
}

/**
 * The system factory to retrieve a Starfinder schema
 * @param docName The name of the PDF document
 * @returns The JSON file schema if found
 */
function starfinderFactory(docName: string)  {
    return starfinder_list.find(schema => schema.title === docName);
}

/**
 * The system factory to retrieve a DND5e schema
 * @param docName The name of the PDF document
 * @returns The JSON file schema if found
 */
function dndFactory(docName: string) {
    return dnd_list.find(schema => schema.title === docName);
}

/**
 * The system factory to retrieve a Pathfinder schema
 * @param docName The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder1Factory(docName:string) {
    return pathfinder1_list.find(schema => schema.title === docName);
}

/**
 * The system factory to retrieve a Pathfinder2e schema
 * @param docName The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder2Factory(docName:string) {
    return pathfinder2_list.find(schema => schema.title === docName);
}

// TODO: Add other gaming system factories