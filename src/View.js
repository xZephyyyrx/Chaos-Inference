export default class View {

    static tileIdentifier = 'Tile';

    static hazardIdentifier = 'Hazard';

    static tokenIdentifier = 'Token';

    static camera = {
        x: 0,
        y: 0
    }

    static bgParallaxRate = 2;

    // Marks by how much each sprite has been upscaled
    #tileUpscale = 10;

    // Used to multiply tilemap x and y values to ensure tiles
    // are isolated at the correct coordinates
    // Operates off the assumption that all level tiles will be
    // a multiple of 16x16 pixels
    #tileSize = 16;

    // Controls how many fg tiles display along the canvas width
    #fgTileDisplaySize = 24;

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
        this.deadZone = {
            left: this.fgCanvas.width * 0.4,
            right: this.fgCanvas.width * 0.6,
            top: this.fgCanvas.height * 0.4,
            bottom: this.fgCanvas.height * 0.6
        }
    }

    renderAll(
        grid, 
        fgTileset, 
        fgTilemap, 
        hazardSprites, 
        tokenSprites,
        playerSprite,
        playerPos,
        playerDimensions,
        playerDirection,
        bgTileset,
        shaderTime
    ) {

        this.setCameraPosition(grid, playerPos, playerDimensions);

        this.clearFg();

        this.fgCtx.save();
        this.bgCtx.save();

        this.fgCtx.translate(
            Math.floor(-View.camera.x), 
            Math.floor(-View.camera.y)
        );

        this.renderLevel(
            grid, 
            fgTileset, 
            fgTilemap, 
            hazardSprites, 
            tokenSprites
        );

        this.renderPlayer(
            playerSprite,
            playerPos,
            playerDimensions,
            playerDirection
        );

        this.renderBgTiles(bgTileset);

        this.fgCtx.restore();
        this.bgCtx.restore();

        this.updateShader(
            (performance.now() - shaderTime) * 0.001, 
            playerPos,
            playerDimensions
        );
    }

    setCameraPosition(grid, playerPos, playerDimensions) {
        const levelWidth = grid[0].length * this.#fgTileDisplaySize;
        const levelHeight = grid.length * this.#fgTileDisplaySize;

        const playerWorldX = 
            (playerPos.x + playerDimensions.width / 2) * this.#fgTileDisplaySize;

        const playerWorldY = 
            (playerPos.y + playerDimensions.height / 2) * this.#fgTileDisplaySize;

        const playerScreenX = playerWorldX - View.camera.x;
        const playerScreenY = playerWorldY - View.camera.y;

        if (playerScreenX < this.deadZone.left) {
            View.camera.x -= (this.deadZone.left - playerScreenX);
        }

        if (playerScreenX > this.deadZone.right) {
            View.camera.x += (playerScreenX - this.deadZone.right);
        }

        if (playerScreenY < this.deadZone.top) {
            View.camera.y -= (this.deadZone.top - playerScreenY);
        }

        if (playerScreenY > this.deadZone.bottom) {
            View.camera.y += (playerScreenY - this.deadZone.bottom);
        }

        const maxCamX = Math.max(0, levelWidth - this.fgCanvas.width);
        const maxCamY = Math.max(0, levelHeight - this.fgCanvas.height);

        View.camera.x = Math.floor(
            Math.max(0, Math.min(View.camera.x, maxCamX))
        );

        View.camera.y = Math.floor(
            Math.max(0, Math.min(View.camera.y, maxCamY))
        );
    }

    renderLevel(grid, tileset, tilemap, hazardSprites, tokenSprites) {
        this.renderLevelTiles(grid, tileset, tilemap);
        this.renderLevelObjects(grid, hazardSprites, tokenSprites);
    }

    renderPlayer(sprite, pos, dimensions, direction) {

        const right = 'right';
        const left = 'left';

        let sx = 0;
        let sy = 0;

        if (direction === left) {
            sx = 16 * this.#tileUpscale;
        }

        this.fgCtx.drawImage(
            sprite,
            sx, sy,
            this.#tileSize * this.#tileUpscale,
            this.#tileSize * this.#tileUpscale * 2,
            pos.x * this.#fgTileDisplaySize,
            pos.y * this.#fgTileDisplaySize,
            dimensions.width * this.#fgTileDisplaySize,
            dimensions.height * this.#fgTileDisplaySize
        );

        

        //this.renderHitbox(pos, dimensions);
    }

    renderHitbox(pos, dimensions) {
        this.fgCtx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.fgCtx.fillRect(
            pos.x * this.#fgTileDisplaySize,
            pos.y * this.#fgTileDisplaySize,
            dimensions.width * this.#fgTileDisplaySize,
            dimensions.height * this.#fgTileDisplaySize
        )
    }

    // Draws the foreground tiles based on the passed Level levelTiles
    renderLevelTiles(grid, tileset, tilemap) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {

                if (grid[y][x] === null || grid[y][x].type !== View.tileIdentifier) {continue;}

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

    renderLevelObjects(grid, hazardSprites, tokenSprites) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {

                if (grid[y][x] === null) {continue;}

                let image;

                if (grid[y][x].type === View.hazardIdentifier && 
                    grid[y][x].activeState
                ) {
                    image = hazardSprites;
                } else if (grid[y][x].type === View.tokenIdentifier &&
                    grid[y][x].activeState
                ) {
                    image = tokenSprites;
                }

                if (image) {
                    this.fgCtx.drawImage(
                        image,

                        grid[y][x].pos.x * this.#fgTileDisplaySize,
                        grid[y][x].pos.y * this.#fgTileDisplaySize,

                        this.#fgTileDisplaySize,
                        this.#fgTileDisplaySize
                    )
                }
                
            }
        }
    }

    renderLevelTokens(grid, tokenSprites) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {

                if (grid[y][x] === null || grid[y][x].type !== 'Token') {continue;}

                this.fgCtx.drawImage(
                    tokenSprites,

                    grid[y][x].pos.x * this.#fgTileDisplaySize,
                    grid[y][x].pos.y * this.#fgTileDisplaySize,

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

        matrix.translateSelf(
            Math.floor(
                -View.camera.x /
                View.bgParallaxRate
            ),
            Math.floor(
                -View.camera.y /
                View.bgParallaxRate
            )
        )

        bgPattern.setTransform(matrix);

        this.bgCtx.fillStyle = bgPattern;
        this.bgCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    updateShader(time, playerPos, playerDimensions) {
        const gl = this.glCtx;
        const playerScreenX =
            (playerPos.x + playerDimensions.width / 2) * 
            this.#fgTileDisplaySize - View.camera.x;
        const playerScreenY =
            (playerPos.y + playerDimensions.height / 2) * 
            this.#fgTileDisplaySize - View.camera.y;

        gl.useProgram(this.shaderData.program);

        gl.uniform1f(this.shaderData.uniforms.time, time);
        gl.uniform2f(
            this.shaderData.uniforms.resolution,
            this.glCanvas.width,
            this.glCanvas.height
        );
        gl.uniform2f(
            this.shaderData.uniforms.playerCoord,
            playerScreenX,
            playerScreenY
        )

        gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    clearFg() {
        this.fgCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}