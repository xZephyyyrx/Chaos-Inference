export default class DataLoader {
    #filepathPrefix = '../data/';
    #mapGridFilepath = 'maps/';
    #mapTilesetFilepath = 'img/level/';

    async importTextData(filename) {

        try {
            const response = await fetch(`${this.#filepathPrefix}${this.#mapGridFilepath}${filename}.txt`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.txt!`);
            }

            return await response.text();
        } catch (error) {
            console.log(error);
        }
    }

    async importTilesetData(filename) {

        const tileset = new Image();
        tileset.src = `${this.#filepathPrefix}${this.#mapTilesetFilepath}${filename}`;

        await new Promise(resolve => {
            tileset.onload = resolve;
        });

        return tileset;
    }

    // Converts map data from raw text to a multidimensional array containing
    // each character in the form array[y][x]
    parseMapData(mapData) {
        return mapData.split(/\r?\n/).map(line => [...line]);
    }
}