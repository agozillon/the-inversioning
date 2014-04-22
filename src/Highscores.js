/**
 * Created by ANDREW on 22/04/14.
 */
/** Creates the Highscores Object, which is essentially used as a state class within Phaser
 * It's job is to display the Highscore Screen that displays all the highscores.
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.Highscores = function (game) {

};

GameState.Highscores.prototype = {

    /**
     * Initializes all things required for the Highscores screen and table, Phaser takes care of it's own
     * renders and Phaser specific object updates.
     *
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

        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 50.0,'character', 48, game);
        this.player.updateVelocityX(0);
        this.player.updateGravity(0);

        this.highscoreBackground = this.game.add.tileSprite(game.world.width/2, game.world.height/2 - 75, 300, 400, 'blankBackground');
        this.highscoreBackground.anchor.set(0.5, 0.5);

        this.highscoreTitleText = game.add.text((game.world.width / 2), (game.world.height / 2) - 260, 'Highscore', { font: '24px Impact', fill: '#aaa' });
        this.highscoreTitleText.anchor.set(0.5, 0.5);

        this.backButton = this.add.button(400, 475, 'backButtonSpriteSheet', this.enterMainMenu, this, 1, 0, 0, 0);
        this.backButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.highscoreTable = new HighscoreTable(game);
    },

    /**
     * A simple switch state function created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterMainMenu: function() {
        this.game.state.start('Menu');
    }
}