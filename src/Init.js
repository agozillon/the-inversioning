/**
 * Created by ANDREW on 21/03/14.
 */
/**
 * Created by ANDREW on 21/03/14. This is a slight variant of the Phaser Mobile Template Boot State
 */

/** Creates the Init Object, which is essentially used as a state class within Phaser
 * It's job is to setup the games window and other states
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.Init = function(game) {
    game.state.add('Menu', GameState.MainMenu);
    game.state.add('Game', GameState.Game);
    game.state.add('Tutorial', GameState.Tutorial);
    game.state.add('Highscores', GameState.Highscores);
};


GameState.Init.prototype = {

    /** function for pre-loading data relevant to the rest of the game such as images and music
     * @private
     * @function */
    preload: function(){
        // you can actually just refer to game as this. while in a state,
        // however I wish to distinguish between them
        this.game.load.image('boostButton', 'src/images/boostButton.png');
        this.game.load.image('invertGravityButton', 'src/images/invertGravityButton.png');
        this.game.load.image('tutorialDisplay', 'src/images/tutorial.png');
        this.game.load.image('platform', 'src/images/platform.png');
        this.game.load.image('platformMetal', 'src/images/platformMetal.png');
        this.game.load.image('background', 'src/images/Background.jpg');
        this.game.load.image('spikes', 'src/images/spikes.png');
        this.game.load.image('blankBackground', 'src/images/blankBackground.png');
        this.game.load.image('enterScoreButton', 'src/images/enterHighscore.png');
        this.game.load.image('backToMenuButton', 'src/images/backToMenu.png')
        this.game.load.image('doneButton', 'src/images/doneButton.png');
        this.game.load.image('replayButton', 'src/images/replay.png')
        this.game.load.spritesheet('playButtonSpriteSheet', 'src/images/playButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('tutorialButtonSpriteSheet', 'src/images/tutorialButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('highscoresButtonSpriteSheet', 'src/images/highscoresButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('backButtonSpriteSheet','src/images/backButtonSpriteSheet.png', 100, 50, 2);
        this.game.load.spritesheet('character', 'src/images/bluesprite.png', 35, 60, 24);
 },

    /** Initialization function for the Init state used to setup the games window and variables
     * relevant to the rest of the game
     * @private
     * @function */
    create: function(){
        this.input.maxPointers = 2;
        this.game.input.addPointer();
        this.game.input.addPointer();

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
            this.game.scale.setScreenSize(true);
            this.game.scale.refresh();
        }

        // initial positioning of the world, mostly for the backgrounds sake until we start playing
        // making obstaclePositions an Array
        GameState.obstaclePosAndRot = new Array();
        var currentArrayPos = 0;
        for(i2 = 0; i2 < 2; i2++)
            for(i = 0; i < 4; i++)
            {
                var ranMax, ranMin;
                ranMin = 800 + (i * 400);
                ranMax = 800 + (i * 400) + 400;
                GameState.obstaclePosAndRot[currentArrayPos] = new Array(); // making the ith position an array as well making obstaclePositions a 2d  array
                GameState.obstaclePosAndRot[currentArrayPos][0] = this.game.rnd.integerInRange(ranMin, ranMax); // setting positions

                if(i2 == 0)
                {
                   GameState.obstaclePosAndRot[currentArrayPos][1] = 30;  // y position
                   GameState.obstaclePosAndRot[currentArrayPos][2] = 180; // rotation
                }
                else
                {
                    GameState.obstaclePosAndRot[currentArrayPos][1] = 448; // y position
                    GameState.obstaclePosAndRot[currentArrayPos][2] = 0;   // rotation
                }

                currentArrayPos++;
            }

        // same as above
        GameState.platformPositions = new Array();
        for(i = 0; i < 4; i++)
        {
            var ranMax, ranMin;
            ranMin = 800 + (i * 400);
            ranMax = 800 + (i * 400) + 400;
            GameState.platformPositions[i] = new Array();
            GameState.platformPositions[i][0] = this.game.rnd.integerInRange(ranMin, ranMax);
            GameState.platformPositions[i][1] = this.game.rnd.integerInRange(100, 440);
        }

        // positions for the floor and roof bricks based on there center point
        GameState.floorAndRoofPositions = new Array();
        currentArrayPos = 0;
        for(i2 = 1; i2 > -1; i2--)
            for(i = 1; i < 10; i++)
            {
                GameState.floorAndRoofPositions[currentArrayPos] = new Array();
                GameState.floorAndRoofPositions[currentArrayPos][0] = (i * 160)-80;
                GameState.floorAndRoofPositions[currentArrayPos][1] = i2 * 480;
                currentArrayPos++;
            }

        GameState.backgroundScrollX = 0;

        GameState.playerPosition = new Array();
        GameState.playerPosition[0] = 450; // x position
        GameState.playerPosition[1] = 434; // y position
        GameState.playerPosition[2] = 1;   // scale
        GameState.playerPosition[3] = 0;   // rotation

         // the relevant windows created and all preloads have started, switch to menu
        this.game.state.start('Menu');
    }
};

