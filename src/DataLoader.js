export default class DataLoader {
    #filepathPrefix = 'data/';

    #shaderFilepath = 'shaders/';

    // Folder containing level gridmaps
    #gridmapFilepath = 'gridmaps/';

    #textFiletype = '.txt';

    // Folder containing level tileset images
    #tilesetFilepath = 'img/tilesets/';

    // Appends the correct filetype to tileset filenames
    #tilesetFiletype = '.webp';

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

    async importTileset(filename) {

        const tileset = new Image();
        tileset.src = `${this.#filepathPrefix}` +
                      `${this.#tilesetFilepath}` +
                      `${filename}` +
                      `${this.#tilesetFiletype}`;

        await new Promise((resolve, reject) => {
            tileset.onload = resolve;
            tileset.onerror = () => 
                reject(new Error(`Failed to load ${filename}${this.#tilesetFiletype}!`));
        });

        return tileset;
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