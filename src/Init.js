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

        // initial positioning of the world, mostly for the backgrounds sake until we start playing
        GameState.obstaclePosAndRot = [];
        var currentArrayPos = 0; // used as the first dimension iterator in the array below, unable to use i2 and i as there used for other things
        for(var i2 = 0; i2 < 2; i2++)
            for(var i = 0; i < 12; i++)
            {
                var ranMax, ranMin;
                ranMin = 832 + (i * 200); // 800 + 32(for width of wall and obstacle), 200 extra pixels for the 4 we can fit within the walls space
                ranMax = ranMin + 136; // 136 = 200 - 64 (the spikes are centered so to avoid overlaps we must leave a space of 16 for each spike inbetween)
                GameState.obstaclePosAndRot[currentArrayPos] = []; // making the ith position an array as well making obstaclePositions a 2d array
                GameState.obstaclePosAndRot[currentArrayPos][0] = game.rnd.integerInRange(ranMin, ranMax); // setting positions


                if(i2 == 0) // i2 = 0 is the top set of obstacles, i2 = 1 is the bottom set of obstacles
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

        // same as above except with the math explained in a bit more detail
        GameState.platformPositions = [];
        for(i = 0; i < 9; i++)
        {
            ranMin = 800 + 80 + (i * 266.67); // distance till next wall 800 / 3 platform count between walls = 266.67 pixels
            // 128 * 2(total number of spaces required to space out platforms, 1 64 set per platform 3 linked together = 256)
            // (space with - 160 taken from the start and end relating to 16 pixels from half the wall and 64 from the platforms * 2 for each wall
            // so 800 - 160 = 640) 640 - 256 = 384 the space left to randomize the objects in. And now we divide it by the number of platforms to get
            // 128! The space for each platform to randomize itself in.
            ranMax = ranMin + 128;

            GameState.platformPositions[i] = [];
            GameState.platformPositions[i][0] = game.rnd.integerInRange(ranMin, ranMax);
            GameState.platformPositions[i][1] = game.rnd.integerInRange(100, 400);
        }

        GameState.wallPositions = [];

        // we have 4 wall pieces in play at all times, 1 set of 2 walls(bit on floor and roof)
        // and 2 sets of one wall randomly placed on the roof or floor and we space them all 800 apart
        // so the whole placement of the objects is based on the idea of the space between each wall
        // being a "room"
        for(i = 0; i < 4; i++){
            GameState.wallPositions[i] = [];

            if(i < 3){
                GameState.wallPositions[i][0] = 800 + (i * 800); // set walls x position

                // randomly choose if its on the roof or floor based on a modulus remainder from
                // 1 to 1000
                if(this.game.rnd.integerInRange(1, 1000) % 2 == 0){
                    GameState.wallPositions[i][1] = 80;
                }
                else{
                    GameState.wallPositions[i][1] = 400;
                }
            }
            else{  // this chooses where we'll put our 4th wall so we have a "double wall" where we can only go through the centre
                var randPlace = (this.game.rnd.integerInRange(1, 1000) % 3);
                GameState.wallPositions[i][0] = 800 + (randPlace * 800); // position its x in one of our previous walls x areas

                // checks what the wall at the current x positions y is and
                // then sets it to the opposite of the current wall
                if(GameState.wallPositions[randPlace][1] == 400){
                    GameState.wallPositions[i][1] = 80;
                }else{
                    GameState.wallPositions[i][1] = 400;
                }
            }
        }

        // positions for the floor and roof bricks based on there center point
        GameState.floorAndRoofPositions = [];
        currentArrayPos = 0;
        for(i2 = 1; i2 > -1; i2--)
            for(i = 1; i < 10; i++)
            {
                GameState.floorAndRoofPositions[currentArrayPos] = [];
                GameState.floorAndRoofPositions[currentArrayPos][0] = (i * 160)-80; // each floor piece is 160 so get its position and then negate half its width to get the position based off its center
                GameState.floorAndRoofPositions[currentArrayPos][1] = i2 * 480; // y if i2 is one its a floor piece
                currentArrayPos++;
            }

        GameState.backgroundScrollX = 0;

        GameState.playerPosition = [];
        GameState.playerPosition[0] = 450; // x position
        GameState.playerPosition[1] = 434; // y position
        GameState.playerPosition[2] = 1;   // scale
        GameState.playerPosition[3] = 0;   // rotation

        // instantiate the HighscoreTable and pull the highscores from the servers database
        GameState.highscoreTable = new HighscoreTable(game);
        GameState.highscoreTable.getHighscoreTable();

         // the relevant windows created and all preloads have started, switch to menu
        game.state.start('Menu');
    }
};

