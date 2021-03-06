/**
 * Created by ANDREW on 22/03/14.
 */

/**
 * RunnerPC is an object intended to be the players character(PC)
 * @param {number} posX - position of RunnerPC the x plane
 * @param {number} posY - position of RunnerPC on the y plane, positive is down
 * @param {number} scaleX - width scale of RunnerPC sprite
 * @param {number} scaleY - height scale of RunnerPC sprite
 * @param {number} rot - rotation of RunnerPC
 * @param {number} gravity - amount of downward force applied to the RunnerPC
 * @param {number} runSpeed - speed the character regularly moves at without boost
 * @param {number} boostSpeed - speed the character moves at when boost is pressed
 * @param {string} animatedSprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {string} deathSprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {number} spriteFps - the frames per second that the animated sprite should iterate through its animations at
 * @param {Phaser.Game} game - phaser game object to allow access to game specific functions
 * @constructor
 * */
 function RunnerPC(posX, posY, scaleX, scaleY, rot, gravity, runSpeed, boostSpeed, animatedSprite, deathSprite, spriteFps, game){
    this.game = game;

    this.character = this.game.add.sprite(posX, posY, animatedSprite);
    this.character.animations.add('run');
    this.character.animations.play('run', spriteFps, true);
    this.character.scale.x = scaleX;
    this.character.scale.y = scaleY;
    this.character.angle = rot;
    this.character.anchor.set(0.5);

    this.tombstone = this.game.add.sprite(posX, posY, deathSprite);
    this.tombstone.anchor.set(0.5);
    this.isAlive = true;

    // adding physics to our object and then turning its interaction with our character off
    // this allows us to continue to use the Phaser collision system but ignore the
    // physics behind it
    this.game.physics.enable(this.character, Phaser.Physics.ARCADE);
    this.character.body.moves = false;
    this.character.body.collideWorldBounds = true;
    this.boostVelocityX = boostSpeed;
    this.runVelocityX = runSpeed;
    this.velocityX = this.runVelocityX;
    this.velocityY = gravity;
    this.game.camera.follow(this.character, this.game.camera.FOLLOW_PLATFORMER);

    // inversion timer mostly just to create a lag before you can press
    // so it doesn't double activate and cancel itself out
    this.inversionTimer = 0;
    this.inversionCooldown = 200;
    this.score = 0;
    this.onFloor = false;

    // relevant to create a cooldown interval between boost presses, this one is
    // a gameplay mechanic
    this.boostCooldownTimer = 0;
    this.boostCooldown = 1000;
    this.boostActivationTimer = 0;
    this.boostActivationPeriod = 500;
    this.boostActive = false;
}


/**
 * Function that returns this RunnerPC's score
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getScore = function(){
    return Math.round(this.score);
};

/**
 * Function that returns this RunnerPC's x position
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getPositionX = function (){
    return this.character.position.x;
};

/**
 * Function that returns this RunnerPC's scale on the x plane
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getScaleX = function(){
    return this.character.scale.x;
};

/**
 * Function that returns this RunnerPC's rotation
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getRotation = function(){
    return this.character.angle;
};

/**
 * Function that returns this RunnerPC's y position
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getPositionY = function (){
    return this.character.position.y;
};

/**
 * Function that updates the players current score to a value you pass in
 * @public
 * @function
 * @param {number} score - a number to set the current score value to
 * */
RunnerPC.prototype.updateScore = function(score){
      this.score = score;
};

/**
 * Function that updates the players onFloor variable to the value you pass in
 * @public
 * @function
 * @param {boolean} isOnFloor - simple boolean that changes the onFloor variable which
 * dictates if a character is on the ground or not and thus able to invert the gravity
 */
RunnerPC.prototype.updateOnFloor = function(isOnFloor){
    this.onFloor = isOnFloor;
};

/**
 * Function that can be called separately anywhere you wish, however it's mainly for use in conjunction with the Phaser
 * collide function as a callback function, so that whenever a Phaser object collides with the player it calls this function.
 * Essentially all this does is seperate the two colliding objects on the Y axis so that they're still colliding (just touching)
 * but no longer half way inside each other.
 * @public
 * @function
 * @param {Phaser.sprite} player - a sprite that denotes the player character it gets removed from the collidee object
 * @param {Phaser.sprite} collidee - a sprite that denotes the obstacle the player sprite is colliding with
 * dictates if a character is on the ground or not and thus able to invert the gravity
 */
