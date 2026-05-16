import Vector from "./Vector.js";

export default class Move {
    // Speed of horizontal movement
    static speed = 7;

    // Max vert speed when falling
    static maxGravity = 1;

    // Controls how much gravity affects vertspeed per tick
    static gravityMod = 0.01;

    static direction = Object.freeze({
        LEFT: 'Left',
        RIGHT: 'Right',
        UP: 'Up',
        DOWN: 'Down'
    });

    // Used to ensure correct visual display for horizontal collisions
    static xCollisionOffsetModifier = 0.09;

    static yDownCollisionOffsetModifier = 0.95;

    constructor(level, player, keys, time) {
        this.level = level;
        this.player = player;
        this.keys = keys;
        this.time = time;
        this.newX = this.player.pos.x;
        this.newY = this.player.pos.y;
        this.xLeftCollisionOffset = 1 - this.player.width + Move.xCollisionOffsetModifier;
        this.xRightCollisionOffset = this.xLeftCollisionOffset - 0.18;
        this.yDownCollisionOffset = 1 - this.player.height + Move.yDownCollisionOffsetModifier;
        this.yUpCollisionOffset = this.yDownCollisionOffset + 0.05;
    }

    // TO DO: Prevent movement if both left & right held at same time //

    update() {
        if (this.keys['ArrowLeft']) {
            if (this.checkMove(Move.direction.LEFT)) {
                this.newX -= Move.speed * this.time;
            }
        }

        if (this.keys['ArrowRight']) {
            if (this.checkMove(Move.direction.RIGHT)) {
                this.newX += Move.speed * this.time;
            }
        }

        return new Vector(this.newX, this.newY);
    }

    // Returns true if a potential move is free from collisions
    checkMove(direction) {
        let result = false;

        if (direction === 'Left') {
            let xCheck = this.newX - Move.speed * this.time + this.xLeftCollisionOffset;
            if (this.level.checkTileAt(xCheck, this.newY - (this.yDownCollisionOffset * 1.1)) && 
                this.level.checkTileAt(xCheck, this.newY + this.player.height - (this.yDownCollisionOffset * 1.2)) &&
                this.level.checkTileAt(xCheck, this.newY + (this.player.height / 3))) {
                result = true;
            }
        }

        if (direction === 'Right') {
            let xCheck = this.newX + Move.speed * this.time + this.player.width + this.xRightCollisionOffset;
            if (this.level.checkTileAt(xCheck, this.newY - (this.yDownCollisionOffset * 1.1)) &&
                this.level.checkTileAt(xCheck, this.newY + this.player.height - (this.yDownCollisionOffset * 1.2)) &&
                this.level.checkTileAt(xCheck, this.newY + (this.player.height / 3))) {
                result = true;
            }
        }

        if (direction === 'Down') {
            let yCheck = this.newY + this.player.height - this.yDownCollisionOffset;
            if (this.level.checkTileAt(this.newX + this.xLeftCollisionOffset, yCheck) &&
                this.level.checkTileAt(this.newX + this.player.width + this.xRightCollisionOffset, yCheck)) {
                result = true;
            }
        }

        if (direction === 'Up') {
            let yCheck = this.newY - this.yUpCollisionOffset;
            if (this.level.checkTileAt(this.newX + this.xLeftCollisionOffset, yCheck) &&
                this.level.checkTileAt(this.newX + this.player.width + this.xRightCollisionOffset, yCheck)) {
                result = true
            }
        }

        return result;
    }

    applyVertSpeed() {
        
    }
}