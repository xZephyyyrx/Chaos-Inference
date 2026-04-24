export default class View {

    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Sets the display size of map tiles in pixels
    #tileDisplaySize = 32;

    #tilesetSpriteSize = 16 * this.#tileUpscale;

    constructor(canvasWidth, canvasHeight, dpr, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
        this.canvasWidth = canvasWidth * dpr;
        this.canvasHeight = canvasHeight * dpr;
        this.#tileDisplaySize = this.#tileDisplaySize * dpr;
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    renderMap(map, tileset) {

        const tilesPerRow = Math.floor(tileset.width / this.#tilesetSpriteSize);

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {

            }
        }
    }
}