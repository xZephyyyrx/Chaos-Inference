export default class Player {

    // Player position
    #pos;

    // Player velocity
    #vel;

    // Player width & height in terms of tiles
    #height = 1.5;
    #width = 0.75;

    // Used to determine whether jumps or walljump inputs are valid
    #collisions = {
        left: false,
        right: false,
        up: false,
        down: false
    }

    #direction = 'right';

    #aliveState = true;

    constructor(pos, vel) {
        this.#pos = pos;
        this.#vel = vel;
    }

    set pos(newPos) {
        this.#pos = newPos;
    }

    set vel(newVel) {
        this.#vel = newVel;
    }

    set collisions(newState) {
        this.#collisions = newState;
    }

    set aliveState(newState) {
        this.#aliveState = newState;
    }

    set direction(newDirection) {
        this.#direction = newDirection;
    }

    get pos() {
        return this.#pos;
    }

    get vel() {
        return this.#vel;
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }

    get collisions() {
        return this.#collisions;
    }

    get direction() {
        return this.#direction;
    }
    
    get aliveState() {
        return this.#aliveState;
    }
}