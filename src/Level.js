import Vector from "./Vector.js";
import ObjectParser from "./ObjectParser.js";

export default class Level {
    #levelTiles = [];
    #player;
    
    constructor(gridmap) {
        this.createLevelGeometry(gridmap);
    }

    // LEVEL INITIALIZATION //

    createLevelGeometry(gridmap) {
        for (let y = 0; y < gridmap.length; y++) {
            this.#levelTiles[y] = [];

            for (let x = 0; x < gridmap[y].length; x++) {
                let tile = ObjectParser.parseObject(new Vector(x, y), gridmap[y][x]);
                this.#levelTiles[y][x] = tile;
            }
        }
    }

    get levelTiles() {
        return this.#levelTiles;
    }
}