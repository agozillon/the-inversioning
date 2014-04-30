/**
 * Created by ANDREW on 21/03/14.
 */

/** Creates the Game Object, which is essentially used as a state class within Phaser
 * This ones job is to run the main game, instantiate all objects related to the main game
 * and control the game flow.
 *@constructor
 *@param {Object} game a link to an instantiated Phaser Game Object */
GameState.Game = function (game) {
    this.player = null;
    this.map = null;
    this.gameOver = false;
    this.gameStop = false;
    this.resetTimer = 110;
    this.obstaclesIterator = 0;
    this.wallIterator = 2;
    this.platformIterator = 0;
};


GameState.Game.prototype = {

    /**Initializes all of the variables and objects required for this state
     * @private
     * @function */
    create: function () {

        // scrolling city background
        this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height,'background');

        //posX, posY, scaleX, scaleY, gravity, animatedSprite, spriteFps, game
        this.player = new RunnerPC(GameState.playerPosition[0], GameState.playerPosition[1], GameState.playerPosition[2], 1.0, GameState.playerPosition[3], 50.0,'character', 48, game);

        // World Object creation, has to be done each time in phaser, unfortunately can't pass objects
        // between states
        this.obstacles = this.game.add.group();
        for(i = 0; i < GameState.obstaclePosAndRot.length; i++)
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', this.game, this.obstacles, true);

        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', this.game, this.randomPlatforms, false);

        this.randomWalls = this.game.add.group();
        for(i = 0; i < GameState.wallPositions.length; i++)
            new WorldObject(GameState.wallPositions[i][0], GameState.wallPositions[i][1], 1.0, 1.0, 0, 'wall', this.game, this.randomWalls, true);

        this.floorAndRoof = this.game.add.group();
        for(i = 0; i < GameState.floorAndRoofPositions.length; i++)
            new WorldObject(GameState.floorAndRoofPositions[i][0], GameState.floorAndRoofPositions[i][1], 1.0, 1.0, 0, 'platform', this.game, this.floorAndRoof, true);


        this.boostButton = this.add.button(this.game.world.width - 730, this.game.world.height - 35, 'boostButton', this.player.boost, this.player, 0, 0, 0, 0);
        this.boostButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.boostButton.scale.x = 1.5;
        this.boostButton.scale.y = 1.5;
        this.boostButton.fixedToCamera = true;
        this.boostButton.exists = false;

        this.invertButton = this.add.button(this.game.world.width - 70, this.game.world.height - 35, 'invertGravityButton', this.player.invertGravity, this.player, 0, 0, 0, 0);
        this.invertButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.invertButton.scale.x = 1.5;
        this.invertButton.scale.y = 1.5;
        this.invertButton.fixedToCamera = true;

        this.scoreText = this.game.add.text(this.game.world.width / 2, this.game.world.height - 35, 'Score ' + this.player.getScore(), { font: '24px Impact', fill: '#f00' });
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.fixedToCamera = true;

        this.gameOverState = new GameOverState();

        if(this.gameOver == true || this.gameStop == true){
           this.reset();
        }
    },

    /**Runs the update code for the Game class, input, score incrementation, player movement etc.
     * @private
     * @function */
    update: function () {

       if(this.gameOver == false)
       {
            // updates the player
            this.player.update();
            this.background.tilePosition.x -= 0.2;

           for(var i = 0; i < this.obstacles.length; i++)
           {
               var current = this.obstacles.getAt(i);

               if(current.position.x <= -80)
               {
                   var ranMax, ranMin;
                   ranMin = this.randomWalls.getAt(this.wallIterator).position.x + 32 + Math.floor(this.obstaclesIterator / 2) * 200;
                   ranMax = ranMin + 136;

                   this.obstaclesIterator++;

                   if(this.obstaclesIterator >= 8)
                      this.obstaclesIterator = 0;

                   current.position.x = game.rnd.integerInRange(ranMin, ranMax);

               }

               current.body.velocity.x = -this.player.getVelocityX();
           }


           // loops through the platforms positions them if they go off screen and sets
           // there velocity to the inverse of the players (we're not moving the player
           // in the world, we're moving the world to the player, makes life easier whilst
           // keeping accurate physics)
           for(var i = 0; i < this.randomPlatforms.length; i++)
           {
               var current = this.randomPlatforms.getAt(i);

               if(current.position.x <= -80)
               {
                   var ranMax, ranMin;
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

           for(var i = 0; i < this.randomWalls.length-1; i++)
           {
               var current = this.randomWalls.getAt(i);
               var lastWall = this.randomWalls.getAt(3);

               if(current.position.x <= -80)
               {
                   current.position.x = 2400; // furthest away point on the x where the walls can spawn

                   this.wallIterator = i;

                   // choose the walls side based on the outcome of the randomizer
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

               current.body.velocity.x = -this.player.getVelocityX();
               lastWall.body.velocity.x = -this.player.getVelocityX();
           }


           // loops through the floor and roof tiles and positions them one after the other as
           // they drop off of the left hand side of the screen, just adding them onto the end
           // of the screen width sadly makes the tiles positioning gradually break apart as we boost
           // hence the slightly more complex positioning after the previous tile
           for(var i = 0; i < this.floorAndRoof.length; i++)
           {
               var current = this.floorAndRoof.getAt(i);

               if(i != 0 && i != this.floorAndRoof.length / 2)
                   var previous = this.floorAndRoof.getAt(i-1);
               else if(i < this.floorAndRoof.length / 2)
                   var previous = this.floorAndRoof.getAt(this.floorAndRoof.length/2-1);
               else
                   var previous = this.floorAndRoof.getAt(this.floorAndRoof.length-1);

               if(current.position.x <= -80)
               {
                   current.position.x = previous.position.x + previous.width;
               }

               current.body.velocity.x = -this.player.getVelocityX();
           }

           if(this.game.physics.arcade.collide(this.player.character, this.floorAndRoof, this.player.separate, null, this.player)
           || this.game.physics.arcade.collide(this.player.character, this.randomPlatforms, this.player.separate, null, this.player))
               this.player.updateOnFloor(true);
           else
               this.player.updateOnFloor(false);

           if(this.game.physics.arcade.collide(this.player.character, this.randomWalls) || this.game.physics.arcade.collide(this.player.character, this.obstacles) && this.resetTimer > 100)
               this.gameOver = true;

          if(this.resetTimer < 100)
                this.resetTimer += this.game.time.elapsed;

          this.scoreText.text = 'Score ' + this.player.getScore();
        }
        else
       {
           if(this.gameStop == false)
           {
               if(GameState.highscoreTable.isItAHighscore(this.player.getScore()))
                    this.gameOverState.switch(this.game, this.gameOverState.getGoodGameOverScreen(), this);
               else
                    this.gameOverState.switch(this.game, this.gameOverState.getBadGameOverScreen(), this);

               for(var i = 0; i < this.floorAndRoof.length; i++){
                    var current = this.floorAndRoof.getAt(i);
                    current.body.velocity.x = 0;
               }
               for(var i = 0; i < this.randomPlatforms.length; i++){
                    var current = this.randomPlatforms.getAt(i);
                    current.body.velocity.x = 0;
                }

               for(var i = 0; i < this.obstacles.length; i++){
                    var current = this.obstacles.getAt(i);
                    current.body.velocity.x = 0;
               }

               for(var i = 0; i < this.randomWalls.length; i++){
                   var current = this.randomWalls.getAt(i);
                   current.body.velocity.x = 0;
               }

               this.gameStop = true;
           }

           this.gameOverState.update(this.game);


       }
    },

    reset: function(){

        this.player.reset();

        var rowCounter = 0;
        for(var i = 0; i < this.obstacles.length; i++)
        {
            var current = this.obstacles.getAt(i);

            var ranMax, ranMin;
            ranMin = 832 + (rowCounter * 200);
            ranMax = ranMin + 136;

            rowCounter++;
            if(rowCounter > (this.obstacles.length / 2)-1)
                rowCounter = 0;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);

            current.body.velocity.x = -this.player.getVelocityX();
        }

        for(i = 0; i < this.randomPlatforms.length; i++)
        {
            current = this.randomPlatforms.getAt(i);

            ranMax, ranMin;
            ranMin = 880 + (i * 266.67); // distance till next wall 800 / 3 platform count between walls = 266.67 pixels
            // 128 * 2(total number of spaces required to space out platforms, 1 64 set per platform 3 linked together = 256)
            // (space with - 160 taken from the start and end relating to 16 pixels from half the wall and 64 from the platforms * 2 for each wall
            // so 800 - 160 = 640) 640 - 256 = 384 the space left to randomize the objects in. And now we divide it by the number of platforms to get
            // 128! The space for each platform to randomize itself in.
            ranMax = ranMin + 128;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
            current.position.y = game.rnd.integerInRange(100, 400);

            current.body.velocity.x = -this.player.getVelocityX();
        }

        for(i = 0; i < this.randomWalls.length; i++){

            current = this.randomWalls.getAt(i);

            if(i < 3){
                current.position.x = 800 + (i * 800); // set walls x position

                // randomly choose if its on the roof or floor based on a modulus remainder from
                // 1 to 1000
                if(this.game.rnd.integerInRange(1, 1000) % 2 == 0){
                    current.position.y = 80;
                }
                else{
                    current.position.y = 400;
                }
            }
            else{  // this chooses where we'll put our 4th wall so we have a "double wall" where we can only go through the centre
                var randPlace = (this.game.rnd.integerInRange(1, 1000) % 3);
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

        for(i = 0; i < this.floorAndRoof.length; i++){
            current = this.floorAndRoof.getAt(i);
            current.body.velocity.x = -this.player.getVelocityX();
        }

        this.background.tilePosition.x = 0;

        this.resetTimer = 0;
        this.gameOver = false;
        this.gameStop = false;
    },

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

        for(i = 0; i < this.obstacles.length; i++){
            current = this.obstacles.getAt(i);
            GameState.obstaclePosAndRot[i][0] = current.position.x;
            GameState.obstaclePosAndRot[i][1] = current.position.y;
        }

        for(i = 0; i < this.randomWalls.length; i++){
            current = this.randomWalls.getAt(i);
            GameState.wallPositions[i][0] = current.position.x;
            GameState.wallPositions[i][1] = current.position.y;
        }

        GameState.playerPosition[0] = this.player.character.position.x;
        GameState.playerPosition[1] = this.player.character.position.y;
        GameState.playerPosition[2] = this.player.character.scale.x;
        GameState.playerPosition[3] = this.player.character.angle;

        GameState.backgroundScrollX = this.background.tilePosition.x;
    }
};