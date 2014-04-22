/**
 * Created by ANDREW on 30/03/14.
 */

/**
 * This highscore object is an object that writes an empty text string to screen
 * alongside a given score and allows the player to input there name by incrementing
 * and decrementing the index value and characters of the string up to a maximum length
 * of 10
 * @param game - takes the current Phaser game as a parameter so we can have access to the games timer
 * @constructor
 */
function Highscore(game, posX, posY){
    this.game = game;
    this.name = '___________';
    this.i = 0;
    this.charVal = 65;
    this.maxLength = 10;
    this.score = 0;
    this.highscoreText = this.game.add.text(posX, posY, "Enter Your Name:\n" + " " + this.name, { font: '24px Impact', fill: '#f00' });
    this.highscoreText.anchor.set(0.5, 0.5);
    this.highscoreText.fixedToCamera = true;
    this.highscoreText.visible = false;

    this.pressCooldown = 250;
    this.pressTimer = 0;
};

/**
 * Replaces a
 * param {number} index - current place of the character editor in the string
 * param {number} newCharVal - current char code value to change the current index to
 * @function
 * @public
*/
Highscore.prototype.replaceStringAt = function(index, newCharVal){
    this.name = this.name.substr(0, index) + String.fromCharCode(newCharVal) + this.name.substr(index+1+name.length);
};

/**
 * increments the char value from 65 up to a maximum of 89
 * which increments the character from A to Z it has an
 * internal timer that stops it being called too quickly
 * @function
 * @public
 */
Highscore.prototype.incrementChar = function(){
    if(this.pressTimer > this.pressCooldown)
    {
       this.charVal++;
      // loop back around to the letter A
       if(this.charVal > 89)
          this.charVal = 65;
       this.pressTimer = 0;
    }
};

/**
 * decrements the char value from 89 down to a minimum of 65
 * which decrements the character from Z to A it has an
 * internal timer that stops it being called too quickly
 * @function
 * @public
 */
Highscore.prototype.decrementChar = function(){
    if(this.pressTimer > this.pressCooldown)
    {
       this.charVal--;
       // loop back around to the letter Z
       if(this.charVal < 65)
          this.charVal = 89;
       this.pressTimer = 0;
    }
};

/**
 * increments the strings index value from 0 up to a maximum of 10
 * which moves the current updating character of the strings name it has an
 * internal timer that stops it being called too quickly
 * @function
 * @public
 */
Highscore.prototype.incrementIndex = function(){
    if(this.pressTimer > this.pressCooldown)
    {
       this.i++;
        // set back to 0 after the max index length has been exceeded
       if(this.i > this.maxLength)
          this.i = 0;
       this.pressTimer = 0;
    }
};

/**
 * decrements the strings index value from 10 down to a minimum of 0
 * which moves the current updating character of the strings name it has an
 * internal timer that stops it being called too quickly
 * @function
 * @public
 */
Highscore.prototype.decrementIndex = function(){
    if(this.pressTimer > this.pressCooldown)
    {
       this.i--;
       // go to the max length as 0 is the minimum index of the string
       if(this.i < 0)
          this.i = this.maxLength;
       this.pressTimer = 0;
    }
};

/**
 * function that changes the Phaser text variables visibility boolean allowing it
 * to render if true and be ignored if false
 * @param {boolean} isVisible - param that changes the highscoreText's visible value
 * @function
 * @public
 */
Highscore.prototype.updateVisibility = function(isVisible){
    this.highscoreText.visible = isVisible;
};

/**
 * function that changes the score of the current highscore object and string!
 * @param {number} score - updates the score variable of the Highscore which in turns updates the highscore
 * string
 * @function
 * @public
 */
Highscore.prototype.updateScore = function(score){
    this.score = score;
};

/**
 * function that returns the name + score of the highscorer
 * @returns {string} this is the name + score of the current Highscore
 * @function
 * @public
 */
Highscore.prototype.getHighscore = function(){
    return this.name + this.score;
};

/**
 * update function for the highscore it updates the internal timer for
 * increments/decrements, replaces/renews the string (Javascript has no index access
 * as Strings are immutable) and updates the Phaser Text object to render the new string
 * @function
 * @public
 */
Highscore.prototype.update = function(){
    this.pressTimer += this.game.time.elapsed;
    this.replaceStringAt(this.i, this.charVal);
    this.highscoreText.text = "Enter Your Name:\n" + " " + this.name;
};
/*
* function to call when we wish to get rid of the highscore text, the rest gets cleaned up
* by GC
* @function
* @public
*/
Highscore.prototype.destroy = function(){
  this.highscoreText.destroy();
};