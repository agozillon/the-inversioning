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

        this.playButton = this.add.button(this.game.world.centerX - 60, this.game.world.centerY, 'playButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
        this.playButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.tutorialButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 60, 'tutorialButtonSpriteSheet', this.enterTutorialState, this, 1, 0, 0, 0);
        this.tutorialButton.anchor.setTo(0.5, 0.5);

        this.highscoresButton = this.add.button(this.game.world.centerX + 60, this.game.world.centerY, 'highscoresButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
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
    }
};