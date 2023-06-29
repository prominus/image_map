// DnD5e imports
// ..

// Pathfinder1e imports
// ..

// Pathfinder2e imports
// ..

// Starfinder imports
import { features } from "process";
import alien_archive_1 from "../system_mapping/sfrpg/alien_archive_1.json";
import alien_archive_2 from "../system_mapping/sfrpg/alien_archive_2.json";
import alien_archive_3 from "../system_mapping/sfrpg/alien_archive_3.json";

export enum GameSystem {
    DnD5e,
    Pathfinder,
    Patfhinder2e,
    Starfinder,
}

// Interfaces for JSON files

/**
 * Iterface for dictionary
 * @property [key]: value
 */
interface iDictionary {
    [key:string]: iImage;
}

/**
 * Interface for PDF document
 * @property title - PDF title
 * @property author - PDF Author
 * @property creation_date - date file was created
 * @property npc2 - monsters/non playable characters
 */
interface iDocument {
    title: string;
    author: string;
    creation_date: string;
    // TODO: add scene images, character images, maybe object images?
}

/**
 * Iterface for image
 * @property id
 * @property orig
 * @property icon
 * @property additional - Other cool additional images
 */
interface iImage {
    id: string;
    orig: string;
    icon?: string;
    additional?: string[]
}

/**
 * Interface for a Starfinder PDF
 */
interface iStarfinderDoc extends iDocument {
    alien_archives? : iDictionary;
    archetype_features? : iDictionary;
    archetypes?: iDictionary;
    characters?: iDictionary;
    classes?: iDictionary;
    class_features?: iDictionary;
    conditions?: iDictionary;
    creature_companions?: iDictionary;
    equipment?: iDictionary;
    feats?: iDictionary;
    hazards?: iDictionary;
    races?: iDictionary;
    racial_features?: iDictionary;
    rules?: iDictionary;
    setting?: iDictionary;
    spells?: iDictionary;
    starship_actions?: iDictionary;
    starship_components?: iDictionary;
    starships?: iDictionary;
    tables?: iDictionary;
    themes?: iDictionary;
    universal_creature_rules?: iDictionary;
    vehicles?: iDictionary;
}

// Test the Document json
let testJson: iDocument = {
    title: 'test',
    author: 'test',
    creation_date: 'test',
    // npc2: {
    //     't1': {
    //         id: '1',
    //         orig: 'test',
    //         icon: 'icon'
    //     }
    // }
}

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
    return starfinder_list.find(schema => schema.title === doc_name);
}

/**
 * The system factory to retrieve a DND5e schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function dndFactory(doc_name: string) {
    return dnd_list.find(schema => schema.title === doc_name);
}

/**
 * The system factory to retrieve a Pathfinder schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder1Factory(doc_name:string) {
    return pathfinder1_list.find(schema => schema.title === doc_name);
}

/**
 * The system factory to retrieve a Pathfinder2e schema
 * @param doc_name The name of the PDF document
 * @returns The JSON file schema if found
 */
function pathfinder2Factory(doc_name:string) {
    return pathfinder2_list.find(schema => schema.title === doc_name);
}

// TODO: Add other gaming system factories