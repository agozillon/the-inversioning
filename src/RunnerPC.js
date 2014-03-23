/**
 * Created by ANDREW on 22/03/14.
 */

/**
 * RunnerPC is an object intended to be the players character(PC)
 * @constructor
 * @param {number} posX - position of RunnerPC the x plane
 * @param {number} posY - position of RunnerPC on the y plane, positive is down
 * @param {number} scaleX - width scale of RunnerPC sprite
 * @param {number} scaleY - height scale of RunnerPC sprite
 * @param {number} gravity - amount of downward force applied to the RunnerPC
 * @param {number} drag - amount of opposing force applied to the RunnerPC whenever it moves
 * @param {string} playerSprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {phaser game} game - phaser game object to allow access to game specific functions
 * */
 function RunnerPC(posX, posY, scaleX, scaleY, gravity, drag, playerSprite, game){
    this.game = game;
    this.character = this.game.add.sprite(posX, posY, playerSprite);
    this.character.scale.x = scaleX;
    this.character.scale.y = scaleY;
    this.character.anchor.set(0.5);
    this.game.physics.enable(this.character, Phaser.Physics.ARCADE);
    this.character.body.drag.set(drag);
    this.character.body.velocity.x = 50;
    this.character.body.gravity.y = gravity;
    this.character.body.collideWorldBounds = true;

    // inversion timer mostly just to create a lag before you can press
    // so it doesn't double activate and cancel itself out
    this.inversionTimer = 0;
    this.inversionCooldown = 500;
    this.score = 0;
    // relevant to create a cooldown interval between boost presses, this one is
    // a gameplay mechanic
    this.boostCooldownTimer = 0;
    this.boostCooldown = 2000;
    this.boostActivationTimer = 0;
    this.boostActivationPeriod = 2000;
    this.boostActive = false;
}

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
 * @param {number} gravity - a number dictating the amount of gravity you wish to replace the
 * current gravity with
 */
RunnerPC.prototype.updateGravity = function(gravity){
    this.character.body.gravity.y = gravity;
};

/**
 * Function that inverts the gravity affecting the RunnerPC
 * @public
 * @function
 */
RunnerPC.prototype.invertGravity = function(){
    if(this.inversionTimer > this.inversionCooldown){
        this.character.body.gravity.y = -this.character.body.gravity.y;
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
 * function for changing the players velocity
 * @public
 * @function
 * @param {number} velocityX - value to replace the current x velocity with
 * @param {number} velocityY - value to replace the current y velocity with
 */
RunnerPC.prototype.updateVelocity = function(velocityX, velocityY){
  this.character.body.velocity.x = velocityX;
  this.character.body.velocity.y = velocityY;
};

/**
 * returns velocity x
 * @public
 * @function
 * @returns {b.Physics.Arcade.Body.velocity.x|*}
 */
RunnerPC.prototype.getVelocityX = function(){
    return this.character.body.getVelocityX();
};

/**
 * returns velocity y
 * @public
 * @function
 * @returns {b.Physics.Arcade.Body.velocity.y|*}
 */
RunnerPC.prototype.getVelocityY = function(){
    return this.character.body.getVelocityY();
};

/**
 * basic function for changing the players acceleration
 * @public
 * @function
 * @param {number} accelerationX - value to replace the current x acceleration with
 * @param {number} accelerationY - value to replace the current y acceleration with
 */
RunnerPC.prototype.updateAcceleration = function(accelerationX, accelerationY){
    this.character.body.acceleration.x = accelerationX;
    this.character.body.acceleration.y = accelerationY;
};

/**
 * returns acceleration x
 * @public
 * @function
 * @returns {b.Physics.Arcade.Body.acceleration.x|*}
 */
RunnerPC.prototype.getAccelerationX = function(){
    return this.character.body.getAccelerationX()
};

/**
 * returns acceleration y
 * @public
 * @function
 * @returns {b.Physics.Arcade.Body.acceleration.y|*}
 */
RunnerPC.prototype.getAccelerationY = function(){
    return this.character.body.getAccelerationY();
};

/**
 * update function that keeps track of relevant timing for the RunnerPC
 * and various other update logic for the RunnerPC to function
 * @public
 * @function */
RunnerPC.prototype.update = function(){
    var elapsedTime = this.game.time.elapsed;

    this.inversionTimer += elapsedTime;

    // calculating the distance travelled by the character using velocity and acceleration and using it as the score
    this.score += this.character.body.velocity.x * (1/1000 * elapsedTime) + 1/2 * this.character.body.acceleration.x * ((1/1000 * elapsedTime) * (1/1000 * elapsedTime));

    if(this.boostActive == false)
        this.boostCooldownTimer += elapsedTime;
    else
        this.boostActivationTimer += elapsedTime;

    if(this.boostActive == true && this.boostActivationTimer < this.boostActivationPeriod){
        this.character.body.velocity.x = 300;
        this.character.body.velocity.y = 0;
    }else{
        this.boostActive = false;
        this.boostActivationTimer = 0;
        this.character.body.velocity.x = 50;
    }

};