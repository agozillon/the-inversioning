/**
 * Created by ANDREW on 22/04/14.
 */
/** Creates the Highscores Object, which is essentially used as a state class within Phaser
 * It's job is to display the Highscore Screen that displays all the highscores.
 *@constructor
*/
GameState.Highscores = function () {
    this.background = null;
    this.obstacles = null;
    this.randomPlatforms = null;
    this.floorAndRoof = null;
    this.randomWalls = null;
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
        this.obstacles = game.add.group();
        for(i = 0; i < GameState.obstaclePosAndRot.length; i++)
        {
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', game, this.obstacles, true);
        }

        this.randomPlatforms = game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
        {
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', game, this.randomPlatforms, false);
        }

        this.floorAndRoof = game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0,'platform', game, this.floorAndRoof, true);

        this.randomWalls = game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', game, this.randomWalls, false);

        // create the player a RunnerPC object
        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 10.0, 100.0, 500.0,'character', 48, game);

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