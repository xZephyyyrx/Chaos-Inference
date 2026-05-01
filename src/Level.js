import Vector from "./Vector.js";
import ObjectParser from "./ObjectParser.js";

export default class Level {
    #levelTiles = [];
    #player;
    
    constructor(gridmap) {
        this.createLevelGeometry(gridmap);
        this.createPlayer(gridmap);
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

    createPlayer(gridmap) {
        let player = ObjectParser.parsePlayerLocation(gridmap);
        if (player !== undefined) {
            this.#player = player;
        }
    }

    // PLAYER FUNCTIONALITY //

    getPlayerPosition() {
        return this.#player.pos;
    }

    getPlayerDimensions() {
        return {
            width: this.#player.width,
            height: this.#player.height
        }
    }

    get levelTiles() {
        return this.#levelTiles;
    }
}