import Vector from "./Vector.js";
import ObjectParser from "./ObjectParser.js";

export default class Level {
    #levelTiles = [];
    #player;
    
    constructor(gridmap) {
        this.createLevelGeometry(gridmap);
        this.createHazards(gridmap);
    }

    // LEVEL INITIALIZATION //

    createLevelGeometry(gridmap) {
        for (let y = 0; y < gridmap.length; y++) {
            this.#levelTiles[y] = [];

            for (let x = 0; x < gridmap[y].length; x++) {
                let tile = ObjectParser.parseTile(new Vector(x, y), gridmap[y][x]);
                this.#levelTiles[y][x] = tile;
            }
        }
    }

    createHazards(gridmap) {
        for (let y = 0; y < this.#levelTiles.length; y++) {
            for (let x = 0; x < this.#levelTiles[y].length; x++) {
                if (ObjectParser.isLetter(gridmap[y][x]) &&
                    ObjectParser.isLetterLowercase(gridmap[y][x])) {

                    let hazard = ObjectParser.parseHazard(new Vector(x, y), gridmap[y][x]);
                    this.#levelTiles[y][x] = hazard;
                    
                }
                
            }
        }
    }

    // CHECKING LEVEL OBJECTS //

    // As each tile occupies a 1x1 space, this checks if a tile is present
    // at the floor of the given coordinates as a tile at this location
    // will necessarily occupy the checked space
    isClearAt(x, y) {
        let result = false;

        if (!this.#levelTiles[Math.floor(y)][Math.floor(x)] ||
            this.#levelTiles[Math.floor(y)][Math.floor(x)].type !== 'Tile') {
            result = true;
        }

        return result;
    }

    isHazardAt(x, y) {
        let result = false;

        if (this.#levelTiles[Math.floor(y)][Math.floor(x)] &&
            this.#levelTiles[Math.floor(y)][Math.floor(x)].type === 'Hazard') {
            result = true;
        }

        return result;
    }

    get levelTiles() {
        return this.#levelTiles;
    }
}