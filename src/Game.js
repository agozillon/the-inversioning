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
        {
            new WorldObject(GameState.obstaclePosAndRot[i][0], GameState.obstaclePosAndRot[i][1], 1.0, 1.0, GameState.obstaclePosAndRot[i][2], 'spikes', this.game, this.obstacles, true);
        }

        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < GameState.platformPositions.length; i++)
        {
            new WorldObject(GameState.platformPositions[i][0], GameState.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', this.game, this.randomPlatforms, false);
        }

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

               if(i != 0)
                   var previous = this.obstacles.getAt(i-1);
               else
                   var previous = this.obstacles.getAt(this.obstacles.length - 1);


               if(current.position.x <= -80)
               {
                   var ranMax, ranMin;
                   ranMin = previous.position.x + 400;
                   ranMax = previous.position.x + 800;

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

               if(i != 0)
                    var previous = this.randomPlatforms.getAt(i-1);
               else
                    var previous = this.randomPlatforms.getAt(this.randomPlatforms.length - 1);


               if(current.position.x <= -80)
               {
                   var ranMax, ranMin;
                   ranMin = previous.position.x + 400;
                   ranMax = previous.position.x + 800;

                   current.position.x = game.rnd.integerInRange(ranMin, ranMax);
                   current.position.y = game.rnd.integerInRange(100, 440);
               }

               current.body.velocity.x = -this.player.getVelocityX();
           }



           // loops through the floor and roof tiles and positions them one after the other as
           // they drop off of the left hand side of the screen, just adding them onto the end
           // of the screen width sadly makes the tiles positioning gradually break apart as we boost
           // hence the slightly more complex positioning after hte previous tile
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

            if(this.game.physics.arcade.collide(this.player.character, this.floorAndRoof)
            || this.game.physics.arcade.collide(this.player.character, this.randomPlatforms))
                this.player.updateOnFloor(true);
            else
                this.player.updateOnFloor(false);

           if(this.game.physics.arcade.collide(this.player.character, this.obstacles) && this.resetTimer > 100)
                this.gameOver = true;

           if(this.resetTimer < 100)
                this.resetTimer += this.game.time.elapsed;

           this.scoreText.text = 'Score ' + this.player.getScore();
        }
        else
       {
           if(this.gameStop == false)
           {
               // freeze everything
               this.player.updateGravity(0);
               this.player.updateVelocityX(0);
               this.player.character.body.velocity.x = 0;
               this.player.character.body.velocity.y = 0;
               this.gameOverState.switch(this.game, this.gameOverState.getGoodGameOverScreen(), this);

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
            ranMin = 800 + (rowCounter * 400);
            ranMax = 800 + (rowCounter * 400) + 400;

            rowCounter++;
            if(rowCounter > (this.randomPlatforms.length / 2)-1)
                rowCounter = 0;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);

            current.body.velocity.x = -this.player.getVelocityX();
        }


        for(i = 0; i < this.randomPlatforms.length; i++)
        {
            var current = this.randomPlatforms.getAt(i);

            var ranMax, ranMin;
            ranMin = 800 + (i * 400);
            ranMax = 800 + (i * 400) + 400;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
            current.position.y = game.rnd.integerInRange(100, 440);

            current.body.velocity.x = -this.player.getVelocityX();
        }

        for(i = 0; i < this.floorAndRoof.length; i++){
            var current = this.floorAndRoof.getAt(i);
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

        GameState.playerPosition[0] = this.player.character.position.x;
        GameState.playerPosition[1] = this.player.character.position.y;
        GameState.playerPosition[2] = this.player.character.scale.x;
        GameState.playerPosition[3] = this.player.character.angle;

        GameState.backgroundScrollX = this.background.tilePosition.x;
    }
};