RunnerPC.prototype.separate = function(player, collidee){
    if(player.position.y < collidee.position.y && (player.position.y + player.height / 2) > ((collidee.position.y - collidee.height / 2) +1))
        player.position.y = player.position.y + (1 - ((player.position.y + player.height / 2)  - (collidee.position.y - collidee.height / 2)));
    else if(player.position.y > collidee.position.y && (player.position.y - player.height / 2) < ((collidee.position.y + collidee.height / 2)  - 1))
        player.position.y = player.position.y - (1 + ((player.position.y - player.height / 2)  - (collidee.position.y + collidee.height / 2)));
};

/**
 * Function that inverts the gravity affecting the RunnerPC
 * @public
 * @function
 */
RunnerPC.prototype.invertGravity = function(){
    if(this.inversionTimer > this.inversionCooldown && this.onFloor == true){

        this.velocityY = -this.velocityY;
        this.character.position.y += this.velocityY * 2;

        this.inversionTimer = 0;
        this.character.scale.x *= -1; // flip the sprite (no phaser flip as far as I can find anyway)
        this.character.angle -= 180; // rotate the character to the top
    }
};

/**
 * Function that sets a bool to true for activating the RunnerPC boost ability
 * @public
 * @function
 */
RunnerPC.prototype.boost = function(){
    if(this.boostCooldownTimer > this.boostCooldown){
       this.boostActive = true;
       this.boostCooldownTimer = 0;
    }
};

/**
 * Function that reset all the players variables to there default
 * @public
 * @function
 */
RunnerPC.prototype.reset = function(){
    this.boostActive = false;
    this.character.angle = 0;
    this.score = 0;
    this.velocityX = this.runVelocityX;
    this.character.scale.x = 1;
    this.boostActivationTimer = 0;
    this.inversionTimer = 0;
    this.velocityY = 10;
    this.isAlive = true;
    this.tombstone.exists = false;
    this.character.exists = true;
    this.character.position.y = 434;
};

/**
 * Function that returns the players x velocity
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getVelocityX = function(){
    return this.velocityX;
};

/**
 * Function that updates the visibility of the tombstone and character allowing a sort of
 * basic visible "Death State"
 * @param {boolean} alive - simple boolean that when set to true sets the character image to true, the tombstone image to false
 * and the isAlive boolean to the passed in value when its false it sets the tombstone to true and the character to false!
 * @public
 * @function
 */
RunnerPC.prototype.updateAlive = function(alive){
    this.isAlive = alive;
    if(this.isAlive){
        this.tombstone.exists = false;
        this.character.exists = true;
    }else{
        this.tombstone.exists = true;
        this.character.exists = false;
        this.tombstone.bringToTop(); // have to bring the tombstone to the top of the phaser render list
        // otherwise it renders below the world objects since the render order changes in phaser based off internal variables
    }
};

/**
 * Function that keeps track of relevant timing for the activation abilities of the
 * RunnerPC, increments the players score, updates the characters y position, (x never moves
 * objects move to it) and various other update logic for the RunnerPC to function
 * @public
 * @function
 * */
RunnerPC.prototype.update = function(){

    // continually apply gravity unless we're on the ground (platform, roof or floor) or
    // the player has activated boost or the player is dead!
    if(this.onFloor == false && this.boostActive == false && this.isAlive == true){
       this.character.position.y += this.velocityY;
       this.tombstone.position.y = this.character.position.y;
    }

    // get the elapsed time and add it onto the inversion timer and calculate the score
    var elapsedTime = this.game.time.elapsed;
    this.inversionTimer += elapsedTime;
    // calculating the distance travelled by the character using velocity and acceleration and using it as the score
    this.score += this.velocityX * (1/1000 * elapsedTime);


    // if boost active is false add elapsed time on to the cooldown timer, if its active add it onto
    // the activation timer
    if(this.boostActive == false)
        this.boostCooldownTimer += elapsedTime;
    else
        this.boostActivationTimer += elapsedTime;

    // if active and its been active less than the activation time period then continue to apply boost velocity to
    // the world objects else set the activation timer to 0, set it to false and use normal run velocity.
    if(this.boostActive == true && this.boostActivationTimer < this.boostActivationPeriod){
        this.velocityX = this.boostVelocityX;
    }else{
        this.boostActive = false;
        this.boostActivationTimer = 0;
        this.velocityX = this.runVelocityX;
    }

};