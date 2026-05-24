export default class View {

    // MENU ATTRIBUTES //

    static mainMenuType = 'main';
    static tutorialMenuType = 'tutorial';
    static storyMenuType = 'story';
    static soundMenuType = 'sound';

    static menuBgTimeOffset = 0;

    static menuLineWidth = 2;

    // Size of the options box determined by canvas width / optionsWidth
    static optionsWidth = 3.3;

    static returnOptionString = 'Return to Title Screen';

    // Size of dialogue box is screenHeight / dialogue height
    static dialogueHeight = 3;

    static menuBgColour = 'rgb(0, 0, 0)';

    static menuLineColour = 'rgb(255, 255, 255)';

    static menuTextColour = 'rgb(255, 255, 255)';

    static menuTextHighlight = 'rgb(255, 248, 131)';
    static menuTextDark = View.menuBgColour;
    static totalHighlightFlickerFrames = 120;
    static activeStateHighlightFlickerFrames = View.totalHighlightFlickerFrames;

    static menuFont = 'PacMan1980';

    static previousMenuOption = null;
    static previousScreenName = null;

    // LEVEL ATTRIBUTES //

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

    constructor(clientWidth, shaderData, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {
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

    renderScreen(screenData, selectedOption, time, bgTileset) {
        View.menuBgTimeOffset += time;
        this.fgCtx.resetTransform();
        this.clearFg();
        this.renderScreenBackground(bgTileset);
        this.renderScreenRect(screenData.type);
        this.renderScreenLayout(screenData.type);
        this.renderScreenText(screenData.text, screenData.type);
        this.renderScreenOptions(
            screenData.options, 
            screenData.type,
            selectedOption,
            screenData.name
        );
    }

    renderScreenBackground(tileset) {
        const bgPattern = this.bgCtx.createPattern(tileset, 'repeat');
        const matrix = new DOMMatrix();
        const scale = this.bgCanvas.width / 1145;
        matrix.scaleSelf(scale, scale);

        const scrollSpeedModifier = -30;

        matrix.translateSelf(
            View.menuBgTimeOffset * scrollSpeedModifier,
            0
        )

        bgPattern.setTransform(matrix);

        this.bgCtx.clearRect(
            0, 0,
            this.bgCanvas.width,
            this.bgCanvas.height
        )

        this.bgCtx.fillStyle = bgPattern;
        this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    }

    renderScreenRect(type) {
        const ctx = this.fgCtx;
        const canvasWidth = this.fgCanvas.width;
        const canvasHeight = this.fgCanvas.height;
        const optionsWidth = canvasWidth / View.optionsWidth;
        const dialogueHeight = canvasHeight / View.dialogueHeight * 2;

        ctx.fillStyle = View.menuBgColour;
        ctx.fillRect(0, 0, optionsWidth, canvasHeight);

        if (type !== View.mainMenuType &&
            type !== View.soundMenuType
        ) {
            ctx.fillRect(optionsWidth, dialogueHeight, canvasWidth, canvasHeight)
        } else if (type === View.soundMenuType) {
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    }

    renderScreenLayout(type) {
        const canvasWidth = this.fgCanvas.width;
        const canvasHeight = this.fgCanvas.height;
        const optionsWidth = canvasWidth / View.optionsWidth;
        const dialogueHeight = canvasHeight / View.dialogueHeight * 2;

        if (type === View.mainMenuType) {

            // Options Panel
            this.drawLayoutLine(
                optionsWidth, 
                optionsWidth,
                0,
                canvasHeight
            )

        } else if (type === View.tutorialMenuType ||
                   type === View.storyMenuType
        ) {
            
            // Options Panel
            this.drawLayoutLine(
                optionsWidth, 
                optionsWidth,
                0,
                canvasHeight
            )

            // Dialogue Panel
            this.drawLayoutLine(
                optionsWidth,
                canvasWidth,
                dialogueHeight,
                dialogueHeight
            )
        }
    }

    renderScreenText(text, type) {
        const ctx = this.fgCtx;
        const colour = View.menuTextColour;
        const canvasWidth = this.fgCanvas.width;
        const canvasHeight = this.fgCanvas.height;
        const textXOffset = 1.05;
        const textYOffset = 1.09;
        const titleXOffset = 1.1;
        const titleYOffset = 1.1;
        let newLineYOffset = this.fgCanvas.height / 16;
        const textSize = canvasWidth / 24;
        const font = View.menuFont;
        let x;
        let y;


        ctx.fillStyle = colour;
        if (type === View.mainMenuType) {
            ctx.font = `${textSize}px ${font}`;
            x = (canvasWidth / View.optionsWidth) * titleXOffset;
            y = (canvasHeight / (View.dialogueHeight * 3)) * titleYOffset;
        } else if (type !== View.soundMenuType) {
            ctx.font = `${textSize / 2}px ${font}`;
            x = (canvasWidth / View.optionsWidth) * textXOffset;
            y = (canvasHeight / View.dialogueHeight * 2) * textYOffset;
        } else {
            ctx.font = `${textSize / 2}px ${font}`;
            x = canvasWidth / 3;
            y = canvasHeight / 2.5;
        }
        

        if (type !== View.soundMenuType) {
            if (text.length > 1 && Array.isArray(text)) {
                Object.values(text).forEach((line, index) => {
                    ctx.fillText(line, x, y + (index * newLineYOffset));
                });
            } else {
                ctx.fillText(text, x, y);
            }
        } else {
            const xOffset = canvasWidth / 6.7;
            ctx.fillText(text[0], x, y + (newLineYOffset));
            ctx.fillText(text[1], x - xOffset, canvasHeight - (newLineYOffset / 2));
        }
    }

    renderScreenOptions(options, type, selectedOption, screenName) {
        const ctx = this.fgCtx;
        const canvasWidth = this.fgCanvas.width;
        const canvasHeight = this.fgCanvas.height;
        const returnOption = View.returnOptionString;
        let x = (canvasWidth / 64) * 1.4;
        let y = canvasHeight / 16;
        const newLineYOffset = canvasHeight / 14;
        const xOffset = canvasWidth / 6;
        const returnYOffset = canvasHeight - (y + y * 0.5);
        const colour = View.menuTextColour;
        const highlight = View.menuTextHighlight;
        const font = View.menuFont;
        const textSize = canvasWidth / 48;
        
        if (type === View.soundMenuType) {
            x = canvasWidth / 2.75;
            y  = canvasHeight / 20 * 11;
        }

        ctx.font = `${textSize}px ${font}`;

        Object.values(options).forEach((option, index) => {
            if (option === selectedOption) {
                if (option !== View.previousMenuOption ||
                    screenName !== View.previousScreenName
                ) {
                    View.activeStateHighlightFlickerFrames = View.totalHighlightFlickerFrames;
                }
                View.previousMenuOption = option;
                View.previousScreenName = screenName;
                ctx.fillStyle = highlight;
                if (type !== View.soundMenuType) {
                    if (!Array.isArray(option)) {
                        this.drawCursor(x, y, index, newLineYOffset, type);
                    } else {
                        this.drawCursor(x, 0, 1, returnYOffset, type);
                    }
                } else {
                    this.drawCursor(x, y, index, xOffset, type);
                }
                
            } else {
                ctx.fillStyle = colour;
            }
            if (type !== View.soundMenuType) {
                if (!Array.isArray(option)) {
                    ctx.fillText(option, x, y + (newLineYOffset * index));
                } else {
                    ctx.fillText(option[0], x, returnYOffset);
                    ctx.fillText(option[1], x - (canvasWidth / 300), canvasHeight - (y * 0.5));
                }
            } else {
                ctx.fillText(
                    option, 
                    x + (xOffset * index), 
                    y
                );

            }
        });
    }

    drawCursor(x, y, index, offSet, type) {
        const ctx = this.fgCtx;
        const canvasWidth = this.fgCanvas.width;
        const canvasHeight = this.fgCanvas.height;
        let xStart = x / 3;
        let xStep = xStart + canvasWidth / 96;
        let yStart = y + (offSet * index);
        let yStep = y - (canvasHeight / 32) + (offSet * index);
        let yEnd = y - (canvasHeight / 64) + (offSet * index);

        if (type === View.soundMenuType) {
            xStart = x - (canvasWidth / 96) + (offSet * index);
            xStep = xStart + canvasWidth / 96;
            yStart = y;
            yStep = y - (canvasHeight / 32);
            yEnd = y - (canvasHeight / 64);
        }

        ctx.save();

        let colour = View.menuTextHighlight;

        if (View.activeStateHighlightFlickerFrames <= (View.totalHighlightFlickerFrames / 2)) {
            colour = View.menuTextDark;
        }

        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xStart, yStep);
        ctx.lineTo(xStep, yEnd);
        ctx.lineTo(xStart, yStart);
        ctx.lineWidth = 1;
        ctx.strokeStyle = colour;
        ctx.fill();

        ctx.restore();

        View.activeStateHighlightFlickerFrames--;

        if (View.activeStateHighlightFlickerFrames <= 0) {
            View.activeStateHighlightFlickerFrames = View.totalHighlightFlickerFrames;
        }
    }

    drawLayoutLine(xStart, xEnd, yStart, yEnd) {
        const ctx = this.fgCtx;
        const lineWidth = View.menuLineWidth;
        const colour = View.menuLineColour;

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = colour;
        ctx.stroke();
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
        this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
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
        this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
    }
}