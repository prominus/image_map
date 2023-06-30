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
export interface iDictionary {
    [key:string]: iImage;
}

export function isiDictionary(object:any): object is iDictionary {
    return 'key' in object;
}

/**
 * Interface for PDF document
 * @property title - PDF title
 * @property author - PDF Author
 * @property creation_date - date file was created
 * @property npc2 - monsters/non playable characters
 */
export interface iDocument {
    name: string,
    title: string;
    author: string;
    creation_date: string;
    assets: iAssets;
    // TODO: add scene images, character images, maybe object images?
}

/**
 * Iterface for image
 * @property id
 * @property orig
 * @property icon
 * @property additional - Other cool additional images
 */
export interface iImage {
    id: string;
    orig: string;
    icon?: string;
    additional?: string[]
}

export interface iAssets { }

/**
 * Interface for a Starfinder PDF
 */
export interface iStarfinderAssets extends iAssets {
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

export interface iStarfinderDoc extends iDocument {
    assets: iStarfinderAssets;
}

// Test the Document json
let testJson: iDocument = {
    name: 'test',
    title: 'test',
    author: 'test',
    creation_date: 'test',
    assets:[
    ]
}