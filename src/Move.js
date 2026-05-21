import Vector from "./Vector.js";

export default class Move {

    static playerDirection = Object.freeze({
        LEFT: 'left',
        RIGHT: 'right'
    });

    // MOVEMENT SPEED //

    // Speed of horizontal movement
    static speed = 7;

    static initialJumpSpeed = Move.speed * 2;

    // BASIC JUMP FUNCTIONALITY //

    // Prevents the character from jumping repeatedly when
    // the z key is held
    static hasJumped = false;

    static zKeyRelease = false;

    // JUMP BUFFERS //

    // Allows players to buffer a jump slightly before colliding
    // with the ground
    static totalJumpBufferFrames = 5;
    static activeJumpBufferFrames = 0;

    // COYOTE FRAMES //

    // Controls for how long a player may jump after leaving a platform
    static totalCoyoteFrames = 8;
    static activeCoyoteFrames = 0;
    
    // Tracks whether the player was previously on a platform
    static previousDownCollision = false;

    // WALLJUMPS //

    // Controls how long the player remains in place when jumping into a wall
    static totalWallStickFrames = 10;
    static activeWallStickFrames = 0;

    static hasTriggeredWallStick = false;

    static pushawaySpeed = Move.speed * 1.5;

    static totalWalljumpFrames = 5;
    static activeWalljumpFrames = 0;

    static totalWalljumpBufferFrames = 8;
    static activeWalljumpBufferFrames = 0;


    // GRAVITY VARIABLES //

    static maxGravity = 15;
    static gravityMod = 0.5;

