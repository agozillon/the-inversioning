/**
 * Created by ANDREW on 21/03/14.
 */
/**
 * Created by ANDREW on 21/03/14. This is a slight variant of the Phaser Mobile Template Boot State
 */

/** Creates the Init Object, which is essentially used as a state class within Phaser
 * It's job is to setup the games window, other states and load in the assets
 *@constructor
 **/
GameState.Init = function() {
    game.state.add('Menu', GameState.MainMenu);
    game.state.add('Game', GameState.Game);
    game.state.add('Tutorial', GameState.Tutorial);
    game.state.add('Highscores', GameState.Highscores);
};


GameState.Init.prototype = {

    /** Function for pre-loading all of the assets relevant to the rest of the game such as images and music
     * @private
     * @function */
    preload: function(){
        game.load.audio('soundtrack', 'src/audio/Cut and Run.ogg' );
        game.load.image('boostButton', 'src/images/boostButton.png');
        game.load.image('tombstone', 'src/images/tombstone.png');
        game.load.image('invertGravityButton', 'src/images/invertGravityButton.png');
        game.load.image('tutorialDisplay', 'src/images/tutorial.png');
        game.load.image('platform', 'src/images/platform.png');
        game.load.image('platformMetal', 'src/images/platformMetal.png');
        game.load.image('background', 'src/images/Background.jpg');
        game.load.image('spikes', 'src/images/spikes.png');
        game.load.image('blankBackground', 'src/images/blankBackground.png');
        game.load.image('enterScoreButton', 'src/images/enterHighscore.png');
        game.load.image('backToMenuButton', 'src/images/backToMenu.png');
        game.load.image('doneButton', 'src/images/doneButton.png');
        game.load.image('replayButton', 'src/images/replay.png');
        game.load.image('wall', 'src/images/wall.png');
        game.load.spritesheet('playButtonSpriteSheet', 'src/images/playButtonSpriteSheet.png', 100, 50, 2);
        game.load.spritesheet('tutorialButtonSpriteSheet', 'src/images/tutorialButtonSpriteSheet.png', 100, 50, 2);
        game.load.spritesheet('highscoresButtonSpriteSheet', 'src/images/highscoresButtonSpriteSheet.png', 100, 50, 2);
        game.load.spritesheet('backButtonSpriteSheet','src/images/backButtonSpriteSheet.png', 100, 50, 2);
        game.load.spritesheet('character', 'src/images/bluesprite.png', 35, 60, 24);
 },

    /** Function for the Init state used to setup the games window and position the games
     * objects within the world (as we can see them in all state transitions)
     * @private
     * @function */
    create: function(){
        game.input.maxPointers = 2; // create two pointers for our phaser game so users can use two fingers
        game.input.addPointer();
        game.input.addPointer();

        // below code is the same setup code as inside the Phaser Mobile Game Template
        // changes the screen size etc based on the device its being played on
        if (game.device.desktop)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.minWidth = 480;
            game.scale.minHeight = 260;
            game.scale.maxWidth = 1024;
            game.scale.maxHeight = 768;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.setScreenSize(true);
        }
        else
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.minWidth = 480;
            game.scale.minHeight = 260;
            game.scale.maxWidth = 1024;
            game.scale.maxHeight = 768;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.forceOrientation(true, false);
            game.scale.setScreenSize(true);
            game.scale.refresh();
        }

        // Instantiates the GameWorldManager which randomizes all the World Objects positions
        GameState.gameWorld = new GameWorldManager(game, 800, 128, 16, 32, 160, 4, 1, 9, 3, 24, 8);

        GameState.backgroundScrollX = 0;

        GameState.playerVariables = [];
        GameState.playerVariables[0] = 450; // x position
        GameState.playerVariables[1] = 434; // y position
        GameState.playerVariables[2] = 1;   // scale
        GameState.playerVariables[3] = 0;   // rotation
        GameState.playerVariables[4] = 1;   // isAlive

        // instantiate the HighscoreTable and pull the highscores from the servers database
        GameState.highscoreTable = new HighscoreTable(game);
        GameState.highscoreTable.getHighscoreTable();


         // the relevant windows created and all preloads have started, switch to menu
        game.state.start('Menu');
    }
};

