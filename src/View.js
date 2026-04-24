export default class View {

    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Used to multiply tilemap x and y values to ensure tiles
    // are isolated at the correct coordinates
    #tilemapMod = 16;

    // Controls how many tiles display along the canvas width
    #tileDisplaySize = 20;

    // Specifies the size of each tile in the spritesheet
    #tilesetSpriteSize = 16 * this.#tileUpscale;

    constructor(canvasWidth, canvasHeight, clientWidth, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
        this.canvasWidth = canvasWidth ;
        this.canvasHeight = canvasHeight;
        this.#tileDisplaySize = clientWidth / this.#tileDisplaySize;
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    // Takes the map grid, the level tileset, and the tileset map and
    // renders the foreground tiles based on their location
    renderMap(map, tileset, tilesetMap) {

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const char = map[y][x];
                const tile = tilesetMap[char];

                if (!tile) continue;

                this.fgCtx.drawImage(

                    // Specifies the tileset to be used
                    tileset,

                    // Specifies the starting x and y coordinates in the tileset image
                    (tile[0] * this.#tilemapMod) * this.#tileUpscale, 
                    (tile[1] * this.#tilemapMod) * this.#tileUpscale,

                    // Specifies the width and height of the section to take from the tileset image
                    this.#tilesetSpriteSize, this.#tilesetSpriteSize,

                    // Specifies the starting x and y coordinates on the canvas
                    x * this.#tileDisplaySize, y * this.#tileDisplaySize,

                    // Specifies the width and height to draw on the canvas
                    this.#tileDisplaySize, this.#tileDisplaySize
                );
            }
        }
    }
}