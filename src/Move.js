import Vector from "./Vector.js";

export default class Move {
    // Speed of horizontal movement
    static speed = 7;

    static initialJumpSpeed = Move.speed * 2;

    // Prevents the character from jumping repeatedly when
    // the z key is held
    static hasJumped = false;

    static zKeyRelease = false;

    // Allows players to buffer a jump slightly before colliding
    // with the ground
    static totalJumpBufferFrames = 5;
    static activeJumpBufferFrames = 0;

    // Controls for how long a player may jump after leaving a platform
    static totalCoyoteFrames = 5;
    static activeCoyoteFrames = 0;
    
    // Tracks whether the player was previously on a platform
    static previousDownCollision = false;

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

        this.handleCoyoteFrames();

        return {
            pos: new Vector(this.posX, this.posY),
            vel: new Vector(this.velX, this.velY),
            collisions: this.collisions
        }
    }

    handleCoyoteFrames() {
        let currentCollision = this.collidesWithGround(this.posX, this.posY);

        if (Move.activeCoyoteFrames > 0) {
            Move.activeCoyoteFrames -= 1;
        }
        
        if (Move.previousDownCollision && !currentCollision && !this.keys['z']) {
            Move.activeCoyoteFrames = Move.totalCoyoteFrames;
        }

        Move.previousDownCollision = currentCollision;
    }

    handleInput() {
        this.velX = 0;

        if (this.keys['ArrowLeft']) {
            this.velX = -Move.speed;
        }

        if (this.keys['ArrowRight']) {
            this.velX = Move.speed;
        }

        if (this.keys['z']) {

            // Standard Jump
            if (this.collisions.down && !Move.hasJumped ||
                Move.activeCoyoteFrames > 0 && !Move.hasJumped
            ) {
                this.velY = -Move.initialJumpSpeed;
                this.collisions.down = false;
                Move.hasJumped = true;

            // Trigger buffer jump
            } else if (Move.zKeyRelease) {
                Move.activeJumpBufferFrames = Move.totalJumpBufferFrames;
            }

            Move.zKeyRelease = false;
        }

        if (Move.activeJumpBufferFrames > 0) {
            this.checkBufferJump();
        }

        if (!this.keys['z']) {
            Move.zKeyRelease = true;
        }

        if (!this.keys['z'] && this.collisions.down) {
            Move.hasJumped = false;
        }

        if ((!this.keys['z'] && this.velY < 0) ||
             this.collisions.up && this.velY < 0) {
            this.velY *= 0.5;
        }
    }

    applyGravity() {
        if (!this.collisions.down) {
            this.velY += Move.gravityMod;
        } else {
            this.velY = 0;
        }

        if (this.velY > Move.maxGravity) {
            this.velY = Move.maxGravity;
        }
    }

    checkBufferJump() {
        if (this.collisions.down) {
            this.velY = -Move.initialJumpSpeed;
            this.collisions.down = false;
            Move.hasJumped = true;
            Move.zKeyRelease = false;
        } else {
            Move.activeJumpBufferFrames -= 1;
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

            this.velY = 0;
        }
    }

    collides(x, y) {

        const inset = 0.001;
        const xOffset = 0.1;
        const yOffset = 0.05;

        const left = x + inset + xOffset;
        const right = x + this.player.width - inset - xOffset;
        const top = y + inset + yOffset;
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

    collidesWithGround(x, y) {

        const inset = 0.001;
        const xOffset = 0.1;
        const yOffset = 0.05;
        
        const left = x + inset + xOffset;
        const right = x + this.player.width - inset - xOffset;
        const bottom = y + this.player.height - inset + yOffset;

        return !(
            this.level.checkTileAt(left, bottom) && 
            this.level.checkTileAt(right, bottom)
        )
    }
}