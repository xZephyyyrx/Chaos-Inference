import InitializeCanvases from "./InitializeCanvases.js";
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

// INITIALIZE VIEW //

const view = new View(
    InitializeCanvases.scaledCanvasWidth, 
    InitializeCanvases.scaledCanvasHeight,
    InitializeCanvases.dpr,
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
gameController.setup();

// RUN GAME //