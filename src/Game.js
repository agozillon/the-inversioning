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
};

GameState.Game.prototype = {

    /**Initializes all of the variables and objects required for this state
     * @private
     * @function */
    create: function () {

        // scrolling city background
        this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height,'background');

        //posX, posY, scaleX, scaleY, gravity, animatedSprite, spriteFps, game
        this.player = new RunnerPC(450.0, 430.0, 1.0, 1.0, 50.0, 'character', 48, game);

        this.obstacles = this.game.add.group();
        for(i = 0; i < 4; i++)
        {
            var ranMax, ranMin;
            ranMin = 800 + (i * 400);
            ranMax = 800 + (i * 400) + 400;
            new WorldObject(this.game.rnd.integerInRange(ranMin, ranMax), 448, 1.0, 1.0, 'spikes', this.game, this.obstacles, true);
        }

        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < 4; i++)
        {
            var ranMax, ranMin;
            ranMin = 800 + (i * 400);
            ranMax = 800 + (i * 400) + 400;
            new WorldObject(this.game.rnd.integerInRange(ranMin, ranMax), this.game.rnd.integerInRange(100, 440), 1.0, 1.0, 'platformMetal', this.game, this.randomPlatforms, false);
        }
        // the sprite I'm using for platforms is currently 128 pixels wide so 128 * 25 = 3200 pixels
        // wide + 1 extra to stop graphical error on screen transition, the inner loop is to render
        // the tiles lengthwise and the outer loop is to render the floor and then roof
        this.floorAndRoof = this.game.add.group();
        for(i2 = 1; i2 > -1; i2--)
           for(i = 1; i < 10; i++)
            new WorldObject((i * 160)-80, i2 * 480, 1.0, 1.0, 'platform', this.game, this.floorAndRoof, true);

        this.boostButton = this.add.button(this.game.world.width - 730, this.game.world.height - 35, 'boostButton', this.player.boost, this.player, 0, 0, 0, 0);
        this.boostButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.boostButton.scale.x = 1.5;
        this.boostButton.scale.y = 1.5;
        this.boostButton.fixedToCamera = true;

        this.invertButton = this.add.button(this.game.world.width - 70, this.game.world.height - 35, 'invertGravityButton', this.player.invertGravity, this.player, 0, 0, 0, 0);
        this.invertButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.invertButton.scale.x = 1.5;
        this.invertButton.scale.y = 1.5;
        this.invertButton.fixedToCamera = true;

        this.scoreText = game.add.text(this.game.world.width / 2, this.game.world.height - 35, 'Score ' + this.player.getScore(), { font: '24px Impact', fill: '#f00' });
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.fixedToCamera = true;
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
                   var previous = this.randomPlatforms.getAt(i-1);
               else
                   var previous = this.randomPlatforms.getAt(this.randomPlatforms.length - 1);


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

           if(this.game.physics.arcade.collide(this.player.character, this.obstacles))
                this.gameOver = true;

            this.scoreText.text = 'Score ' + this.player.getScore();

        }
        else
       {
           this.player.updateGravity(0);
           this.player.updateVelocity(0,0);
           this.player.character.body.velocity.x = 0;

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
       }
    }
};