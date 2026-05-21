import Level from "./Level.js";
import ObjectParser from "./ObjectParser.js";
import Vector from "./Vector.js";
import Move from "./Move.js";

export default class Game {
    #allLevels = [];
    #currentLevel;
    #currentLevelNum;
    #state = {
        level: null
    }
    #player;

    // LOAD GRIDMAP //

    importLevel(gridmap) {
        this.#allLevels.push(gridmap);
    }

    // LEVEL HANDLING //

    loadLevel(levelNum) {
        const gridmap = this.#allLevels[levelNum];

        if (gridmap) {
            const newLevel = new Level(gridmap);
            this.#state.level = true;
            this.#state.playerAlive = true;
            this.#currentLevel = newLevel;
            this.createPlayer(gridmap);
            this.#currentLevelNum = levelNum;
        } else {
            throw new Error(`Level number ${levelNum} does not exist!`);
        }
    };

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
        this.#player.aliveState = updatedValues.aliveState;

        if (this.#player.aliveState === false) {

            this.#currentLevel = null;
            this.#player = null;

            this.#state = {
                level: false
            }

            this.loadLevel(this.#currentLevelNum);
        }
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

    getCurrentLevelTiles() {
        return this.#currentLevel.levelTiles;
    }

    get state() {
        return this.#state;
    }
}