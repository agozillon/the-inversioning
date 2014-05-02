/**
 * Created by ANDREW on 22/04/14.
 */
/**
 * Creates the Highscore Table Object, which is a table that holds the top 10 scores in the game, renders them on screen as
 * Phaser Text objects, has a function to pull them from an online databases and push them to an online database
 *@constructor
 *@param {Phaser.Game} game a link to an instantiated Phaser Game Object
 *  */
function HighscoreTable(game){
    this.scores = ['', '', '', '', '', '', '', '', '', ''];
    this.names = ['','', '', '', '', '', '', '', '', ''];
    this.highscoreListText = [];
    this.game = game;
    this.createText(); // early call of createText to set the texts fonts otherwise we can get the occasional error when entering the score
    // also the reason that if the init fails the highscore displays blank!
}

/**
 * Function that adds a score to the table which consists of two separate arrays
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

    // bubble sort into order
    for(var i = 1; i < this.scores.length; i++)
        for(var i2 = 0; i2 < this.scores.length-1; i2++){
            if(this.scores[i] >= this.scores[i2]){
                var tmp = this.names[i2];
                this.names[i2] = this.names[i];
                this.names[i] = tmp;

                tmp = this.scores[i2];
                this.scores[i2] = this.scores[i];
                this.scores[i] = tmp;
            }
        }

    // sends the highscores to the online database
    for(i = 0; i < this.highscoreListText.length; i++)
        if(this.scores[i])
            this.postHighscore(i);
};

/**
 * Function that pulls all of the highscore data from the google app engine server.
 * There can be up to 10 unique values stored at a time (1 for each position)
 * @public
 * @function
 */
HighscoreTable.prototype.getHighscoreTable = function(){
    "use strict";

    var tmpSelfRef = this; // temp reference to highscore so we can access it within

    // basic Ajax server call to the google app server, it should be up at all times if you have
    // any problems please contact b00234203@studentmail.uws.ac.uk
    $.ajax({
        type: "GET",
        url: "https://aghighscore.appspot.com",
        async: true,
        contentType: "application/json",
        dataType: "jsonp",
        success: function(resp){
            var i, tmpPos;
            for(i = 0; i < resp.length; i++){ // adds them into the table on successful call to the database
                tmpPos = parseInt(resp[i].position, 10);
                tmpSelfRef.scores[tmpPos] = parseInt(resp[i].score, 10);
                tmpSelfRef.names[tmpPos] = resp[i].playerName;
            }
        }
    });
};

/**
 * Function that uses Ajax to send a highscore value to the Google app engine server
 * @param {number} pos - number that defines the position of the highscore in the table it'll be used as a unique key by the server
 * replacing any previous highscore with that key
 * @public
 * @function
 */
HighscoreTable.prototype.postHighscore = function(pos){
    "use strict";

    // name key - position in the highscore table, score - player score, player name - player name
    var url = "https://aghighscore.appspot.com" + "/loc?name=" + pos + "&score=" + this.scores[pos] + "&playerName=" + this.names[pos];
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        contentType: "application/json",
        dataType: "jsonp"
    })
};

/**
 * Function that returns true if the score is a highscore or false if its not a highscore on the table
 * @param {number} score - number that denotes the players score that we're checking against the table
 * @public
 * @function
 * @return {boolean}
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

/**
 * Function that creates all of the Highscore text as Phaser text objects capable of being rendered to screen
 * it also positions them appropriately on the screen for them to be positioned as a highscore table, all phaser objects get deleted
 * on state switch
 * @public
 * @function
 */
HighscoreTable.prototype.createText = function(){
    for(var i = 0; i < 10; i++){

        this.highscoreListText[i] = this.game.add.text(this.game.world.width / 2 - 150, 100 + (i*35), (i+1) + ".  " + this.names[i] + " " + this.scores[i], { font: '24px Impact', fill: '#f00' } );
        this.highscoreListText[i].anchor.set(0.0, 0.5);
    }
};
