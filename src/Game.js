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
        LEVEL: 'Level Select',
        NEXT: 'Next Page',
        PREVIOUS: 'Previous Page',
        RETURN: ['Return to', 'Title Screen'],
        WINSCREENRETURN: 'Return to Title Screen',
        WINSCREENCONTINUE: 'Continue to next Level',
        PLAYSOUND: 'Yes',
        DISABLESOUND: 'No',
        OPTIONS: 'Options',
        ENABLESOUNDOPTION: 'Enable Sound',
        DISABLESOUNDOPTION: 'Disable Sound',
        CONFIRMVOLUMEOPTION: 'Confirm',
        CANCELVOLUMEOPTION: 'Cancel',
        ADJUSTVOLUME: 'Adjust Volume',
        SLIDER: 'Slider Object'
    });

    static screenNames = Object.freeze({
        MAIN: 'titleScreen',
        TUTORIAL: 'tutorial',
        STORY: 'story',
        SOUND: 'soundOptions',
        PAUSE: 'pauseScreen',
        LEVEL: 'levelSelect',
        WIN: 'winScreen',
        OPTIONS: 'optionsScreen'
    });

    static screenTypes = Object.freeze({
        MAIN: 'main',
        TUTORIAL: 'tutorial',
        STORY: 'story',
        SOUND: 'sound',
        PAUSE: 'pause',
        LEVEL: 'level',
        WIN: 'win',
        OPTIONS: 'options'
    });

    static initialMenuScreen = Game.screenNames.SOUND;

    static volumeAdjustSpeed = 0.007;

    static defaultVolume = 0.5;

    #allLevels = [];
    #allMenuScreens = [];
    #currentMenuScreen;
    #currentMenuSelection;
    #currentLevel = null;
    #currentLevelNum;
    #state = {
        inLevel: false,
        enableSound: false,
        gameVolume: Game.defaultVolume,
        controlVolumeSlider: false,
        paused: false,
        levelComplete: false
    };
    #previousGameVolume = Game.defaultVolume;
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

    updateOptionsScreen() {
        const screen = this.#currentMenuScreen;
        screen.options[0] = (this.#state.enableSound) ? 
            Game.options.DISABLESOUNDOPTION : Game.options.ENABLESOUNDOPTION;
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

        if ((keys['z'] || keys['Z']) && this.#zRelease) {
            this.#state.paused = false;
            this.setCurrentScreen(Game.screenNames.MAIN);

            if (selection === confirm) {
                this.#state.inLevel = false;
            }

            keys['z'] = false;
            keys['Z'] = false;

            this.#zRelease = false;
            Move.zKeyRelease = false;
        }

        if (!keys['z'] && !keys['Z']) {
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

    populateLevelSelect(levelNames) {
        const levelSelect = this.#allMenuScreens.find(screen => screen.type === Game.screenTypes.LEVEL);
        const returnOption = [
            'Return to',
            'Title Screen'
        ]
        levelSelect.options = levelNames;
        levelSelect.options.push(returnOption);
    }

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
        this.#state.levelComplete = updatedValues.winState;

        if (this.#player.aliveState === false) {

            this.#currentLevel = null;
            this.#player = null;

            this.loadLevel(this.#currentLevelNum);
        } else if (this.#state.levelComplete) {
            this.#state.inLevel = false;
            this.setCurrentScreen(Game.screenNames.WIN);
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

            if (currentScreen.type === Game.screenTypes.OPTIONS) {
                if (!this.#state.controlVolumeSlider ) {
                    while(currentScreen.options[index] === Game.options.CONFIRMVOLUMEOPTION ||
                        currentScreen.options[index] === Game.options.CANCELVOLUMEOPTION ||
                        currentScreen.options[index] === Game.options.SLIDER
                    ) {
                        index += 1;
                    }
                } else if (selection !== Game.options.SLIDER) {
                    index = currentScreen.options.indexOf(Game.options.SLIDER);
                }
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

            if (currentScreen.type === Game.screenTypes.OPTIONS) {
                
                if (!this.state.controlVolumeSlider) {
                    while(currentScreen.options[index] === Game.options.CONFIRMVOLUMEOPTION ||
                        currentScreen.options[index] === Game.options.CANCELVOLUMEOPTION ||
                        currentScreen.options[index] === Game.options.SLIDER
                    ) {
                        index -= 1;
                    }
                } else if (selection === Game.options.SLIDER) {
                    index = (currentScreen.options.indexOf(Game.options.SLIDER)) + 1;
                } else if (selection === Game.options.CANCELVOLUMEOPTION) {
                    index = currentScreen.options.indexOf(Game.options.SLIDER);
                }
            }

            this.#currentMenuSelection = currentScreen.options[index];
            this.#arrowUpRelease = false;
        }

        if ((keys['z'] || keys['Z']) && this.#zRelease) {
            if (currentScreen.type !== Game.screenTypes.SOUND) {
                if (selection === Game.options.ENABLESOUNDOPTION) {
                    this.#state.enableSound = true;
                    this.updateOptionsScreen();
                    this.#currentMenuSelection = this.#currentMenuScreen.options[0];
                } else if (selection === Game.options.DISABLESOUNDOPTION) {
                    this.#state.enableSound = false;
                    this.updateOptionsScreen();
                    this.#currentMenuSelection = this.#currentMenuScreen.options[0];
                } else if (selection === Game.options.ADJUSTVOLUME ||
                           selection === Game.options.CANCELVOLUMEOPTION
                ) {
                    if (this.#state.controlVolumeSlider) {
                        if (selection === Game.options.CANCELVOLUMEOPTION) {
                            this.#state.gameVolume = this.#previousGameVolume;
                        }
                        this.#state.controlVolumeSlider = false;
                        this.#currentMenuSelection = currentScreen.options[0];
                    } else {
                        this.#previousGameVolume = this.#state.gameVolume;
                        this.#state.controlVolumeSlider = true;
                        const sliderIndex = currentScreen.options.indexOf(Game.options.SLIDER);
                        this.#currentMenuSelection = currentScreen.options[sliderIndex];
                    }
                } else if (selection === Game.options.CONFIRMVOLUMEOPTION &&
                           currentScreen.type === Game.screenTypes.OPTIONS
                ) {
                    this.#state.controlVolumeSlider = false;
                    this.#currentMenuSelection = currentScreen.options[0];
                } else {
                    this.handleScreenChange();
                }
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
            this.#arrowLeftRelease) {

            let index = currentScreen.options.indexOf(selection);;

            if (currentScreen.type === Game.screenTypes.SOUND) {
                if (index === 0) {
                    this.#currentMenuSelection = currentScreen.options[1];
                }  else {
                    this.#currentMenuSelection = currentScreen.options[0];
                }
                
            } else if (currentScreen.type === Game.screenTypes.OPTIONS &&
                       this.#state.controlVolumeSlider
                ) {
                if (selection === Game.options.CONFIRMVOLUMEOPTION) {
                    this.#currentMenuSelection = currentScreen.options[index + 1];
                } else if (selection === Game.options.CANCELVOLUMEOPTION) {
                    this.#currentMenuSelection = currentScreen.options[index - 1];
                }
            }

            this.#arrowLeftRelease = false;
        }

        if (keys['ArrowRight'] && 
            this.#arrowRightRelease) {

            let index = currentScreen.options.indexOf(selection);

            if (currentScreen.type === Game.screenTypes.SOUND) {
                
                if (index === 0) {
                    this.#currentMenuSelection = currentScreen.options[1];
                }  else {
                    this.#currentMenuSelection = currentScreen.options[0];
                }
            } else if (currentScreen.type === Game.screenTypes.OPTIONS &&
                       this.#state.controlVolumeSlider
                ) {
                if (selection === Game.options.CONFIRMVOLUMEOPTION) {
                    this.#currentMenuSelection = currentScreen.options[index + 1];
                } else if (selection === Game.options.CANCELVOLUMEOPTION) {
                    this.#currentMenuSelection = currentScreen.options[index - 1];
                }
            }
            
            this.#arrowRightRelease = false;
        }

        if (keys['ArrowLeft'] && selection === Game.options.SLIDER) {
            if (this.#state.gameVolume > 0) {
                this.#state.gameVolume -= Game.volumeAdjustSpeed;
            } else {
                this.#state.gameVolume = 0;
            }
        }

        if (keys['ArrowRight'] && selection === Game.options.SLIDER) {
            if (this.#state.gameVolume < 1) {
                this.#state.gameVolume += Game.volumeAdjustSpeed;
            } else {
                this.#state.gameVolume = 1;
            }
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

        if (!keys['z'] && !keys['Z'] && currentScreen) {
            this.#zRelease = true;
        }

        if (
            currentScreen.type === Game.screenTypes.LEVEL &&
            !Array.isArray(selection)
        ) {
            const index = currentScreen.options.indexOf(selection);
            this.#currentLevelNum = index;
        } else if (currentScreen.type === Game.screenTypes.LEVEL &&
            Array.isArray(selection)
        ) {
            this.#currentLevelNum = 0;
        }
    }

    handleScreenChange() {
        const selection = this.#currentMenuSelection;
        const screen = this.#currentMenuScreen;

        if (
            screen.name !== Game.screenNames.LEVEL ||
            Array.isArray(selection)
        ) {
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
            } else if (Array.isArray(selection) ||
                       selection === Game.options.WINSCREENRETURN) {
                this.#state.levelComplete = false;
                this.setCurrentScreen(`${Game.screenNames.MAIN}`);
            } else if (selection === Game.options.START) {
                this.#currentMenuSelection = this.#currentMenuScreen.options[0];
                this.#currentLevelNum = 0;
                this.loadLevel(this.#currentLevelNum);
                this.#state.inLevel = true;
            } else if (selection === Game.options.PLAYSOUND ||
                    selection === Game.options.DISABLESOUND
            ) {
                this.setCurrentScreen(`${Game.screenNames.MAIN}`);
            } else if (selection === Game.options.LEVEL) {
                this.setCurrentScreen(`${Game.screenNames.LEVEL}`);
            } else if (selection === Game.options.WINSCREENCONTINUE) {
                if (this.#allLevels.length > this.#currentLevelNum + 1) {
                    this.#currentLevelNum += 1;
                    this.#state.levelComplete = false;
                    this.#state.inLevel = true;
                }
            } else if (selection === Game.options.OPTIONS) {
                this.setCurrentScreen(`${Game.screenNames.OPTIONS}`);
                this.updateOptionsScreen();
                this.#currentMenuSelection = this.#currentMenuScreen.options[0];
            }
        } else {
            this.handleLevelSelect(screen, selection);
        }
    }

    handleLevelSelect(screen, selection) {
        this.#state.inLevel = true;
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

    get currentMenuScreen() {
        return this.#currentMenuScreen;
    }

    get currentMenuSelection() {
        return this.#currentMenuSelection;
    }

    get currentLevelNum() {
        return this.#currentLevelNum;
    }
}