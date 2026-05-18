import Vector from "./Vector.js";

export default class Move {
    // Speed of horizontal movement
    static speed = 7;

    static initialJumpSpeed = Move.speed * 2;

    static maxGravity = 15;

    static gravityMod = 0.5;

    static direction = Object.freeze({
        LEFT: 'Left',
        RIGHT: 'Right',
        UP: 'Up',
        DOWN: 'Down'
    });

    constructor(level, player, keys, time) {
        this.level = level;
        this.player = player;
        this.keys = keys;
        this.time = time;
        this.posX = this.player.pos.x;
        this.posY = this.player.pos.y;
        this.velX = this.player.vel.x;
        this.velY = this.player.vel.y;
        this.collisions = this.player.collisions;
    }

    update() {

        this.handleInput();

        this.applyGravity();

        this.moveX();

        this.moveY();

        return {
            pos: new Vector(this.posX, this.posY),
            vel: new Vector(this.velX, this.velY),
            collisions: this.collisions
        }
    }

    handleInput() {
        this.velX = 0;

        if (this.keys['ArrowLeft']) {
            this.velX = -Move.speed;
        }

        if (this.keys['ArrowRight']) {
            this.velX = Move.speed;
        }

        if (this.keys['z'] && this.collisions.down) {
            this.velY = -Move.initialJumpSpeed;
            this.collisions.down = false;
        }
    }

    applyGravity() {
        if (!this.collisions.down) {
            this.velY += Move.gravityMod;
        } else {
            this.velY = 0;
        }
        

        console.log(this.velY)

        if (this.velY > Move.maxGravity) {
            this.velY = Move.maxGravity;
        }
    }

    moveX() {
        let potentialX = this.posX + this.velX * this.time;

        if (!this.collides(potentialX, this.posY)) {

            this.posX = potentialX;

            this.collisions.left = false;
            this.collisions.right = false;

        } else {
            if (this.velX > 0) {
                this.collisions.right = true;
            }

            if (this.velX < 0) {
                this.collisions.left = true;
            }

            this.velX = 0;
        }
    }

    moveY() {
        let previousY = this.posY;

        let potentialY = this.posY + this.velY * this.time;

        if (!this.collides(this.posX, potentialY)) {

            this.posY = potentialY;

            this.collisions.up = false;
            this.collisions.down = false;

        } else {
            this.posY = previousY;

            if (this.velY > 0) {
                this.collisions.down = true;
            }

            if (this.velY < 0) {
                this.collisions.up = true;
            }
        }
    }

    collides(x, y) {

        const inset = 0.001;

        const left = x + inset;
        const right = x + this.player.width - inset;
        const top = y + inset;
        const bottom = y + this.player.height - inset;
        const mid = y + (this.player.height / 2);

        return !(
            this.level.checkTileAt(left, top) &&
            this.level.checkTileAt(right, top) &&
            this.level.checkTileAt(left, mid) &&
            this.level.checkTileAt(right, mid) &&
            this.level.checkTileAt(left, bottom) &&
            this.level.checkTileAt(right, bottom)
        );
    }
}