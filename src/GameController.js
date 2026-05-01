export default class GameController {
    // Currently Loaded Assets //
    #gridmap;
    #bgTileset;
    #fgTileset;
    #fgTilesetMap;
    #game;
    #view;
    #dataloader;
    #startTime;

    constructor(game, view, dataloader) {
        // Game Logic //
        this.#game = game;

        // View //
        this.#view = view;

        // Data Loader //
        this.#dataloader = dataloader;

        // Used to increment time for various game elements
        this.#startTime = performance.now();
    }

    // TEST DATA FOR LOADING & RENDERING MAPS //
    async loadTestData() {
        this.#gridmap = await this.#dataloader.importGridmap('level1grid');
        this.#gridmap = this.#dataloader.parseMapData(this.#gridmap);

        try {
            this.#fgTileset = await this.#dataloader.importTileset('appearancetest');
        } catch (error) {
            console.log(error);
        }

        try {
            this.#bgTileset = await this.#dataloader.importTileset('bgappearancetest');
        } catch (error) {
            console.log(error);
        }
        
        this.#fgTilesetMap = await this.#dataloader.importTilesetMap('level1fgtilemap');
    }

    // Loads initial data and passes it to the Game
    async setup() {
        await this.loadTestData();

        this.runGame(this.#gridmap);
    }

    // Main game loop
    runGame(gridmap) {

        // CHECK GAME STATE //
        const gameLevel = this.#game.state.level;
        if (gridmap) {
            this.#game.loadLevel(gridmap);
            this.#view.renderFgTiles(
                this.#game.getCurrentLevelTiles(),
                this.#fgTileset, 
                this.#fgTilesetMap
            );
        }
        

        // UPDATE VIEW //
        this.#view.renderAll(this.#startTime, this.#bgTileset);
        requestAnimationFrame(() => this.runGame());
    }
}