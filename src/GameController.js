export default class GameController {
    // Currently Loaded Assets //
    #gridmap;
    #bgTileset;
    #fgTileset;
    #fgTilesetMap;
    #playerSprite;
    #game;
    #view;
    #dataloader;
    #shaderTime;
    #lastTime;
    #activeKeys = {};

    constructor(game, view, dataloader) {
        // Game Logic //
        this.#game = game;

        // View //
        this.#view = view;

        // Data Loader //
        this.#dataloader = dataloader;

        // Used to increment time for various game elements
        this.#shaderTime = performance.now();
        
        // Used to decouple game logic from browser framerate
        this.#lastTime = performance.now();

        // KEYBINDS //

        window.addEventListener("keydown", (e) => {
            this.#activeKeys[e.key] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.#activeKeys[e.key] = false;
        });
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

        try {
            this.#playerSprite = await this.#dataloader.importPlayerSprites('basicchar');
        } catch (error) {
            console.log(error);
        }
        
        this.#fgTilesetMap = await this.#dataloader.importTilesetMap('level1fgtilemap');
    }

    // Loads initial data and passes it to the Game
    async setup() {
        await this.loadTestData();

        this.#game.loadLevel(this.#gridmap);
        this.#view.renderFgTiles(
            this.#game.getCurrentLevelTiles(),
            this.#fgTileset, 
            this.#fgTilesetMap
        );

        this.runGame(0);
    }

    // Main game loop
    runGame(time = performance.now()) {
        const deltaTime = (time - this.#lastTime) / 1000;
        this.#lastTime = time;

        // UPDATE VIEW //

        this.#view.clearFg();
        this.#view.renderPlayer(
            this.#playerSprite, 
            this.#game.getPlayerPosition(), 
            this.#game.getPlayerDimensions()
        );
        this.#view.renderFgTiles(
            this.#game.getCurrentLevelTiles(),
            this.#fgTileset, 
            this.#fgTilesetMap
        );
        this.#view.renderBgTiles(this.#bgTileset);

        this.#view.updateShader((performance.now() - this.#shaderTime) * 0.001);

        // Read player inputs

        this.#game.update(deltaTime, this.#activeKeys);

        // LOOP //

        requestAnimationFrame((t) => this.runGame(t));
    }
}