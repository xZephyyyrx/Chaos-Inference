export default class View {

    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Sets the size of tiles on the canvas
    #tileDisplaySize = 32;

    // Specifies the size of each tile in the spritesheet
    #tilesetSpriteSize = 16 * this.#tileUpscale;

    constructor(canvasWidth, canvasHeight, dpr, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
        this.canvasWidth = canvasWidth * dpr;
        this.canvasHeight = canvasHeight * dpr;
        this.#tileDisplaySize = this.#tileDisplaySize * dpr;
        this.dpr = dpr;
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    renderMap(map, tileset) {

        const tileMap = {
            'x': {sx: 16, sy: 16 }
        }

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const char = map[y][x];
                const tile = tileMap[char];

                if (!tile) continue;

                this.fgCtx.drawImage(
                    tileset, 
                    tile.sx*this.#tileUpscale, tile.sy*this.#tileUpscale,
                    this.#tilesetSpriteSize, this.#tilesetSpriteSize,
                    x * this.#tileDisplaySize, y * this.#tileDisplaySize,
                    this.#tileDisplaySize, this.#tileDisplaySize
                )
            }
        }
    }
}