import Level from "./Level.js";

export default class Game {
    #allLevels = [];
    #currentLevel;
    #state = {
        level: null,
    }

    loadLevel(gridmap) {
        const newLevel = new Level(gridmap);
        this.#allLevels.push(newLevel);
        this.#state.level = true;
        this.#currentLevel = newLevel;
    };

    getCurrentLevelTiles() {
        return this.#currentLevel.levelTiles;
    }

    get state() {
        return this.#state;
    }
}