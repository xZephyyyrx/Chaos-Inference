export default class InitializeCanvases {
    // How much of the page the canvas fills
    static margin = 0.8;

    // How high-resolution the monitor is
    static dpr = window.devicePixelRatio || 1;

    // Defines the canvas aspect ratio
    static aspectRatio = 16 / 9;

    // Base canvas width and height are defined
    static canvasWidth = window.innerWidth * this.margin;
    static canvasHeight = window.innerHeight * this.margin;

    static loadFgCanvas() {
        return document.getElementById('foreground-canvas');
    }

    static get2dContext(canvas) {
        return canvas.getContext('2d');
    }

    static scaleCanvas(canvas, ctx) {
    
        // Defines the initial width and height based on the aspect ratio
        let width = this.canvasWidth;
        let height = width / this.aspectRatio;

        // If the aspect ratio produces too tall a canvas, the width is 
        // adjusted in relation to the max height according to the aspect ratio
        if (height > this.canvasHeight) {
            height = this.canvasHeight;
            width = height * this.aspectRatio;
        }

        // The visual size of the canvas is defined
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // The pixels contained in the canvas are defined
        canvas.width = width * this.dpr;
        canvas.height = height * this * this.dpr;

        // Contents of the canvas are scaled for high-res monitors
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
}