    // DIRECTION ENUM //

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
        this.outOfBounds = false;
    }

    update() {

        let aliveState = true;

        this.handleInput();

        this.applyGravity();

        this.handleWalljumps();

        this.moveX();

        this.moveY();

        this.handleCoyoteFrames();

        aliveState = this.checkTouchesHazard();

        try {
            this.collidesWithToken(this.posX, this.posY);
        } catch {
            this.outOfBounds = true;
        }
        

        if (this.outOfBounds) {
            aliveState = false;
        }

        return {
            pos: new Vector(this.posX, this.posY),
            vel: new Vector(this.velX, this.velY),
            collisions: this.collisions,
            aliveState: aliveState
        }
    }

    handleCoyoteFrames() {
        let currentCollision;

        try {
            currentCollision = this.collidesWithGround(this.posX, this.posY);
        } catch (e) {
            this.outOfBounds = true;
        }
        

        if (Move.activeCoyoteFrames > 0) {
            Move.activeCoyoteFrames -= 1;
        }
        
        if (Move.previousDownCollision && !currentCollision && !this.keys['z']) {
            Move.activeCoyoteFrames = Move.totalCoyoteFrames;
        }

        Move.previousDownCollision = currentCollision;
    }

    handleInput() {

        if (Move.activeWalljumpFrames > 0) {
            Move.activeWalljumpFrames--;
        } else {
            this.velX = 0;

            if (this.keys['ArrowLeft']) {
                this.velX = -Move.speed;
                this.player.direction = Move.playerDirection.LEFT;
            }

            if (this.keys['ArrowRight']) {
                this.velX = Move.speed;
                this.player.direction = Move.playerDirection.RIGHT;
            }

            if (this.keys['z']) {

                ///////////////
                // WALLJUMPS //
                ///////////////

                if (Move.hasTriggeredWallStick && 
                    Move.zKeyRelease) {
                    this.velY = -Move.initialJumpSpeed;

                    if (this.collisions.left) {
                        this.velX = Move.pushawaySpeed;
                    }

                    if (this.collisions.right) {
                        this.velX = -Move.pushawaySpeed;
                    }

                        
                    Move.activeWallStickFrames = 0;
                    Move.hasTriggeredWallStick = false;

                    Move.activeWalljumpFrames = Move.totalWalljumpFrames;
                }

                ////////////////////
                // STANDARD JUMPS //
                ////////////////////zz

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

    handleWalljumps() {

        if (this.jumpCollidesWithWall() && 
        !Move.hasTriggeredWallStick &&
        Move.activeWalljumpFrames <= 0) {
            Move.hasTriggeredWallStick = true;
            Move.activeWalljumpBufferFrames = Move.totalWalljumpBufferFrames;
            Move.activeWallStickFrames = Move.totalWallStickFrames;
        } else if (!this.jumpCollidesWithWall() && Move.activeWalljumpBufferFrames <= 0) {
            Move.hasTriggeredWallStick = false;
        } else if (!this.jumpCollidesWithWall() && Move.activeWalljumpBufferFrames > 0) {
            Move.activeWalljumpBufferFrames--;
        }

        if (Move.activeWallStickFrames > 0) {
            this.velY = 0;
            Move.activeWallStickFrames--;
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

        try {
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
        } catch (e) {
            this.outOfBounds = true;
        }
        
    }

    moveY() {
        let previousY = this.posY;

        let potentialY = this.posY + this.velY * this.time;

        try {
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
        } catch (e) {
            this.outOfBounds = true;
        }
    }

    checkTouchesHazard() {
        try {
            return this.collidesWithHazard(this.posX, this.posY);
        } catch (e) {
            this.outOfBounds = true;
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

        try {
            return !(
                this.level.isClearAt(left, top) &&
                this.level.isClearAt(right, top) &&
                this.level.isClearAt(left, mid) &&
                this.level.isClearAt(right, mid) &&
                this.level.isClearAt(left, bottom) &&
                this.level.isClearAt(right, bottom)
            );
        } catch (e) {
            throw (e);
        }
    }

    collidesWithGround(x, y) {

        const xOffset = 0.1;
        const yOffset = 0.05;
        
        const left = x + xOffset;
        const right = x + this.player.width - xOffset;
        const bottom = y + this.player.height + yOffset;

        try {
            return !(
                this.level.isClearAt(left, bottom) && 
                this.level.isClearAt(right, bottom)
            )
        } catch (e) {
            throw (e);
        }
    }

    jumpCollidesWithWall() {
        return (
            !this.collisions.down && 
            (
                this.collisions.left ||
                this.collisions.right
            )
        )
    }

    collidesWithHazard(x, y) {

        const inset = 0.001;
        const xOffset = 0.1;
        const yOffset = 0.05;
        const shrinkOffset = 0.1;

        const left = (x + inset + xOffset) + shrinkOffset;
        const right = (x + this.player.width - inset - xOffset) - shrinkOffset;
        const top = (y + inset + yOffset) + shrinkOffset;
        const bottom = (y + this.player.height - inset) - shrinkOffset;
        const mid = y + (this.player.height / 2);

        try {
            return !(
                this.level.isHazardAt(left, top) ||
                this.level.isHazardAt(right, top) ||
                this.level.isHazardAt(left, mid) ||
                this.level.isHazardAt(right, mid) ||
                this.level.isHazardAt(left, bottom) ||
                this.level.isHazardAt(right, bottom)
            );
        } catch (e) {
            throw (e);
        }
    }

    collidesWithToken(x, y) {
        const inset = 0.001;
        const xOffset = 0.1;
        const yOffset = 0.05;

        const left = x + inset + xOffset;
        const right = x + this.player.width - inset - xOffset;
        const top = y + inset + yOffset;
        const bottom = y + this.player.height - inset;
        const mid = y + (this.player.height / 2);

        try {
            return !(
                this.level.isTokenAt(left, top) ||
                this.level.isTokenAt(right, top) ||
                this.level.isTokenAt(left, mid) ||
                this.level.isTokenAt(right, mid) ||
                this.level.isTokenAt(left, bottom) ||
                this.level.isTokenAt(right, bottom)
            );
        } catch (e) {
            throw (e);
        }
    }
}