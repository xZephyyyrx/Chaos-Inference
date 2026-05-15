export default class Player {
    // Player position
    #pos;

    // Player width & height in terms of tiles
    // 
    #height = 1.5;
    #width = 0.75;

    constructor(pos) {
        this.#pos = pos;
    }

    set pos(newPos) {
        this.#pos = newPos;
    }

    get pos() {
        return this.#pos;
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }
}