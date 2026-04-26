export default class View {

    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Used to multiply tilemap x and y values to ensure tiles
    // are isolated at the correct coordinates
    #tilemapMod = 16;

    // Controls how many fg tiles display along the canvas width
    #fgTileDisplaySize = 20;

    // Controls the size of the bg tiles in proportion to the fg tiles
    #bgTileMod = 7;

    // Used when drawing the bg to scale the tiles correctly
    #bgTileDisplaySize = this.#tilemapMod * this.#bgTileMod;

    // Specifies the size of each tile in the spritesheet
    #tilesetSpriteSize = 16 * this.#tileUpscale;

    constructor(canvasWidth, canvasHeight, clientWidth, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
        this.canvasWidth = canvasWidth ;
        this.canvasHeight = canvasHeight;
        this.#fgTileDisplaySize = clientWidth / this.#fgTileDisplaySize;
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    // Takes the map grid, the level tileset, and the tileset map and
    // renders the foreground tiles based on their location
    renderMap(gridmap, fgTileset, fgTilesetMap, bgTileset) {

        this.renderTiles(this.fgCtx, fgTileset, fgTilesetMap, gridmap);
        this.renderTiles(this.bgCtx, bgTileset);
    }

    // Takes the context, tileset image, tileset map, and gridmap
    // and draws the appropriate tiles on the specified canvas
    // If no gridmap or tilesetMap is passed, the tiles loop across the entire canvas
    renderTiles(context, tileset, tilesetMap, gridmap) {

        if (gridmap) {
            for (let y = 0; y < gridmap.length; y++) {
                for (let x = 0; x < gridmap[y].length; x++) {
                    
                    const char = gridmap[y][x];
                    const tile = tilesetMap[char];

                    if (!tile) continue;

                    context.drawImage(
                        // Specifies the tileset to be used
                        tileset,

                        // Specifies the starting x and y coordinates in the tileset image
                        (tile[0] * this.#tilemapMod) * this.#tileUpscale, 
                        (tile[1] * this.#tilemapMod) * this.#tileUpscale,

                        // Specifies the width and height of the section to take from the tileset image
                        this.#tilesetSpriteSize, this.#tilesetSpriteSize,

                        // Specifies the starting x and y coordinates on the canvas
                        x * this.#fgTileDisplaySize, y * this.#fgTileDisplaySize,

                        // Specifies the width and height to draw on the canvas
                        this.#fgTileDisplaySize, this.#fgTileDisplaySize
                    );
                }
            }
        } else {
            const bgPattern = context.createPattern(tileset, 'repeat');

            const matrix = new DOMMatrix();
            matrix.scaleSelf(
                this.#fgTileDisplaySize / this.#bgTileDisplaySize,
                this.#fgTileDisplaySize / this.#bgTileDisplaySize);

            bgPattern.setTransform(matrix);

            context.fillStyle = bgPattern;
            context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
}