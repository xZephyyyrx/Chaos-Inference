export default class DataLoader {
    #filepathPrefix = 'data/';

    // Folder containing level gridmaps
    #gridmapFilepath = 'maps/';

    // Folder containing level tileset images
    #tilesetFilepath = 'img/level/';

    // Appends the correct filetype to tileset filenames
    #tilesetFiletype = '.webp';

    // Folder containing tile coordinates
    #tilemapFilepath = 'tilemaps/';

    // Appends the correct filetype to tilemap filenames
    #tilesetMapFiletype = '.json';
    

    async importText(filename) {
        try {
            const response = await fetch(`${this.#filepathPrefix}` +
                                         `${this.#gridmapFilepath}` +
                                         `${filename}.txt`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.txt!`);
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

        await new Promise(resolve => {
            tileset.onload = resolve;
        });

        return tileset;
    }

    async importTilesetMap(filename) {
        try {
            const response = await fetch(`${this.#filepathPrefix}` +
                                         `${this.#tilemapFilepath}` +
                                         `${filename}` +
                                         `${this.#tilesetMapFiletype}`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.json!`)
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