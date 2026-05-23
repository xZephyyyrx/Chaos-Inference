import Vector from "./Vector.js";
import ObjectParser from "./ObjectParser.js";

export default class Level {
    #levelTiles = [];
    #player;
    
    constructor(gridmap) {
        this.createLevelGeometry(gridmap);
        this.createObjects(gridmap);
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

    createObjects(gridmap) {
        for (let y = 0; y < this.#levelTiles.length; y++) {
            for (let x = 0; x < this.#levelTiles[y].length; x++) {
                if (ObjectParser.isLetter(gridmap[y][x])) {

                    if (ObjectParser.isLetterLowercase(gridmap[y][x])) {
                        let hazard = ObjectParser.parseHazard(new Vector(x, y), gridmap[y][x]);
                        this.#levelTiles[y][x] = hazard;
                    } else {
                        let token = ObjectParser.parseToken(new Vector(x, y), gridmap[y][x]);
                        this.#levelTiles[y][x] = token;
                    }
                }
            }
        }
    }

    collectToken(key) {
        for (let y = 0; y < this.#levelTiles.length; y++) {
            for (let x = 0; x < this.#levelTiles[y].length; x++) {
                if (this.#levelTiles[y][x] === null) {continue;}

                if (this.#levelTiles[y][x].key === key) {
                    this.#levelTiles[y][x].activeState = false;
                }
            }
        }
    }

    // CHECKING LEVEL OBJECTS //

    getTileAt(x, y) {

        if (y > this.#levelTiles.length || y < 0) {
            throw new Error('Player is out of y-axis bounds!');
        }

        const tileY = Math.floor(y);

        if (x > this.#levelTiles[tileY].length || x < 0) {
            throw new Error('Player is out of x-axis bounds!');
        }

        const tileX = Math.floor(x);

        return this.#levelTiles[tileY][tileX];
    }

    // As each tile occupies a 1x1 space, this checks if a tile is present
    // at the floor of the given coordinates as a tile at this location
    // will necessarily occupy the checked space
    isClearAt(x, y) {
        let tile;
        let result = false;

        try {
            tile = this.getTileAt(x, y);
        } catch (e) {
            throw (e);
        }
        

        if (!tile ||
            tile.type !== 'Tile') {
            result = true;
        }

        return result;
    }

    isHazardAt(x, y) {
        let tile;
        let result = false;

        try {
            tile = this.getTileAt(x, y);
        } catch (e) {
            throw (e);
        }

        if (tile && tile.type === 'Hazard' && tile.activeState === true) {
            result = true;
        }

        return result;
    }

    isTokenAt(x, y) {
        let tile;
        let result = false;
        let key = null;

        try {
            tile = this.getTileAt(x, y);
        } catch (e) {
            throw (e);
        }

        if (tile && tile.type === 'Token' && tile.activeState === true) {
            this.collectToken(tile.key);
        }

        return result;
    }

    get levelTiles() {
        return this.#levelTiles;
    }
}