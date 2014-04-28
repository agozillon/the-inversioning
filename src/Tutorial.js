/**
 * Created by ANDREW on 23/03/14.
 */
/**
 * Created by ANDREW on 21/03/14.
 */

/** Creates the Tutorial Object, which is essentially used as a state class within Phaser
 * It's job is to display the Tutorial Screen.
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.Tutorial = function (game) {

};

GameState.Tutorial.prototype = {

    /**
     * Initializes all things required for the tutorial, Phaser takes care of it's own
     * renders and Phaser specific object updates.
     * @private
     * @function
     */
    create: function () {
        this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height,'background');
        this.background.tilePosition.x = GameState.backgroundScrollX;

        // World Object creation, has to be done each time in phaser, unfortunately can't pass objects
        // between states
        this.obstacles = this.game.add.group();
        for(i = 0; i < GameState.obstaclePosAndRot.length; i++)
        {
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', this.game, this.obstacles, true);
        }

        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
        {
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', this.game, this.randomPlatforms, false);
        }

        this.floorAndRoof = this.game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0,'platform', this.game, this.floorAndRoof, true);

        this.randomWalls = this.game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', this.game, this.randomWalls, false);

        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 50.0,'character', 48, game);

        this.backButton = this.add.button(400, 550, 'backButtonSpriteSheet', this.enterMainMenu, this, 1, 0, 0, 0);
        this.backButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.tutorialImage = this.game.add.sprite(400, 300, 'tutorialDisplay');
        this.tutorialImage.anchor.set(0.5, 0.5);
    },

    /**
     * A simple switch state function created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterMainMenu: function() {
        this.game.state.start('Menu');
    }
};