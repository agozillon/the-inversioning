/**
 * Created by ANDREW on 22/04/14.
 */
/** Creates the Highscores Object, which is essentially used as a state class within Phaser
 * It's job is to display the Highscore Screen that displays all the highscores.
 *@constructor
*/
GameState.Highscores = function () {
    this.background = null;
    this.player = null;
    this.highscoreBackground = null;
    this.highscoreTitleText = null;
    this.backButton = null;
};

GameState.Highscores.prototype = {

    /**
     * Function that Initializes all things required for the Highscores screen and table, Phaser takes care of it's own
     * renders and Phaser specific its own objects updates.
     * @private
     * @function
     */
    create: function () {
        // create background and set its scroll based on the GameState held positions
        this.background = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');
        this.background.tilePosition.x = GameState.backgroundScrollX;

        // World Object creation, has to be done each time in phaser, unfortunately can't pass objects
        // between states, positions them off of the GameState held positions for each type of obstacle
        GameState.gameWorld.create(game);

        // Creating our player
        this.player = new RunnerPC(GameState.playerVariables[0], GameState.playerVariables[1], GameState.playerVariables[2], 1.0, GameState.playerVariables[3], 10.0, 100.0, 500.0,'character', 'tombstone', 48, game);
        this.player.updateAlive(GameState.playerVariables[4]);

        // highscore state related buttons, background and text
        this.highscoreBackground = game.add.tileSprite(game.world.width/2, game.world.height/2 - 75, 300, 400, 'blankBackground');
        this.highscoreBackground.anchor.set(0.5, 0.5);

        this.highscoreTitleText = game.add.text((game.world.width / 2), (game.world.height / 2) - 260, 'Highscore', { font: '24px Impact', fill: '#aaa' });
        this.highscoreTitleText.anchor.set(0.5, 0.5);

        this.backButton = this.add.button(400, 475, 'backButtonSpriteSheet', this.enterMainMenu, this, 1, 0, 0, 0);
        this.backButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point


        // create the highscore tables text!
        GameState.highscoreTable.createText();

    },

    /**
     * Function created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterMainMenu: function() {
        game.state.start('Menu');
    }
};