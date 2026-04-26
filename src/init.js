import InitializeCanvases from "./InitializeCanvases.js";
import CompileShaders from "./CompileShaders.js";
import GameController from "./GameController.js";
import DataLoader from "./DataLoader.js";
import View from "./View.js";
import Game from "./Game.js";

// INITIALIZE CANVAS ELEMENTS //

const fgCanvasId = 'foreground-canvas';
const fgCanvasType = '2d';
const fgIsGl = false;

const bgCanvasId = 'background-canvas';
const bgCanvasType = '2d';
const bgIsGl = false;

const glCanvasId = 'shader-canvas';
const glCanvasType = 'webgl';
const glIsGl = true;

const bgCanvas = InitializeCanvases.loadCanvas(bgCanvasId);
const bgCtx = InitializeCanvases.getContext(bgCanvas, bgCanvasType);

const glCanvas = InitializeCanvases.loadCanvas(glCanvasId);
const glCtx = InitializeCanvases.getContext(glCanvas, glCanvasType);

const fgCanvas = InitializeCanvases.loadCanvas(fgCanvasId);
const fgCtx = InitializeCanvases.getContext(fgCanvas, fgCanvasType);

// SCALE CANVAS ELEMENTS //

InitializeCanvases.setCanvasDimensions();

InitializeCanvases.scaleCanvas(bgCanvas, bgCtx, bgIsGl);
InitializeCanvases.scaleCanvas(glCanvas, glCtx, glIsGl);
InitializeCanvases.scaleCanvas(fgCanvas, fgCtx, fgIsGl);

// LOAD INITIAL DATA //

const dataloader = new DataLoader();

// CREATE AND COMPILE INITIAL SHADERS //

async function compileShaders() {

    const vertexShader = await dataloader.importShaderData('vertexShader');
    const fragmentShader = await dataloader.importShaderData('fragmentShader');

    try {
        CompileShaders.initializeShaders(glCanvas, glCtx, vertexShader, fragmentShader);
    } catch (error) {
        console.log(error);
    }
}


// INITIALIZE VIEW //

// Used to ensure the canvas displays the same at different resolutions
const clientWidth = fgCanvas.clientWidth;

const view = new View(
    InitializeCanvases.scaledCanvasWidth, 
    InitializeCanvases.scaledCanvasHeight,
    clientWidth,
    bgCanvas, 
    bgCtx, 
    glCanvas, 
    glCtx, 
    fgCanvas,
    fgCtx
);

// INITIALIZE GAME //

const game = new Game();

const gameController = new GameController(game, view, dataloader);

await compileShaders();

gameController.setup();

// RUN GAME //