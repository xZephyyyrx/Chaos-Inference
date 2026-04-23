import InitializeCanvases from "./InitializeCanvases.js";

// LOAD CANVAS ELEMENTS //

const fgCanvas = InitializeCanvases.loadFgCanvas();
const fgCtx = InitializeCanvases.get2dContext(fgCanvas);

// SCALE CANVAS ELEMENTS

InitializeCanvases.scaleCanvas(fgCanvas, fgCtx);