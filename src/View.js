export default class View {


    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Used to multiply tilemap x and y values to ensure tiles
    // are isolated at the correct coordinates
    // Operates off the assumption that all level tiles will be
    // a multiple of 16x16 pixels
    #tileSize = 16;

    // Controls how many fg tiles display along the canvas width
    #fgTileDisplaySize = 20;

    // Used when drawing the bg to scale the tiles correctly
    #bgTileDisplayScale = 1 / (this.#fgTileDisplaySize / 10);

    constructor(canvasWidth, canvasHeight, clientWidth, shaderData, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
        this.canvasWidth = canvasWidth ;
        this.canvasHeight = canvasHeight;
        this.#fgTileDisplaySize = clientWidth / this.#fgTileDisplaySize;
        this.shaderData = shaderData;
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    renderPlayer(sprite, pos, dimensions) {
        this.fgCtx.drawImage(

            // image
            sprite,

            // dx & dy
            pos.x * this.#fgTileDisplaySize - ((dimensions.width-1)*this.#fgTileDisplaySize),
            pos.y * this.#fgTileDisplaySize- ((dimensions.height-1)*this.#fgTileDisplaySize),

            // dWidth & dHeight
            dimensions.width * this.#fgTileDisplaySize,
            dimensions.height * this.#fgTileDisplaySize
        );
    }

    // Draws the foreground tiles based on the passed Level levelTiles
    renderFgTiles(grid, tileset, tilemap) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {

                if (grid[y][x] === null) {continue;}

                this.fgCtx.drawImage(

                    // image
                    tileset,

                    // sx & sy
                    tilemap[grid[y][x].direction][0]*this.#tileSize*this.#tileUpscale,
                    tilemap[grid[y][x].direction][1]*this.#tileSize*this.#tileUpscale,

                    // sWidth & sHeight
                    this.#tileSize * this.#tileUpscale,
                    this.#tileSize * this.#tileUpscale,

                    // dx & dy
                    grid[y][x].pos.x*this.#fgTileDisplaySize,
                    grid[y][x].pos.y*this.#fgTileDisplaySize,

                    // dWidth & dHeight
                    this.#fgTileDisplaySize,
                    this.#fgTileDisplaySize
                )
            }
        }
    }

    renderBgTiles(tileset) {
        const bgPattern = this.bgCtx.createPattern(tileset, 'repeat');
        const matrix = new DOMMatrix();
        matrix.scaleSelf(this.#bgTileDisplayScale, this.#bgTileDisplayScale);

        bgPattern.setTransform(matrix);

        this.bgCtx.fillStyle = bgPattern;
        this.bgCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    updateShader(time) {
        const gl = this.glCtx;

        gl.useProgram(this.shaderData.program);

        gl.uniform1f(this.shaderData.uniforms.time, time);
        gl.uniform2f(
            this.shaderData.uniforms.resolution,
            this.glCanvas.width,
            this.glCanvas.height
        );

        gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    clearFg() {
        this.fgCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}