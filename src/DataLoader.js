export default class DataLoader {
    #filepathPrefix = 'data/';

    #shaderFilepath = 'shaders/';

    // Folder containing level gridmaps
    #gridmapFilepath = 'gridmaps/';

    // Filetype for text files
    #textFiletype = '.txt';

    // Folder containing player sprite images
    #playerSpritesFilepath = 'img/char/';

    // Folder containing level tileset images
    #tilesetFilepath = 'img/tilesets/';

    // Folder contain object images
    #objectSpritesFilepath = 'img/objects/'

    // Appends the correct filetype to tileset filenames
    #imageFiletype = '.webp';

    // Folder containing tile coordinates
    #tilemapFilepath = 'tilemaps/';

    // Appends the correct filetype to tilemap filenames
    #jsonFiletype = '.json';

    #musicFilepath = 'music/';

    #musicFiletype = '.ogg';

    async loadGameData(
        titleBgFilename,
        titleOstFilename,
        playerSpriteFilename,
        tilemapFilename
    ) {

        let titleBg;
        let titleOst;
        let playerSprite;
        let tilemap;

        // Load Title Screen Background
        try {
            titleBg = await this.importTileset(titleBgFilename);
        } catch (error) {
            console.log(error);
        }

        // Load Title Screen ost
        try {
            titleOst = await this.importMusic(titleOstFilename);
        } catch (error) {
            console.log(error);
        }

        // Load Character Sprite
        try {
            playerSprite = await this.importPlayerSprites(playerSpriteFilename);
        } catch (error) {
            console.log(error);
        }

        // Load Default Tilemap
        tilemap = await this.importTilesetMap(tilemapFilename);

        return {
            titleBg: titleBg,
            titleOst: titleOst,
            playerSprite: playerSprite,
            tilemap: tilemap
        }
    }

    async loadLevelGridmap(gridmapFilename) {
        let gridmap = await this.importGridmap(gridmapFilename);
        return this.parseMapData(gridmap);
    }

    async loadLevelData(
        fgTilesetFilename,
        bgTilesetFilename,
        hazardSpritesFilename,
        tokenSpritesFilename,
        goalSpritesFilename,
        levelOstFilename
    ) {
        let fgTileset;
        let bgTileset;
        let hazardSprites;
        let tokenSprites;
        let goalSprites;
        let levelOst;

        try {
            fgTileset = await this.importTileset(fgTilesetFilename);
        } catch (error) {
            console.log(error);
        }

        try {
            bgTileset = await this.importTileset(bgTilesetFilename);
        } catch (error) {
            console.log(error);
        }

        try {
            hazardSprites = await this.importObjectSprites(hazardSpritesFilename);
        } catch (error) {
            console.log(error);
        }

        try {
            tokenSprites = await this.importObjectSprites(tokenSpritesFilename);
        } catch (error) {
            console.log(error);
        }

        try {
            goalSprites = await this.importObjectSprites(goalSpritesFilename);
        } catch (error) {
            console.log(error);
        }

        try {
            levelOst = await this.importMusic(levelOstFilename);
        } catch (error) {
            console.log(error);
        }

        return {
            fgTileset: fgTileset,
            bgTileset: bgTileset,
            hazardSprites: hazardSprites,
            tokenSprites: tokenSprites,
            goalSprites: goalSprites,
            levelOst: levelOst
        }
    }
    
    async importGridmap(filename) {
        return await this.importText(this.#gridmapFilepath, filename);
    }

    async importShaderData(filename) {
        return await this.importText(this.#shaderFilepath, filename);
    }

    async importText(filepath, filename) {
        try {
            const response = await fetch(`${this.#filepathPrefix}` +
                                         `${filepath}` +
                                         `${filename}` +
                                         `${this.#textFiletype}`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}${this.#textFiletype}!`);
            }

            return await response.text();
        } catch (error) {
            console.log(error);
        }
    }

    async importPlayerSprites(filename) {
        return await this.importImage(filename, this.#playerSpritesFilepath);
    }

    async importTileset(filename) {
        return await this.importImage(filename, this.#tilesetFilepath);
    }

    async importObjectSprites(filename) {
        return await this.importImage(filename, this.#objectSpritesFilepath);
    }

    async importImage(filename, filepath) {
        const image = new Image();
        image.src = `${this.#filepathPrefix}` +
                      `${filepath}` +
                      `${filename}` +
                      `${this.#imageFiletype}`;

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () => 
                reject(new Error(`Failed to load ${this.#filepathPrefix}${filepath}${filename}${this.#imageFiletype}!`));
        });

        return image;
    }

    async importMasterLevelList() {
        const filename = 'allLevels';
        const filepath = 'config/';

        return await this.importJson(filepath, filename);
    }

    async getLevelDetails(filename) {
        const filepath = 'config/';

        return await this.importJson(filepath, filename);
    }

    async importTilesetMap(filename) {
        return await this.importJson(this.#tilemapFilepath, filename);
    }

    async importJson(filepath, filename) {
        try {
            const response = await fetch(`${this.#filepathPrefix}` +
                                         `${filepath}` +
                                         `${filename}` +
                                         `${this.#jsonFiletype}`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}${this.#jsonFiletype}!`)
            }

            return await response.json();

        } catch (error) {
            console.log(error);
        }
    }

    async importMusic(filename) {
        const music = new Audio();
        music.src = `${this.#filepathPrefix}` +
                      `${this.#musicFilepath}` +
                      `${filename}` +
                      `${this.#musicFiletype}`;

        await new Promise((resolve, reject) => {
            music.oncanplaythrough = resolve;
            music.onerror = () => 
                reject(new Error(`Failed to load ${filename}${this.#musicFiletype}!`));
        });

        music.loop = true;

        return music;
    }

    // Converts map data from raw text to a multidimensional array containing
    // each character in the form array[y][x]
    parseMapData(gridmap) {
        return gridmap.split(/\r?\n/).map(line => [...line]);
    }
}