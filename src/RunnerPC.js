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
 * @param {number} drag - amount of opposing force applied to the RunnerPC whenever it moves
 * @param {string} sprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {game} game - phaser game object to allow access to game specific functions
 * @constructor
 * */
 function RunnerPC(posX, posY, scaleX, scaleY, rot, gravity, animatedSprite, spriteFps, game){
    this.game = game;
    this.character = this.game.add.sprite(posX, posY, animatedSprite);
    this.character.animations.add('run');
    this.character.animations.play('run', spriteFps, true);
    this.character.scale.x = scaleX;
    this.character.scale.y = scaleY;
    this.character.angle = rot;
    this.character.anchor.set(0.5);

    // adding physics to our object and then turning its interaction with our character off
    // this allows us to continue to use the Phaser collision system but ignore the
    // physics behind it
    this.game.physics.enable(this.character, Phaser.Physics.ARCADE);
    this.character.body.moves = false;
    this.character.body.collideWorldBounds = true;
    this.boostVelocityX = 500;
    this.runVelocityX = 100;
    this.velocityX = this.runVelocityX;
    this.velocityY = 10;
    this.game.camera.follow(this.character, this.game.camera.FOLLOW_PLATFORMER);


    // inversion timer mostly just to create a lag before you can press
    // so it doesn't double activate and cancel itself out
    this.inversionTimer = 0;
    this.inversionCooldown = 500;
    this.score = 0;
    this.onFloor = false;

    // relevant to create a cooldown interval between boost presses, this one is
    // a gameplay mechanic
    this.boostCooldownTimer = 0;
    this.boostCooldown = 2000;
    this.boostActivationTimer = 0;
    this.boostActivationPeriod = 2000;
    this.boostActive = false;
}

/**
 * function for changing the players position
 * @public
 * @function
 * @param {number} posX - value to replace the current x position with
 * @param {number} posY - value to replace the current y position with
 */
RunnerPC.prototype.updatePosition = function(posX, posY){
   this.character.position.x = posX;
   this.character.position.y = posY;
};

/**
 * returns this RunnerPC's score
 * @public
 * @function
 * @returns {number}
 */
RunnerPC.prototype.getScore = function(){
    return Math.round(this.score);
};
/**
 * @public
 * @function
 * @param {number} score - a number to set the current score value to
 * */
RunnerPC.prototype.updateScore = function(score){
      this.score = score;
};

/**
 * @public
 * @function
 * @param {boolean} isOnFloor - simple boolean that changes the onFloor variable which
 * dictates if a character is on the ground or not and thus able to invert the gravity
 */
RunnerPC.prototype.updateOnFloor = function(isOnFloor){
    this.onFloor = isOnFloor;
};

/**
 * This function can be called seperately anywhere you wish, however it's mainly for use in conjunction with the Phaser
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
 * Function that reset all the players variables to default
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
    this.character.position.y = 434;
}

/**
 * function for changing the players velocity
 * @public
 * @function
 * @param {number} vX - value to replace the current x velocity with
 */
RunnerPC.prototype.updateVelocityX = function(vX){
  this.velocityX = vX;
};

/**
 * returns velocity x
 * @public
 * @function
 * @returns {b.Physics.Arcade.Body.velocity.x|*}
 */
RunnerPC.prototype.getVelocityX = function(){
    return this.velocityX;
};

/**
 * update function that keeps track of relevant timing for the RunnerPC
 * and various other update logic for the RunnerPC to function
 * @public
 * @function */
RunnerPC.prototype.update = function(){

    if(this.onFloor == false)
       this.character.position.y += this.velocityY;

    var elapsedTime = this.game.time.elapsed;

    this.inversionTimer += elapsedTime;

    // calculating the distance travelled by the character using velocity and acceleration and using it as the score
    this.score += this.velocityX * (1/1000 * elapsedTime);


    if(this.boostActive == false)
        this.boostCooldownTimer += elapsedTime;
    else
        this.boostActivationTimer += elapsedTime;

    if(this.boostActive == true && this.boostActivationTimer < this.boostActivationPeriod){
        this.velocityX = this.boostVelocityX;
    }else{
        this.boostActive = false;
        this.boostActivationTimer = 0;
        this.velocityX = this.runVelocityX;
    }

};