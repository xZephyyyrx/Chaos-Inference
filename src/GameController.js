export default class GameController {

    #accumulator = 0;
    #fixedDelta = 1 / 60;

    // Currently Loaded Assets //
    #masterLevelList;
    #allLevelNames = [];

    #gridmap;
    #titleBg;
    #tilemap;

    #playerSprite;
    #game;
    #view;
    #dataloader;
    #shaderTime;
    #lastTime;
    #activeKeys = {};
    #currentOst = null;
    #titleOst;

    #currentLevelNum = 0;
    #lastLevelNum;
    #currentFgTileset;
    #currentBgTileset;
    #currentHazardSprites;
    #currentTokenSprites;
    #currentGoalSprites;
    #currentLevelOst;
    #lastLevelOst;

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

    async loadLevelData(
        fgTilesetFilename = 'scaffold',
        bgTilesetFilename = 'pipes',
        hazardSpritesFilename = 'defaultHazard',
        tokenSpritesFilename = 'defaultToken',
        goalSpritesFilename = 'defaultGoal',
        levelOstFilename = 'threat'
    ) {

        let levelData = await this.#dataloader.loadLevelData(
            fgTilesetFilename,
            bgTilesetFilename,
            hazardSpritesFilename,
            tokenSpritesFilename,
            goalSpritesFilename,
            levelOstFilename
        )

        this.#currentFgTileset = levelData.fgTileset;
        this.#currentBgTileset = levelData.bgTileset;
        this.#currentHazardSprites = levelData.hazardSprites;
        this.#currentTokenSprites = levelData.tokenSprites;
        this.#currentGoalSprites = levelData.goalSprites;
        this.#currentLevelOst = levelData.levelOst;
    }

    async loadLevelGridmap(levelName = 'defaultLevel') {
        let levelDetails = await this.#dataloader.getLevelDetails(levelName);
        return await this.#dataloader.loadLevelGridmap(levelDetails.gridmap);
    }

    async loadGameData() {

        const titleBgFilename = 'titlebg';
        const titleOstFilename = 'darkclouds';
        const playerSpriteFilename = 'basiccharbright';
        const tilemapFilename = 'defaultTilemap';

        let gameData;

        gameData = await this.#dataloader.loadGameData(
            titleBgFilename,
            titleOstFilename,
            playerSpriteFilename,
            tilemapFilename
        );

        this.#titleBg = gameData.titleBg;
        this.#titleOst = gameData.titleOst;
        this.#playerSprite = gameData.playerSprite;
        this.#tilemap = gameData.tilemap;
    }

    // Loads initial data and passes it to the Game
    async setup() {
        const fontName = '16px "PacMan1980"';
        
        await document.fonts.load(fontName);
        this.#view.renderLoadingScreen();
        await this.loadGameData();

        this.#masterLevelList = await this.#dataloader.importMasterLevelList();
        await this.importAllLevels();
        await this.loadLevelData();
        await this.loadLevel(this.#currentLevelNum);

        this.#lastLevelOst = this.#currentLevelOst;

        this.#game.initializeMenu();

        this.#game.populateLevelSelect(this.#allLevelNames);

        this.runGame(0);
    }

    async importAllLevels() {
        const levels = this.#masterLevelList.levels;
        let currentGridmap;
        let currentLevelFilename;

        for (let i = 0; i < levels.length; i++) {
            await this.importLevel(levels[i]);
        }
    }

    async importLevel(levelFilename) {
        const gridmap = await this.loadLevelGridmap(levelFilename);
        const levelDetails = await this.#dataloader.getLevelDetails(levelFilename);

        this.#allLevelNames.push(levelDetails.levelName);
        this.#game.importLevel(gridmap);
    }

    async loadLevel(levelNum = 0) {
        const level = this.#masterLevelList.levels[levelNum];
        const levelDetails = await this.#dataloader.getLevelDetails(level);
        const levelData = await this.loadLevelData(
            levelDetails.fgTileset,
            levelDetails.bgTileset,
            levelDetails.hazardSprites,
            levelDetails.tokenSprites,
            levelDetails.goalSprites,
            levelDetails.ost
        );

        this.#lastLevelNum = levelNum;

        this.#game.loadLevel(levelNum);
    }

    async changeLevel() {
        await this.loadLevel(this.#currentLevelNum);
    }

    // Main game loop
    async runGame(time = performance.now()) {

        let frameTime = (time - this.#lastTime) / 1000;

        frameTime = Math.min(frameTime, 0.25);

        this.#lastTime = time;

        this.#accumulator += frameTime;

        await this.checkHasWonLevel(this.#fixedDelta);

        await this.checkInLevel(frameTime);
        
        while (this.#accumulator >= this.#fixedDelta) {

            this.handleInput(this.#fixedDelta);

            this.#accumulator -= this.#fixedDelta;
        }

        this.handleMusic();

        await this.checkLevelChange();

        // LOOP //

        requestAnimationFrame((t) => this.runGame(t));
    }

    async checkLevelChange() {
        this.#currentLevelNum = this.#game.currentLevelNum;
        if (this.#lastLevelNum !== this.#currentLevelNum) {
            this.#lastLevelOst = this.#currentLevelOst;
            await this.changeLevel();
        }
    }

    async checkInLevel(deltaTime) {
        if (this.#game.state.inLevel) {
            this.callLevelRender();
        } else {
            this.#view.renderScreen(
                this.#game.getScreenDetails(), 
                this.#game.currentMenuSelection,
                deltaTime,
                this.#titleBg,
                this.#currentBgTileset,
                this.#game.getCurrentLevelTiles(),
                this.#currentFgTileset, 
                this.#tilemap,
                this.#currentHazardSprites,
                this.#currentTokenSprites,
                deltaTime
            );
        }
    }

    async checkHasWonLevel(deltaTime) {
        if (this.#game.state.levelComplete) {
            this.#view.renderScreen(
                this.#game.getScreenDetails(),
                this.#game.currentMenuSelection,
                deltaTime,
                this.#titleBg,
                this.#currentBgTileset,
                this.#game.getCurrentLevelTiles(),
                this.#currentFgTileset, 
                this.#tilemap,
                this.#currentHazardSprites,
                this.#currentTokenSprites
            );
        }
    }

    handleInput(deltaTime) {
        if (!this.#game.state.paused) {
            this.#game.update(deltaTime, this.#activeKeys);
        } else {
            this.#view.renderPauseScreen(
                this.#game.getScreenDetails(),
                this.#game.currentMenuSelection,
                deltaTime
            );
            this.#game.runPauseScreen(this.#activeKeys);
        }
    }

    callLevelRender() {
        // UPDATE VIEW //
        this.#view.renderAll(
            this.#game.getCurrentLevelTiles(),
            this.#currentFgTileset, 
            this.#tilemap,
            this.#currentHazardSprites,
            this.#currentTokenSprites,
            this.#currentGoalSprites,
            this.#playerSprite, 
            this.#game.getPlayerPosition(), 
            this.#game.getPlayerDimensions(),
            this.#game.getPlayerDirection(),
            this.#currentBgTileset,
            this.#shaderTime
        )
    }

    handleMusic() {
        if (this.#game.state.enableSound) {
            if (!this.#game.state.inLevel) {
                if (this.#currentOst !== this.#titleOst) {

                    if (this.#currentOst) {
                        this.#currentOst.pause();
                        this.#currentOst.currentTime = 0;
                    }
                    this.#currentOst = this.#titleOst;
                    this.#currentOst.play();
                }
            } else {
                if (this.#currentOst !== this.#currentLevelOst) {

                    if (this.#currentOst) {
                        this.#currentOst.pause();
                        this.#currentOst.currentTime = 0;
                    }
                    this.#currentOst = this.#currentLevelOst;
                    this.#currentOst.play();
                }
            }
        }
    }
}