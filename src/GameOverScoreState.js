/**
 * Created by ANDREW on 22/04/14.
 */

/**
 * Instantiates the GameOverScoreState which is a GameOver state that allows the player to enter their highscore,
 * the constructor just instantiates a bunch of null variables for later use.
 *@constructor
 */
function GameOverScoreState(){
    this.highscore = null;
    this.gameoverBackground = null;
    this.congratulationsText = null;
    this.scoreDisplayText = null;
    this.doneButton = null;
}

/**
 * Function that creates all the various Phaser objects we need for this state, text display, background and buttons
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can create objects and use it to state change
 * @param {GameOverStateManager} gameOverControl - a link to the GameOverStateManager not used in this state but used in others for switching the GameOver state
 * @param {Game} playGameState - a link to the current game session our own Game object not phasers, used to access the players score in this case
 * @public
 * @function
 * */
GameOverScoreState.prototype.create = function(game, gameOverControl, playGameState){

    // create background
    this.gameoverBackground = game.add.tileSprite(game.world.width/2, game.world.height/2, 400, 300,'blankBackground');
    this.gameoverBackground.anchor.set(0.5,0.5);

    // create the congratulations text
    this.congratulationsText = game.add.text((game.world.width / 2), (game.world.height / 2) - 100, 'Congratulations \n on your highscore!', { font: '24px Impact', fill: '#f00' });
    this.congratulationsText.align = 'center';
    this.congratulationsText.anchor.set(0.5, 0.5);

    // create the score display text and give it the current players score
    this.scoreDisplayText = game.add.text((game.world.width / 2), (game.world.height / 2) - 20, 'Score: ' + playGameState.player.getScore(), { font: '24px Impact', fill: '#f00' });
    this.scoreDisplayText.anchor.set(0.5, 0.5);

    // check the Highscore entry class
    this.highscore = new HighscoreEntry(game, (game.world.width / 2), (game.world.height / 2) + 40);
    this.highscore.updateVisibility(true);
    this.highscore.updateScore(playGameState.player.getScore());

    // the only rather hacky javascript way of getting around nested function "this" issues
    var temp = this;
    // create the done button which when pressed calls a function that adds the highscore to the table, calls the setPositions function and switches the state to the Main Menu!
    this.doneButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 100,'doneButton');
    this.doneButton.inputEnabled = true;
    this.doneButton.events.onInputDown.add(function(){GameState.highscoreTable.add(temp.highscore.getName(), temp.highscore.getScore(), 9); playGameState.setPositions(); game.state.start('Menu')}, game);
    this.doneButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.doneButton.scale.x = 0.75;
    this.doneButton.scale.y = 0.5;


};

/**
 * Function that destroys all the various phaser objects I use in this state, normally aren't required to do this as Phaser
 * automatically does it with its own state switches, however I need to do it for my own state system so the buttons etc don't
 * continue to display.
 * @public
 * @function
 * */
GameOverScoreState.prototype.exit = function(){
    this.doneButton.destroy();
    this.gameoverBackground.destroy();
    this.scoreDisplayText.destroy();
    this.congratulationsText.destroy();
    this.highscore.destroy();
};

/**
 * Function that handles all the update logic of the GameOverScoreState, essentially just checks if the top, bottom, left or right
 * screen have been pressed and changes the highscore name appropriately, phaser buttons handle there own events
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can check for pointer input (mouse, touch etc)
 * @public
 * @function
 * */
GameOverScoreState.prototype.update = function(game){
    // if the currently active pointer (last touched or currently touched) is down
    // then we check what point on the screen its at (can use worldX as these will never change in our game)
    // and update the highscore appropriately
    if(game.input.activePointer.isDown){
        if(game.input.activePointer.worldX > 550)
            this.highscore.incrementIndex();

        if(game.input.activePointer.worldX < 350)
            this.highscore.decrementIndex();

        if(game.input.activePointer.worldY > 400)
            this.highscore.decrementChar();

        if(game.input.activePointer.worldY < 200)
            this.highscore.incrementChar();

    }

    // update the Highscore object so that the on screen text gets updated with the character changes
    this.highscore.update();
};