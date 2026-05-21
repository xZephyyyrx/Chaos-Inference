export default class Hazard {
    #pos;
    #activeState = true;
    #key;
    #type = 'Hazard';

    constructor(pos, key) {
        this.#pos = pos;
        this.#key = key;
    }

    get pos() {
        return this.#pos;
    }

    get key() {
        return this.#key;
    }

    get activeState() {
        return this.#activeState;
    }

    get type() {
        return this.#type;
    }

    set activeState(newState) {
        this.#activeState = newState;
    }
}