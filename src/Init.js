/**
 * Created by ANDREW on 21/03/14.
 */
/**
 * Created by ANDREW on 21/03/14. This is a slight variant of the Phaser Mobile Template Boot State
 */

/** Creates the Init Object, which is essentially used as a state class within Phaser
 * It's job is to setup the games window and other states
 *@constructor
 *@param {Phaser Game Object} game a link to an instantiated Phaser Game Object */
GameState.Init = function(game) {
    game.state.add('Menu', GameState.MainMenu);
    game.state.add('Game', GameState.Game);
};


GameState.Init.prototype = {

    /** function for pre-loading data relevant to the rest of the game such as images and music */
    preload: function(){
        // you can actually just refer to game as this. while in a state,
        // however I wish to distinguish between them
        this.game.load.image('player', 'images/blue_run_animation_001.png');
        this.game.load.spritesheet('playButtonSpriteSheet', 'images/playButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('tutorialButtonSpriteSheet', 'images/tutorialButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('highscoresButtonSpriteSheet', 'images/highscoresButtonSpriteSheet.png', 100, 50, 2);
    },

    /** Initialization function for the Init state used to setup the games window and variables
     * relevant to the rest of the game */
    create: function(){
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        // below code is the same setup code as inside the Phaser Mobile Game Template
        if (this.game.device.desktop)
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;
            this.game.scale.maxWidth = 1024;
            this.game.scale.maxHeight = 768;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.setScreenSize(true);
        }
        else
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;
            this.game.scale.maxWidth = 1024;
            this.game.scale.maxHeight = 768;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.forceOrientation(true, false);
            //   this.game.scale.hasResized.add(this.gameResized, this);
            this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.game.scale.setScreenSize(true);
        }

        this.game.state.start('Menu');
    }
};

