export default class Token {
    #pos;
    #key;
    #activeState = true;
    #type = 'Token';

    constructor(pos, key) {
        this.#pos = pos;
        this.#key = key;
    }

    get key() {
        return this.#key;
    }

    get pos() {
        return this.#pos;
    }

    get type() {
        return this.#type;
    }

    get activeState() {
        return this.#activeState;
    }

    set activeState(newState) {
        this.#activeState = newState;
    }
}