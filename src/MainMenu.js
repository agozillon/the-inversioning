/**
 * Created by ANDREW on 21/03/14.
 */

/**
 * Creates the MainMenu Object, which is essentially used as a state class within Phaser
 * It's job is to display the Main Menu and act as an intermediary state between all other game states
 *@constructor
 **/
GameState.MainMenu = function () {
    this.background = null;
    this.obstacles = null;
    this.randomPlatforms = null;
    this.floorAndRoof = null;
    this.randomWalls = null;
    this.player = null;
    this.music = null;
    this.playButton = null;
    this.tutorialButton = null;
    this.highscoresButton = null;
    this.title = null;
};

GameState.MainMenu.prototype = {

    /**
     * Function that Initializes all things required for the main menu, I.E the buttons and audio.
     * @private
     * @function
     */
    create: function () {

        // game background
        this.background = game.add.tileSprite(0,0, game.world.width, game.world.height,'background');
        this.background.tilePosition.x = GameState.backgroundScrollX;


        // if the music hasn't been instantiated then add the audio track (phaser audio plays and remains between states
        if(this.music == null)
            this.music = game.add.audio('soundtrack');

        // if its not null and isn't playing then play it and set the music to loop
        if(this.music != null && !this.music.isPlaying){
            this.music.play();
            this.music.loop = true;
        }

        // World Object creation, has to be done each time in phaser, unfortunately can't pass objects
        // between states
        this.obstacles = game.add.group();
        for(i = 0; i < GameState.obstaclePosAndRot.length; i++)
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', game, this.obstacles, true);


        this.randomPlatforms = game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0,'platformMetal', game, this.randomPlatforms, false);


        this.floorAndRoof = game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0,'platform', game, this.floorAndRoof, true);

        this.randomWalls = game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', game, this.randomWalls, false);

        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 10.0, 100.0, 500.0,'character', 48, game);

        // menu buttons that on click call back the state switch functions created in main menu
        this.playButton = this.add.button(game.world.centerX - 60, game.world.centerY, 'playButtonSpriteSheet', this.enterGameState, this, 1, 0, 0, 0);
        this.playButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point

        this.tutorialButton = this.add.button(game.world.centerX, game.world.centerY + 60, 'tutorialButtonSpriteSheet', this.enterTutorialState, this, 1, 0, 0, 0);
        this.tutorialButton.anchor.setTo(0.5, 0.5);

        this.highscoresButton = this.add.button(game.world.centerX + 60, game.world.centerY, 'highscoresButtonSpriteSheet', this.enterHighscoresState, this, 1, 0, 0, 0);
        this.highscoresButton.anchor.setTo(0.5, 0.5);

        // create the title text
        this.title = game.add.text((game.world.width / 2), (game.world.height / 2) - 120, 'The \n Inversioning', { font: '32px Impact', fill: '#f00' });
        this.title.align = 'center';
        this.title.anchor.set(0.5, 0.5);

    },

    /**
     * Function for switching to the game state, created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterGameState: function() {
        game.state.start('Game');
    },

    /**
     * Function for switching to the tutorial state, created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterTutorialState: function() {
        game.state.start('Tutorial');
    },

    /**
     * Function for switching to the highscore state, created so that we can attach it to a button as an on-click event
     * @private
     * @function
     */
    enterHighscoresState: function() {
        game.state.start('Highscores');
    }
};