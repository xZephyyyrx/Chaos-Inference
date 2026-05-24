import Level from "./Level.js";
import ObjectParser from "./ObjectParser.js";
import Vector from "./Vector.js";
import Move from "./Move.js";
import Menu from "./Menu.js";
import MenuScreens from "./MenuScreens.js";

export default class Game {

    static options = Object.freeze({
        START: 'Start Game',
        TUTORIAL: 'View Tutorial',
        STORY: 'View Story',
        NEXT: 'Next Page',
        PREVIOUS: 'Previous Page',
        RETURN: ['Return to', 'Title Screen'],
        PLAYSOUND: 'Yes',
        DISABLESOUND: 'No'
    });

    static screenNames = Object.freeze({
        MAIN: 'titleScreen',
        TUTORIAL: 'tutorial',
        STORY: 'story',
        SOUND: 'soundOptions',
        PAUSE: 'pauseScreen'
    });

    static screenTypes = Object.freeze({
        MAIN: 'main',
        TUTORIAL: 'tutorial',
        STORY: 'story',
        SOUND: 'sound',
        PAUSE: 'pause'
    });

    static initialMenuScreen = Game.screenNames.SOUND;

    #allLevels = [];
    #allMenuScreens = [];
    #currentMenuScreen;
    #currentMenuSelection;
    #currentLevel = null;
    #currentLevelNum;
    #state = {
        inLevel: false,
        enableSound: false,
        paused: false
    }
    #player;
    #arrowDownRelease = true;
    #arrowUpRelease = true;
    #arrowLeftRelease = true;
    #arrowRightRelease = true;
    #zRelease = true;
    #escRelease = true;

    // TITLE SCREENS //

    initializeMenu() {
        this.importScreens();
        this.setCurrentScreen();
        this.#currentMenuSelection = this.#currentMenuScreen.options[0];
    }

    importScreens() {
        Object.entries(MenuScreens.allScreens).forEach(([screen, values]) => {
            let newScreen = new Menu(
                screen,
                values.type,
                values.options,
                values.text
            );

            this.#allMenuScreens.push(newScreen);
        });
    }

    setCurrentScreen(screenName = Game.initialMenuScreen) {
        let newScreen = this.#allMenuScreens.find(screen => screen.name === screenName);
        if (newScreen) {
            this.#currentMenuScreen = newScreen;
            this.#currentMenuSelection = newScreen.options[0];
        }
    }

    getScreenDetails() {
        return {
            name: this.#currentMenuScreen.name,
            type: this.#currentMenuScreen.type,
            options: this.#currentMenuScreen.options,
            text: this.#currentMenuScreen.text
        }
    }

    runPauseScreen(keys) {

        const currentScreen = this.#currentMenuScreen;
        const selection = this.#currentMenuSelection;
        const confirm = 'Yes';
        const cancel = 'No';

        if (keys['Escape'] && this.#escRelease) {
            this.#state.paused = false;
            this.#escRelease = false;
            this.setCurrentScreen(Game.screenNames.MAIN);
        }

        if (keys['ArrowLeft'] && 
            this.#arrowLeftRelease) {
            let index = currentScreen.options.indexOf(selection);
            if (index === 0) {
                this.#currentMenuSelection = currentScreen.options[1];
            }  else {
                this.#currentMenuSelection = currentScreen.options[0];
            }
            this.#arrowLeftRelease = false;
        }

        if (keys['ArrowRight'] && 
            this.#arrowRightRelease) {
            let index = currentScreen.options.indexOf(selection);
            if (index === 0) {
                this.#currentMenuSelection = currentScreen.options[1];
            }  else {
                this.#currentMenuSelection = currentScreen.options[0];
            }
            this.#arrowRightRelease = false;
        }

        if (keys['z'] && this.#zRelease) {
            this.#state.paused = false;
            this.setCurrentScreen(Game.screenNames.MAIN);

            if (selection === confirm) {
                this.#state.inLevel = false;
            }

            this.#zRelease = false;
            Move.zKeyRelease = false;
        }

        if (!keys['z']) {
            this.#zRelease = true;
        }

        if (!keys['ArrowRight']) {
            this.#arrowRightRelease = true;
        }

        if (!keys['ArrowLeft']) {
            this.#arrowLeftRelease = true;
        }

        if (!keys['Escape']) {
            this.#escRelease = true;
        }
    }

    // LOAD GRIDMAP //

    importLevel(gridmap) {
        this.#allLevels.push(gridmap);
    }

    // LEVEL HANDLING //

    loadLevel(levelNum) {
        const gridmap = this.#allLevels[levelNum];

        if (gridmap) {
            const newLevel = new Level(gridmap);
            //this.#state.inLevel = true;
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
        if (this.#state.inLevel) {
            this.handleMovement(deltaTime, keys);
        } else {
            this.handleMenuSelections(keys);
        }
    }

    handleMovement(deltaTime, keys) {
        let newMove = new Move(
            this.#currentLevel, 
            this.#player,
            keys,
            deltaTime
        )

        if (!keys['Escape']) {
            this.#escRelease = true;
        }

        if (keys['Escape'] && this.#escRelease) {
            this.#state.paused = true;
            this.#escRelease = false;
            this.setCurrentScreen(Game.screenNames.PAUSE);
        }

        let updatedValues = newMove.update();

        this.#player.pos = updatedValues.pos;
        this.#player.vel = updatedValues.vel;
        this.#player.collisions = updatedValues.collisions;
        this.#player.aliveState = updatedValues.aliveState;

        if (this.#player.aliveState === false) {

            this.#currentLevel = null;
            this.#player = null;

            this.loadLevel(this.#currentLevelNum);
        }
    }

    handleMenuSelections(keys) {
        const currentScreen = this.#currentMenuScreen;
        const selection = this.#currentMenuSelection;
        if (keys['ArrowDown'] && 
            this.#arrowDownRelease && 
            currentScreen.type !== Game.screenTypes.SOUND
        ) {
            let index = currentScreen.options.indexOf(selection);
            if (currentScreen.options.length <= index + 1) {
                index = 0;
            } else {
                index += 1;
            }
            this.#currentMenuSelection = currentScreen.options[index];
            this.#arrowDownRelease = false;
        }

        if (keys['ArrowUp'] && 
            this.#arrowUpRelease &&
            currentScreen.type !== Game.screenTypes.SOUND
        ) {
            let index = currentScreen.options.indexOf(selection);
            if (index <= 0) {
                index = currentScreen.options.length - 1;
            } else {
                index -= 1;
            }
            this.#currentMenuSelection = currentScreen.options[index];
            this.#arrowUpRelease = false;
        }

        if (keys['z'] && this.#zRelease) {
            if (currentScreen.type !== Game.screenTypes.SOUND) {
                this.handleScreenChange();
            } else {
                if (selection === Game.options.PLAYSOUND) {
                    this.handleScreenChange();
                    this.#state.enableSound = true;
                } else {
                    this.handleScreenChange();
                }
            }
            
            this.#zRelease = false;
        }

        if (keys['ArrowLeft'] && 
            this.#arrowLeftRelease &&
            currentScreen.type === Game.screenTypes.SOUND) {
            let index = currentScreen.options.indexOf(selection);
            if (index === 0) {
                this.#currentMenuSelection = currentScreen.options[1];
            }  else {
                this.#currentMenuSelection = currentScreen.options[0];
            }
            this.#arrowLeftRelease = false;
        }

        if (keys['ArrowRight'] && 
            this.#arrowRightRelease &&
            currentScreen.type === Game.screenTypes.SOUND) {
            let index = currentScreen.options.indexOf(selection);
            if (index === 0) {
                this.#currentMenuSelection = currentScreen.options[1];
            }  else {
                this.#currentMenuSelection = currentScreen.options[0];
            }
            this.#arrowRightRelease = false;
        }

        if (!keys['ArrowDown']) {
            this.#arrowDownRelease = true;
        }

        if (!keys['ArrowLeft']) {
            this.#arrowLeftRelease = true;
        }

        if (!keys['ArrowUp']) {
            this.#arrowUpRelease = true;
        }

        if (!keys['ArrowRight']) {
            this.#arrowRightRelease = true;
        }

        if (!keys['z']) {
            this.#zRelease = true;
        }
    }

    handleScreenChange() {
        const selection = this.#currentMenuSelection;
        const screen = this.#currentMenuScreen;

        if (selection === Game.options.TUTORIAL) {
            this.setCurrentScreen(`${Game.screenNames.TUTORIAL}1`);
        } else if (selection === Game.options.STORY) {
            this.setCurrentScreen(`${Game.screenNames.STORY}1`);
        } else if (selection === Game.options.NEXT) {
            const pageNum = screen.name.slice(-1);
            this.setCurrentScreen(`` +
                `${screen.name.slice(0, -1)}` +
                `${parseInt(pageNum, 10) + 1}`
            )
        } else if (selection === Game.options.PREVIOUS) {
            const pageNum = screen.name.slice(-1);
            this.setCurrentScreen(`` +
                `${screen.name.slice(0, -1)}` +
                `${parseInt(pageNum, 10) - 1}`
            );
        } else if (Array.isArray(selection)) {
            this.setCurrentScreen(`${Game.screenNames.MAIN}`);
        } else if (selection === Game.options.START) {
            this.#currentMenuSelection = this.#currentMenuScreen.options[0];
            this.#state.inLevel = true;
        } else if (selection === Game.options.PLAYSOUND ||
                   selection === Game.options.DISABLESOUND
        ) {
            this.setCurrentScreen(`${Game.screenNames.MAIN}`);
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

    getPlayerDirection() {
        return this.#player.direction;
    }

    getCurrentLevelTiles() {
        return this.#currentLevel.levelTiles;
    }

    get player() {
        return this.#player;
    }

    get state() {
        return this.#state;
    }

    get currentMenuSelection() {
        return this.#currentMenuSelection;
    }
}