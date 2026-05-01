import Level from "./Level.js";
import ObjectParser from "./ObjectParser.js";
import Vector from "./Vector.js";

export default class Game {
    #allLevels = [];
    #currentLevel;
    #state = {
        level: null,
    }
    #player;

    // PLAYER HANDLING //
    
    createPlayer(gridmap) {
        let player = ObjectParser.parsePlayerLocation(gridmap);
        if (player !== undefined) {
            this.#player = player;
        }
    }

    // PLAYER FUNCTIONALITY //

    // Controlling Player

    update(deltaTime, keys) {

        // TO BE UPDATED USING THE MOVE CLASS
        const speed = 7;

        let x = this.#player.pos.x;
        let y = this.#player.pos.y;

        if (keys['ArrowLeft']) {
            x -= speed * deltaTime;
        }

        if (keys['ArrowRight']) {
            x += speed * deltaTime;
        }

        if (keys['ArrowDown']) {
            y += speed * deltaTime;
        }

        if (keys['ArrowUp']) {
            y -= speed * deltaTime;
        }

        this.#player.pos = new Vector(x, y);
    }

    // Retriving Player data

    getPlayerPosition() {
        return this.#player.pos;
    }

    getPlayerDimensions() {
        return {
            width: this.#player.width,
            height: this.#player.height
        }
    }

    get player() {
        return this.#player;
    }

    // LEVEL HANDLING //

    loadLevel(gridmap) {
        const newLevel = new Level(gridmap);
        this.#allLevels.push(newLevel);
        this.#state.level = true;
        this.#currentLevel = newLevel;
        this.createPlayer(gridmap);
    };

    getCurrentLevelTiles() {
        return this.#currentLevel.levelTiles;
    }

    get state() {
        return this.#state;
    }
}