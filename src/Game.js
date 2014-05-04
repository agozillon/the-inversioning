/**
 * Created by ANDREW on 21/03/14.
 */

/** Creates the Game Object, which is essentially used as a state class within Phaser.
 * This ones job is to run the main game, instantiate all objects related to the main game
 * and control the game flow.
 *@constructor
*/
GameState.Game = function() {
    this.player = null;
    this.background = null;
    this.inversionKey = null;
    this.boostKey = null;
    this.boostButton = null;
    this.invertButton = null;
    this.scoreText = null;
    this.gameOverState = null;
    this.gameOver = false;
    this.gameStop = false;
    this.resetTimer = 110;
};


GameState.Game.prototype = {

     /**
      * Function Initializes all of the variables and objects required for this state
     * @private
     * @function
     * */
    create: function () {

        // creating our scrolling city background
        this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height,'background');

        // World Object creation, has to be done each time a state changes in phaser, unfortunately can't pass objects
        // between states, music plays through states but is unchangeable sadly. Creating all our game world objects
        GameState.gameWorld.create(game);

        // creating two keyboard keys we can use to check have been pressed on PC to activate
        // gravity inversion and boost
        this.inversionKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.boostKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Creating our player
        this.player = new RunnerPC(GameState.playerVariables[0], GameState.playerVariables[1], GameState.playerVariables[2], 1.0, GameState.playerVariables[3], 10.0, 100.0, 500.0,'character', 'tombstone', 48, game);
        this.player.updateAlive(GameState.playerVariables[4]);

        // creating Phaser buttons attaching call back functions to the button (in this case a RunnerPC function)
        this.boostButton = this.add.button(game.world.width - 730, game.world.height - 35, 'boostButton', this.player.boost, this.player, 0, 0, 0, 0);
        this.boostButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.boostButton.scale.x = 1.5;
        this.boostButton.scale.y = 1.5;
        this.boostButton.fixedToCamera = true;

        // creating Phaser buttons attaching call back functions to the button (in this case a RunnerPC function)
        this.invertButton = this.add.button(game.world.width - 70, game.world.height - 35, 'invertGravityButton', this.player.invertGravity, this.player, 0, 0, 0, 0);
        this.invertButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.invertButton.scale.x = 1.5;
        this.invertButton.scale.y = 1.5;
        this.invertButton.fixedToCamera = true;

        // creating Phaser text and setting it up to initially display the players score, it needs continually updated
        this.scoreText = game.add.text(game.world.width / 2, game.world.height - 35, 'Score ' + this.player.getScore(), { font: '24px Impact', fill: '#f00' });
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.fixedToCamera = true;

        // creating a GameOverStateManager which is my own state system class that's used to display the gameover screens and
        // transitions (in hindsight it would have been better to ignore phaser states and use my own)
        this.gameOverState = new GameOverStateManager();

        // just resets the game on entry if the game needs reset from its last state
        if(this.gameOver == true || this.gameStop == true)
            this.reset();

    },

    /**Function that Runs the update code for the Game class, input, score incrementation, player and object movement, does a plyer collide
     * with an obstacle, are obstacles off screen etc.
     * @private
     * @function */
    update: function () {

        // if game over is false, i.e its running go through this loop
        if(this.gameOver == false)
        {

            // scrolls the background slowly to the left
            this.background.tilePosition.x -= 0.2;

            // updates all the gameworld objects i.e platforms, obstacles, walls, floor and roof
            GameState.gameWorld.update(this.player.getVelocityX());

            // keyboard controls for using gravity inversion and boost
            // as the on screen buttons are difficult to use on PC
            if(this.inversionKey.isDown)
               this.player.invertGravity();

            if(this.boostKey.isDown)
               this.player.boost();

            // if the player collides with a platform or roof we must set the players on floor boolean to true
            // which turns off the gravity effecting the player
            if(game.physics.arcade.collide(this.player.character, GameState.gameWorld.getFloorAndRoofGroup(), this.player.separate, null, this.player)
            || game.physics.arcade.collide(this.player.character, GameState.gameWorld.getPlatformsGroup(), this.player.separate, null, this.player))
               this.player.updateOnFloor(true);
            else
               this.player.updateOnFloor(false);

            // if it collides with an obstacle then set game over to true, the reset timer is to make sure
            // it doesn't collide instantaneously when we restart as it seems to trigger at least twice
            // even if we reposition before we restart.
            if(game.physics.arcade.collide(this.player.character, GameState.gameWorld.getWallGroup())
               || game.physics.arcade.collide(this.player.character, GameState.gameWorld.getObstaclesGroup())
               && this.resetTimer > 100)
               this.gameOver = true;

            // updates the player
            this.player.update();

            // just increment the reset timer if its less han 100, so the temporary invincibility ends
            if(this.resetTimer < 100)
               this.resetTimer += game.time.elapsed;

            // updates the Phaser text object
            this.scoreText.text = 'Score ' + this.player.getScore();
        }
        else // if game over is true then we loop through this, making a seperate game over state would have been more trouble than its worth in this context
        {
            if(this.gameStop == false){ // just a trigger to make sure we don't call the below more than once
                GameState.gameWorld.freezeWorld();

                this.player.updateAlive(false);
                GameState.playerVariables[4] = 0;

               // checks if the score is a highscore or not by checking the highscore table
               // if it is then we switch it to the "good game over screen" where we can enter our
               // score, or the bad where we don't get the option to enter our score
               if(GameState.highscoreTable.isItAHighscore(this.player.getScore()))
                   this.gameOverState.stateSwitch(game, this.gameOverState.getGoodGameOverScreen(), this);
               else
                   this.gameOverState.stateSwitch(game, this.gameOverState.getBadGameOverScreen(), this);

               this.gameStop = true; // set it to true
            }

            // passes in this.game to the gameOverState so we can use it internally in that state
            this.gameOverState.update(game);
        }
    },

    /**
     * Function that resets the game state, resets all the players variables, the worlds obstacles, scrolling background
     * should be called when the player restarts the game
     * @private
     * @function */
    reset: function(){

        this.player.reset(); // reset function of RunnerPC resets all relevant player stats
        GameState.playerVariables[4] = 1;

        // similar to the init states position loop except that we're required to work out which row
        // of obstacles we're on I.E top or bottom so we can position them appropriately
        GameState.gameWorld.reset();

        this.background.tilePosition.x = 0; // just repositioning the back ground tile
        this.resetTimer = 0; // setting all the variables back to there original states
        this.gameOver = false;
        this.gameStop = false;
    },

    /**
     * Function that essentially just sets the players position and background position into the GameState positions
     * so we can use them within other Phaser States
     * @private
     * @function */
    setPositions: function(){
        GameState.playerVariables[0] = this.player.getPositionX();
        GameState.playerVariables[1] = this.player.getPositionY();
        GameState.playerVariables[2] = this.player.getScaleX();
        GameState.playerVariables[3] = this.player.getRotation();

        GameState.gameWorld.positionSave();

        GameState.backgroundScrollX = this.background.tilePosition.x;
    }
};