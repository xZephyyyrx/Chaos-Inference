import Level from "./Level.js";
import ObjectParser from "./ObjectParser.js";
import Vector from "./Vector.js";
import Move from "./Move.js";

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

        let newMove = new Move(
            this.#currentLevel, 
            this.#player,
            keys,
            deltaTime
        )

        let updatedValues = newMove.update();

        this.#player.pos = updatedValues.pos;
        this.#player.vel = updatedValues.vel;
        this.#player.collisions = updatedValues.collisions;
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