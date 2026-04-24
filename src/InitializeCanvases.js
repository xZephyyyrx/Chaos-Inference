export default class InitializeCanvases {
    
    // How much of the page the canvas fills
    static margin = 0.8;

    // How high-resolution the monitor is
    static dpr = window.devicePixelRatio || 1;

    // Defines the canvas aspect ratio
    static aspectRatio = 16 / 9;

    // Base canvas width and height are defined
    static baseCanvasWidth = window.innerWidth * this.margin;
    static baseCanvasHeight = window.innerHeight * this.margin;

    // Canvas dimensions scaled to correct aspect ratio
    static scaledCanvasWidth;
    static scaledCanvasHeight;


    static loadCanvas(canvasId) {
        return document.getElementById(`${canvasId}`);
    }

    static getContext(canvas, canvasType) {
        return canvas.getContext(`${canvasType}`);
    }

    static setCanvasDimensions() {

        // Defines the correct canvas width and height based on the aspect ratio
        this.scaledCanvasWidth = this.baseCanvasWidth;
        this.scaledCanvasHeight = this.scaledCanvasWidth / this.aspectRatio;

        // If the aspect ratio produces too tall a canvas, the width is 
        // adjusted in relation to the max height according to the aspect ratio
        if (this.scaledCanvasHeight > this.baseCanvasHeight) {
            this.scaledCanvasHeight = this.baseCanvasHeight;
            this.scaledCanvasWidth = this.scaledCanvasHeight * this.aspectRatio;
        }
    }

    static scaleCanvas(canvas, ctx, isGl) {

        // The visual size of the canvas is defined
        canvas.style.width = this.scaledCanvasWidth + 'px';
        canvas.style.height = this.scaledCanvasHeight + 'px';
        // The pixels contained in the canvas are defined
        canvas.width = this.scaledCanvasWidth * this.dpr;
        canvas.height = this.scaledCanvasHeight * this.dpr;
        // Contents of the canvas are scaled for high-res monitors
        // Transformation is not applied to webgl canvas
        if (!isGl) {
            ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }
    }
}