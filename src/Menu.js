export default class Menu {
    #name;
    #type;
    #options;
    #text;

    constructor(name, type, options, text) {
        this.#name = name;
        this.#type = type;
        this.#options = options;
        this.#text = text;
    }

    get name() {
        return this.#name;
    }

    get type() {
        return this.#type;
    }

    set options(newOptions) {
        this.#options = newOptions;
    }

    get options() {
        return this.#options;
    }

    get text() {
        return this.#text;
    }
}