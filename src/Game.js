/**
 * Created by ANDREW on 21/03/14.
 */

/** Creates the Game Object, which is essentially used as a state class within Phaser
 * This ones job is to run the main game, instantiate all objects related to the main game
 * and control the game flow.
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.Game = function (game) {
     this.player = null;
};

GameState.Game.prototype = {

    /**Initializes all of the variables and objects required for this state
     * @private
     * @function */
    create: function () {
        //posX, posY, scaleX, scaleY, gravity, drag, playerSprite, phaser game object
        this.player = new RunnerPC(0.0, 0.0, 2.0, 2.0, 50.0, 0.0, 'player', game);

        this.boostButton = this.add.button(70, 565, 'boostButton', this.player.boost, this.player, 0, 0, 0, 0);
        this.boostButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.boostButton.scale.x = 1.5;
        this.boostButton.scale.y = 1.5;

        this.invertButton = this.add.button(730, 565, 'invertGravityButton', this.player.invertGravity, this.player, 0, 0, 0, 0);
        this.invertButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.invertButton.scale.x = 1.5;
        this.invertButton.scale.y = 1.5;

        this.scoreText = game.add.text(400, 575, 'Score ' + this.player.getScore(), { font: '24px Impact', fill: '#f00' });
        this.scoreText.anchor.set(0.5, 0.5);
    },

    /**Runs the update code for the Game class, input, score incrementation, player movement etc.
     * @private
     * @function */
    update: function () {

        this.player.update();

        this.scoreText.text = 'Score ' + this.player.getScore();

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.player.updateVelocity(-50, 0);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.player.updateVelocity(50, 0);
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.player.invertGravity();
        }
    }

};