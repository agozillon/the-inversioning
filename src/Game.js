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
    this.randomObstacles = null;
    this.randomPlatforms = null;
    this.randomWalls = null;
    this.floorAndRoof = null;
    this.inversionKey = null;
    this.boostKey = null;
    this.boostButton = null;
    this.invertButton = null;
    this.scoreText = null;
    this.gameOverState = null;
    this.gameOver = false;
    this.gameStop = false;
    this.resetTimer = 110;
    this.obstaclesIterator = 0;
    this.wallIterator = 2;
    this.platformIterator = 0;
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

        // Creating our player
        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 10.0, 100.0, 500.0,'character', 48, game);

        // World Object creation, has to be done each time a state changes in phaser, unfortunately can't pass objects
        // between states, music plays through states but is unchangeable sadly. Creating all our game world objects
        this.randomObstacles = game.add.group();
        for(var i = 0; i < GameState.obstaclePosAndRot.length; i++)
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', game, this.randomObstacles, true);

        this.randomPlatforms = game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', game, this.randomPlatforms, false);

        this.randomWalls = game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', game, this.randomWalls, true);

        this.floorAndRoof = game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0, 'platform', game, this.floorAndRoof, true);

        // creating two keyboard keys we can use to check have been pressed on PC to activate
        // gravity inversion and boost
        this.inversionKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.boostKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


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
            // updates the player
            this.player.update();

            // scrolls the background slowly to the left
            this.background.tilePosition.x -= 0.2;

            // goes through all the obstacles resets them if there off the left side of the screen
            // and updates its X velocity (needs to be done each loop incase the player boosts and increases
            // there velocity)
            for(var i = 0; i < this.randomObstacles.length; i++)
            {
               var current = this.randomObstacles.getAt(i);

               // if its off the left side of the screen
               if(current.position.x <= -80)
               {
                   // randomize the obstacle, similar to the random placement in init except that it bases
                   // the minimum position of the last position of the newest positioned wall(wallIterator)
                   var ranMax, ranMin;
                   ranMin = this.randomWalls.getAt(this.wallIterator).position.x + 32 + Math.floor(this.obstaclesIterator / 2) * 200;
                   ranMax = ranMin + 136;

                   this.obstaclesIterator++;
                   // sets obstacle iterator to 0 once it reaches 8 i.e do the top obstacle placement then bottom of the
                   // section and then reset to replace them all again
                   if(this.obstaclesIterator >= 8)
                      this.obstaclesIterator = 0;

                   // randomize its x position
                   current.position.x = game.rnd.integerInRange(ranMin, ranMax);
               }

               // set the obstacles phaser physics velocity to our players -ve x velocity to make
               // objects move towards the player.
               current.body.velocity.x = -this.player.getVelocityX();
            }


           // loops through the platforms positions them if they go off screen and sets
           // there velocity to the inverse of the players (we're not moving the player
           // in the world, we're moving the world to the player, makes life easier whilst
           // keeping accurate physics)
            for(i = 0; i < this.randomPlatforms.length; i++){
               current = this.randomPlatforms.getAt(i);

               // works essentially the same as the one above just slightly different maths for positioning
               if(current.position.x <= -80){
                   ranMin = this.randomWalls.getAt(this.wallIterator).position.x  + 80 + (this.platformIterator * 266.67);
                   ranMax = ranMin + 128;

                   this.platformIterator++;

                   if(this.platformIterator >= 3)
                       this.platformIterator = 0;

                   current.position.x = game.rnd.integerInRange(ranMin, ranMax);
                   current.position.y = game.rnd.integerInRange(100, 400);
               }

               current.body.velocity.x = -this.player.getVelocityX();
            }

            // loops through the walls positions them if they go off screen and sets
            // there velocity to the inverse of the players (we're not moving the player
            // in the world, we're moving the world to the player, makes life easier whilst
            // keeping accurate physics)
            for(i = 0; i < this.randomWalls.length-1; i++){
               current = this.randomWalls.getAt(i);
               // gets the the last wall the 4th which we never place on its own
               // we always place it alongside another wall
               var lastWall = this.randomWalls.getAt(3);


               // works a bit differently to the others in this case we position them
               if(current.position.x <= -80){
                   current.position.x = 2400; // furthest away point on the x where the walls can spawn

                   this.wallIterator = i; // the wall iterator is the last known wall to be positioned so we can
                                          // place all other world objects from it

                   // choose the walls side based on the outcome of the randomizer I.E top or bottom
                   if(game.rnd.integerInRange(1, 1000) % 2 == 0){
                       current.position.y = 80;
                   }else{
                       current.position.y = 400;
                   }

                   // check if the 4th wall is off the screen if it is randomly check if we wish
                   // to place the 4th wall alongside the current wall to make a double sided blockade
                   // of walls
                   if(lastWall.position.x <= -80 && game.rnd.integerInRange(1, 1000) % 2 == 0){
                       lastWall.position.x = current.position.x;

                       if(current.position.y == 80){
                           lastWall.position.y = 400;
                       }else{
                           lastWall.position.y = 80;
                       }
                   }
               }

               // assign both the 4th wall and current wall the players -ve velocity
               current.body.velocity.x = -this.player.getVelocityX();
               lastWall.body.velocity.x = -this.player.getVelocityX();
            }


            // loops through the floor and roof tiles and positions them one after the other as
            // they drop off of the left hand side of the screen. Unfortunately just adding them onto the end
            // of the screen width sadly makes the tiles positioning gradually break apart as we boost
            // hence the slightly more complex positioning after the last known tile on the far right
            for(i = 0; i < this.floorAndRoof.length; i++){
               current = this.floorAndRoof.getAt(i);

               if(current.position.x <= -80){
                   // basically just finds us the floor/roof piece to the "left" of the current one
                   var previous;
                   if(i != 0 && i != this.floorAndRoof.length / 2)
                       previous = this.floorAndRoof.getAt(i-1);
                   else if(i < this.floorAndRoof.length / 2)
                       previous = this.floorAndRoof.getAt(this.floorAndRoof.length/2-1);
                   else
                       previous = this.floorAndRoof.getAt(this.floorAndRoof.length-1);

                   current.position.x = previous.position.x + previous.width;
               }

               current.body.velocity.x = -this.player.getVelocityX();
            }

            // keyboard controls for using gravity inversion and boost
            // as the on screen buttons are difficult to use on PC
            if(this.inversionKey.isDown)
               this.player.invertGravity();

            if(this.boostKey.isDown)
               this.player.boost();

            // if the player collides with a platform or roof we must set the players on floor boolean to true
            // which turns off the gravity effecting the player
            if(game.physics.arcade.collide(this.player.character, this.floorAndRoof, this.player.separate, null, this.player)
            || game.physics.arcade.collide(this.player.character, this.randomPlatforms, this.player.separate, null, this.player))
               this.player.updateOnFloor(true);
            else
               this.player.updateOnFloor(false);

            // if it collides with an obstacle then set game over to true, the reset timer is to make sure
            // it doesn't collide instantaneously when we restart as it seems to trigger at least twice
            // even if we reposition before we restart.
            if(game.physics.arcade.collide(this.player.character, this.randomWalls)
               || game.physics.arcade.collide(this.player.character, this.randomObstacles)
               && this.resetTimer > 100)
               this.gameOver = true;

            // just increment the reset timer if its less han 100, so the temporary invincibility ends
            if(this.resetTimer < 100)
               this.resetTimer += game.time.elapsed;

            // updates the Phaser text object
            this.scoreText.text = 'Score ' + this.player.getScore();
        }
        else // if game over is true then we loop through this, making a seperate game over state would have been more trouble than its worth in this context
        {
            if(this.gameStop == false){ // just a trigger to make sure we don't call the below more than once

               // checks if the score is a highscore or not by checking the highscore table
               // if it is then we switch it to the "good game over screen" where we can enter our
               // score, or the bad where we don't get the option to enter our score
               if(GameState.highscoreTable.isItAHighscore(this.player.getScore()))
                   this.gameOverState.stateSwitch(game, this.gameOverState.getGoodGameOverScreen(), this);
               else
                   this.gameOverState.stateSwitch(game, this.gameOverState.getBadGameOverScreen(), this);

               // loops through all the game objects and sets there velocity to 0 so everything stops moving
               for(i = 0; i < this.floorAndRoof.length; i++){
                   current = this.floorAndRoof.getAt(i);
                   current.body.velocity.x = 0;
               }
               for(i = 0; i < this.randomPlatforms.length; i++){
                   current = this.randomPlatforms.getAt(i);
                   current.body.velocity.x = 0;
                }

               for(i = 0; i < this.randomObstacles.length; i++){
                   current = this.randomObstacles.getAt(i);
                   current.body.velocity.x = 0;
               }

               for(i = 0; i < this.randomWalls.length; i++){
                   current = this.randomWalls.getAt(i);
                   current.body.velocity.x = 0;
               }

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

        // similar to the init states position loop except that we're required to work out which row
        // of obstacles we're on I.E top or bottom so we can position them appropriately
        var rowCounter = 0;
        for(var i = 0; i < this.randomObstacles.length; i++){
            var current = this.randomObstacles.getAt(i);

            var ranMax, ranMin;
            ranMin = 832 + (rowCounter * 200);
            ranMax = ranMin + 136;

            // we always use an equal or almost equal number of obstacles for the roof and
            // ground so we divide it by 2 to get the bottom obstacles and then reset the iterator
            // once it reaches the midway marker to then reposition the top row
            rowCounter++;
            if(rowCounter > (this.randomObstacles.length / 2)-1)
                rowCounter = 0;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
        }

        // same as in the init state
        for(i = 0; i < this.randomPlatforms.length; i++){
            current = this.randomPlatforms.getAt(i);

            ranMin = 880 + (i * 266.67); // distance till next wall 800 / 3 platform count between walls = 266.67 pixels
            // 128 * 2(total number of spaces required to space out platforms, 1 64 set per platform 3 linked together = 256)
            // (space with - 160 taken from the start and end relating to 16 pixels from half the wall and 64 from the platforms * 2 for each wall
            // so 800 - 160 = 640) 640 - 256 = 384 the space left to randomize the objects in. And now we divide it by the number of platforms to get
            // 128! The space for each platform to randomize itself in.
            ranMax = ranMin + 128;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
            current.position.y = game.rnd.integerInRange(100, 400);
        }

        // same as the init states wall positioning, we just place them 800 apart, except the final one
        // which we place randomly
        for(i = 0; i < this.randomWalls.length; i++){

            current = this.randomWalls.getAt(i);

            if(i < 3){
                current.position.x = 800 + (i * 800); // set walls x position

                // randomly choose if its on the roof or floor based on a modulus remainder from
                // 1 to 1000
                if(game.rnd.integerInRange(1, 1000) % 2 == 0){
                    current.position.y = 80;
                }
                else{
                    current.position.y = 400;
                }
            }
            else{  // this chooses where we'll put our 4th wall so we have a "double wall" where we can only go through the centre
                var randPlace = (game.rnd.integerInRange(1, 1000) % 3);
                current.position.x = 800 + (randPlace * 800); // position its x in one of our previous walls x areas

                // checks what the wall at the current x positions y is and
                // then sets it to the opposite of the current wall
                if(GameState.wallPositions[randPlace][1] == 400){
                    current.position.y = 80;
                }else{
                    current.position.y = 400;
                }
            }
        }

        this.background.tilePosition.x = 0; // just repositioning the back ground tile
        this.resetTimer = 0; // setting all the variables back to there original states
        this.gameOver = false;
        this.gameStop = false;
    },

    /**
     * Function that essentially just loops through all the worlds objects
     * gets there positions and then assigns them to the State Global GameState positions allowing any
     * Phaser state to access them.
     * @private
     * @function */
    setPositions: function(){
        for(var i = 0; i < this.floorAndRoof.length; i++){
            var current = this.floorAndRoof.getAt(i);
            GameState.floorAndRoofPositions[i][0] = current.position.x;
        }

        for(i = 0; i < this.randomPlatforms.length; i++){
            current = this.randomPlatforms.getAt(i);
            GameState.platformPositions[i][0] = current.position.x;
            GameState.platformPositions[i][1] = current.position.y;
        }

        for(i = 0; i < this.randomObstacles.length; i++){
            current = this.randomObstacles.getAt(i);
            GameState.obstaclePosAndRot[i][0] = current.position.x;
            GameState.obstaclePosAndRot[i][1] = current.position.y;
        }

        for(i = 0; i < this.randomWalls.length; i++){
            current = this.randomWalls.getAt(i);
            GameState.wallPositions[i][0] = current.position.x;
            GameState.wallPositions[i][1] = current.position.y;
        }

        GameState.playerPosition[0] = this.player.getPositionX();
        GameState.playerPosition[1] = this.player.getPositionY();
        GameState.playerPosition[2] = this.player.getScaleX();
        GameState.playerPosition[3] = this.player.getRotation();

        GameState.backgroundScrollX = this.background.tilePosition.x;
    }
};