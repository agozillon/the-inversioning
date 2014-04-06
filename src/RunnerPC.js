/**
 * Created by ANDREW on 22/03/14.
 */

/**
 * RunnerPC is an object intended to be the players character(PC)
 * @param {number} posX - position of RunnerPC the x plane
 * @param {number} posY - position of RunnerPC on the y plane, positive is down
 * @param {number} scaleX - width scale of RunnerPC sprite
 * @param {number} scaleY - height scale of RunnerPC sprite
 * @param {number} gravity - amount of downward force applied to the RunnerPC
 * @param {number} drag - amount of opposing force applied to the RunnerPC whenever it moves
 * @param {string} sprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {game} game - phaser game object to allow access to game specific functions
 * @constructor
 * */
 function RunnerPC(posX, posY, scaleX, scaleY, gravity, animatedSprite, spriteFps, game){
    this.game = game;
    this.character = this.game.add.sprite(posX, posY, animatedSprite);
    this.character.animations.add('run');
    this.character.animations.play('run', spriteFps, true);
    this.character.scale.x = scaleX;
    this.character.scale.y = scaleY;
    this.character.anchor.set(0.5);
    this.game.physics.enable(this.character, Phaser.Physics.ARCADE);
    this.velocityX = 50;
    this.character.body.gravity.y = gravity;

    this.character.body.collideWorldBounds = true;
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
 * @param {number} gravity - a number dictating the amount of gravity you wish to replace the
 * current gravity with
 */
RunnerPC.prototype.updateGravity = function(gravity){
    this.character.body.gravity.y = gravity;
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
 * Function that inverts the gravity affecting the RunnerPC
 * @public
 * @function
 */
RunnerPC.prototype.invertGravity = function(){
    if(this.inversionTimer > this.inversionCooldown && this.onFloor == true){
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
 * @param {number} vX - value to replace the current x velocity with
 * @param {number} vY - value to replace the current y velocity with
 */
RunnerPC.prototype.updateVelocity = function(vX, vY){
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
    this.score += this.velocityX * (1/1000 * elapsedTime) + 1/2 * this.character.body.acceleration.x * ((1/1000 * elapsedTime) * (1/1000 * elapsedTime));

    if(this.onFloor == true)
        this.character.body.velocity.x = this.velocityX;
    else
        this.character.body.velocity.x = 0;

    if(this.boostActive == false)
        this.boostCooldownTimer += elapsedTime;
    else
        this.boostActivationTimer += elapsedTime;

    if(this.boostActive == true && this.boostActivationTimer < this.boostActivationPeriod){
        this.velocityX = 500;
     //   this.character.body.velocity.y = 0;
    }else{
        this.boostActive = false;
        this.boostActivationTimer = 0;
        this.velocityX = 50;
    }

};