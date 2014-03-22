/**
 * Created by ANDREW on 21/03/14.
 */
GameState.MainMenu = function (game) {

 //   this.music = null;
  //  this.playButton = null;

};

GameState.MainMenu.prototype = {

    create: function () {

       // this.music = this.add.audio('titleMusic');
       //this.music.play();


        this.playButton = this.add.button(this.game.world.centerX - 60, this.game.world.centerY, 'playButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
        this.playButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.tutorialButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 60, 'tutorialButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
        this.tutorialButton.anchor.setTo(0.5, 0.5);

        this.highscoresButton = this.add.button(this.game.world.centerX + 60, this.game.world.centerY, 'highscoresButtonSpriteSheet', this.enterPlayState, this, 1, 0, 0, 0);
        this.highscoresButton.anchor.setTo(0.5, 0.5);
    },

    update: function () {



    },

    enterPlayState: function() {
        this.game.state.start('Game');
    }
};