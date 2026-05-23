export default class GameController {
    // Currently Loaded Assets //
    #gridmap;
    #titleBg;
    #bgTileset;
    #fgTileset;
    #fgTilesetMap;
    #hazardSprites;
    #tokenSprites;
    #playerSprite;
    #game;
    #view;
    #dataloader;
    #shaderTime;
    #lastTime;
    #activeKeys = {};
    #ostTitle;
    #currentlyPlayingMusic = false;

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
            this.#titleBg = await this.#dataloader.importTileset('titlebg');
        } catch (error) {
            console.log(error);
        }

        try {
            this.#fgTileset = await this.#dataloader.importTileset('appearancetestscaffold');
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

        try {
            this.#hazardSprites = await this.#dataloader.importObjectSprites('hazardbright');
        } catch (error) {
            console.log(error);
        }

        try {
            this.#tokenSprites = await this.#dataloader.importObjectSprites('tokenbright');
        } catch (error) {
            console.log(error);
        }

        try {
            this.#ostTitle = await this.#dataloader.importMusic('darkclouds8bitwave');
        } catch (error) {
            console.log(error);
        }
        
        this.#fgTilesetMap = await this.#dataloader.importTilesetMap('level1fgtilemap');
    }

    // Loads initial data and passes it to the Game
    async setup() {
        await this.loadTestData();

        this.#game.initializeMenu();

        this.initializeLevel();
    }

    initializeLevel() {
        this.#game.importLevel(this.#gridmap);
        try {
            this.#game.loadLevel(0);
        } catch (e) {
            throw (e);
        }

        this.runGame(0);
    }

    // Main game loop
    runGame(time = performance.now()) {
        const deltaTime = (time - this.#lastTime) / 1000;
        this.#lastTime = time;

        if (this.#game.state.inLevel) {
            this.runLevel();
        } else {
            this.#view.renderScreen(
                this.#game.getScreenDetails(), 
                this.#game.currentMenuSelection,
                deltaTime,
                this.#titleBg
            );
        }

        // Read player inputs

        this.#game.update(deltaTime, this.#activeKeys);

        if (this.#game.state.enableSound && !this.#currentlyPlayingMusic) {
            this.#ostTitle.play();
            this.#currentlyPlayingMusic = true;
        }

        // LOOP //

        requestAnimationFrame((t) => this.runGame(t));
    }

    runLevel() {
        // UPDATE VIEW //
        this.#view.clearFg();
        this.#view.renderAll(
            this.#game.getCurrentLevelTiles(),
            this.#fgTileset, 
            this.#fgTilesetMap,
            this.#hazardSprites,
            this.#tokenSprites,
            this.#playerSprite, 
            this.#game.getPlayerPosition(), 
            this.#game.getPlayerDimensions(),
            this.#game.getPlayerDirection(),
            this.#bgTileset,
            this.#shaderTime
        )
    }
}