export default class Tile {
    #pos;
    #direction;
    #type = 'Tile';

    constructor(pos, direction) {
        this.#pos = pos;
        this.#direction = direction;
    }

    get direction() {
        return this.#direction;
    }

    get pos() {
        return this.#pos;
    }

    get type() {
        return this.#type;
    }
}