export default class GameController {
    #currentLevel;

    constructor(game, view, dataloader, bgCanvas, bgCtx, glCanvas, glCtx, fgCanvas, fgCtx) {

        // Game Logic //
        this.game = game;

        // View //
        this.view = view;

        // Data Loader //
        this.dataloader = dataloader;

        // Canvases //
        this.bgCanvas = bgCanvas;
        this.bgCtx = bgCtx;
        this.glCanvas = glCanvas;
        this.glCtx = glCtx;
        this.fgCanvas = fgCanvas;
        this.fgCtx = fgCtx;
    }

    setup() {
        this.dataloader.importTextData('levelinfo');
    }
}