/**
 * Created by ANDREW on 22/04/14.
 */

/**
 * Instantiates the GameOverScreenState which is a GameOver state that allows the player replay the game,
 * go to the menu or enter there highscore if they have one.
 * @param {boolean} isHighscore - takes a boolean that tells if this GameOverScreenState is one with a highscore or not
 * this changes the way the create function works and the options the GameOverScreenState has. If its true we create the
 * You have a highscore text etc, and add the button to enter a highscore if not we don't add these things to the state
 * @constructor
 */
function GameOverScreenState(isHighscore){
    this.isAHighscore = isHighscore;
    this.gameoverBackground = null;
    this.gameOverText = null;
    this.highscoreInfoText = null;
    this.enterScoreButton = null;
    this.replayButton = null;
    this.backToMenuButton = null;
}

/**
 * Function that creates all the various Phaser objects we need for this state, text display, background and buttons
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can create objects and use it to state change
 * @param {GameOverStateManager} gameOverControl - a link to the GameOverStateManager used in this state to switch the GameOverScreen states to the GameOverScoreState
 * @param {Game} playGameState - a link to the current game session our own Game object not phasers, used to access the players score in this case
 * @public
 * @function
 * */
GameOverScreenState.prototype.create = function(game, gameOverControl, playGameState){
    this.gameoverBackground = game.add.sprite(game.world.width/2, game.world.height/2, 'blankBackground');
    this.gameoverBackground.anchor.set(0.5,0.5);
    this.gameoverBackground.scale.x = 0.5;
    this.gameoverBackground.scale.y = 0.5;

    this.gameOverText = game.add.text((game.world.width / 2), (game.world.height / 2) - 120, 'Game Over', { font: '24px Impact', fill: '#f00' });
    this.gameOverText.anchor.set(0.5, 0.5);

    this.highscoreInfoText = game.add.text((game.world.width / 2), (game.world.height / 2) - 50, '', { font: '24px Impact', fill: '#f00' });
    this.highscoreInfoText.anchor.set(0.5, 0.5);

    if(this.isAHighscore == true)
        this.highscoreInfoText.text = 'You have a highscore!';
    else
        this.highscoreInfoText.text = "Sadly you don't have a highscore";

    if(this.isAHighscore == true)
    {
        this.enterScoreButton = game.add.sprite((game.world.width / 2), (game.world.height / 2),'enterScoreButton');
        this.enterScoreButton.inputEnabled = true;
        this.enterScoreButton.events.onInputDown.add(function(){gameOverControl.stateSwitch(game,gameOverControl.getGameOverScore(),playGameState)}, gameOverControl);
        this.enterScoreButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.enterScoreButton.scale.x = 0.75;
        this.enterScoreButton.scale.y = 0.5;
    }

    this.replayButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 50,'replayButton');
    this.replayButton.inputEnabled = true;
    this.replayButton.events.onInputDown.add(function(){playGameState.reset(); this.exit()}, this);
    this.replayButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.replayButton.scale.x = 0.75;
    this.replayButton.scale.y = 0.5;

    this.backToMenuButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 100,'backToMenuButton');
    this.backToMenuButton.inputEnabled = true;
    this.backToMenuButton.events.onInputDown.add(function(){playGameState.setPositions(); game.state.start('Menu'); }, game);
    this.backToMenuButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.backToMenuButton.scale.x = 0.75;
    this.backToMenuButton.scale.y = 0.5;

};

/**
 * Function that destroys all the various phaser objects used in this state, normally aren't required to do this as Phaser
 * automatically does it with its own state switches, however I need to do it for my own state system so the buttons etc don't
 * continue to display.
 * @public
 * @function
 * */
GameOverScreenState.prototype.exit = function(){
    this.gameOverText.destroy();
    this.highscoreInfoText.destroy();
    this.gameoverBackground.destroy();
    this.backToMenuButton.destroy();
    this.replayButton.destroy();

    if(this.isAHighscore)
        this.enterScoreButton.destroy();
};

/**
 * Function that handles all the update logic of the GameOverSreenState, in this case its not used as I currently use no update logic
 * in this state, all of its handled by phaser buttons etc. The GameOverScoreState however uses it and since we transition between them
 * I have an update function for this as well! Also handy if I ever wish to add any logic in like particle effects when a player gets a highscore.
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can check for pointer input (mouse, touch etc)
 * @public
 * @function
 * */
GameOverScreenState.prototype.update = function(game){
};