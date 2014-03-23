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
        this.backButton = this.add.button(730, 550, 'backButtonSpriteSheet', this.enterMainMenu, this, 1, 0, 0, 0);
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