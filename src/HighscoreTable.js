/**
 * Created by ANDREW on 22/04/14.
 */
/** Creates the Highscore Table Object, which is a table that holds the top 10 scores in the game
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
function HighscoreTable(game){

    //this.highscoreText = this.game.add.text(posX, posY, "Enter Your Name:\n" + " " + this.name, { font: '24px Impact', fill: '#f00' });
    //this.highscoreText.anchor.set(0.5, 0.5);
    this.scores = [100, 90, 80, 70, 60, '', '', '', '', ''];
    this.names = ['Andrew','Steve', 'Martin', 'Ryan', 'Liam', '', '', '', '', ''];
    this.highscoreListText = new Array();
    this.game = game;

    for(var i = 0; i < 10; i++){

        this.highscoreListText[i] = this.game.add.text(this.game.world.width / 2 - 150, 100 + (i*35), (i+1) + ".  " + this.names[i] + " " + this.scores[i], { font: '24px Impact', fill: '#f00' } );
        this.highscoreListText[i].anchor.set(0.0, 0.5);
    }

};

/**
 * Highsore table add function, adds a score to the table which consists of two separate arrays
 * holding a name and a score and a phaser text object
 * @param {string} name - name of the current player playing
 * @param {number} score - number that denotes the players score that's getting added to the table
 * @param {number} arrayPosition - number that denotes the Highscore table number to replace with the new addition in the list
 * @public
 * @function
 */
HighscoreTable.prototype.add = function(name, score, arrayPosition){

    this.scores[arrayPosition] = score;
    this.names[arrayPosition] = name;
    this.highscoreListText[arrayPosition].text = (arrayPosition+1) + ".  " + this.names[arrayPosition] + " " + this.scores[arrayPosition];
};

/**
 * function that returns true if the score is a highscore or false if its not a highscore on the table
 * @param {number} score - number that denotes the players score that we're checking against the table
 * @public
 * @function
 * @return {boolean} - denotes if its a highscore or not based on true for yes, and false for no
 */
HighscoreTable.prototype.isItAHighscore = function(score){

    // if the last spots open, then the lists still got a spot so the new
    // score is a highscore
    if(this.scores[this.scores.length-1] == false)
        return true;
    else if(score > this.scores[this.scores.length-1]) // is it greater than the existing last element
        return true;

    // if none of the above are true then the score is not a highscore, this is assuming
    // the list is sorted in descending order
    return false;
};
