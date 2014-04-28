/**
 * Created by ANDREW on 21/03/14.
 */

/** Creates the MainMenu Object, which is essentially used as a state class within Phaser
 * It's job is to display the Main Menu and act as an intermediary state between all other game states
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.MainMenu = function (game) {

 //   this.music = null;
  //  this.playButton = null;

};

GameState.MainMenu.prototype = {

    /**
     * Initializes all things required for the main menu, I.E the buttons and audio.
     * @private
     * @function
     */
    create: function () {

       // this.music = this.add.audio('titleMusic');
       //this.music.play();

        this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height,'background');
        this.background.tilePosition.x = GameState.backgroundScrollX;

        // World Object creation, has to be done each time in phaser, unfortunately can't pass objects
        // between states
        this.obstacles = this.game.add.group();
        for(i = 0; i < GameState.obstaclePosAndRot.length; i++)
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', this.game, this.obstacles, true);


        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0,'platformMetal', this.game, this.randomPlatforms, false);


        this.floorAndRoof = this.game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0,'platform', this.game, this.floorAndRoof, true);

        this.randomWalls = this.game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', this.game, this.randomWalls, false);

        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 50.0,'character', 48, game);


        // menu buttons
        this.playButton = this.add.button(this.game.world.centerX - 60, this.game.world.centerY, 'playButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
        this.playButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.tutorialButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 60, 'tutorialButtonSpriteSheet', this.enterTutorialState, this, 1, 0, 0, 0);
        this.tutorialButton.anchor.setTo(0.5, 0.5);

        this.highscoresButton = this.add.button(this.game.world.centerX + 60, this.game.world.centerY, 'highscoresButtonSpriteSheet', this.enterHighscoresState, this, 1, 0, 0, 0);
        this.highscoresButton.anchor.setTo(0.5, 0.5);


    },

    /**
     * Updates all of the things required for the Main Menu.
     * @private
     * @function
     */
    update: function () {
    },

    /**
     * A simple switch state function created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterPlayState: function() {
        this.game.state.start('Game');
    },

    enterTutorialState: function() {
        this.game.state.start('Tutorial');
    },

    enterHighscoresState: function() {
        this.game.state.start('Highscores');
    }
};