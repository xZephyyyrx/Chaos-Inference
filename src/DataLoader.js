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
    #tilemapFiletype = '.json';
    
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
                reject(new Error(`Failed to load ${filename}${this.#imageFiletype}!`));
        });

        return image;
    }

    async importTilesetMap(filename) {
        try {
            const response = await fetch(`${this.#filepathPrefix}` +
                                         `${this.#tilemapFilepath}` +
                                         `${filename}` +
                                         `${this.#tilemapFiletype}`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}${this.#tilemapFiletype}!`)
            }

            return await response.json();

        } catch (error) {
            console.log(error);
        }
        
    }

    // Converts map data from raw text to a multidimensional array containing
    // each character in the form array[y][x]
    parseMapData(gridmap) {
        return gridmap.split(/\r?\n/).map(line => [...line]);
    }
}