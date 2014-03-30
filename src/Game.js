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
        this.game.world.setBounds(0, 0, 3200, 640);

        //posX, posY, scaleX, scaleY, gravity, drag, playerSprite, phaser game object
        this.player = new RunnerPC(450.0, 448.0, 2.0, 2.0, 50.0, 0.0, 'player', game);

        this.obstacles = this.game.add.group();
        for(i = 0; i < 10; i++)
            new WorldObject(2800, i * 40, 1.0, 1.0, 'platformMetal', this.game, this.obstacles);

        this.randomPlatforms = this.game.add.group();
        for(i = 0; i < 10; i++)
            new WorldObject(3072, i * 40, 1.0, 1.0, 'platformMetal', this.game, this.randomPlatforms);


        // the sprite I'm using for platforms is currently 128 pixels wide so 128 * 25 = 3200 pixels
        // wide + 1 extra to stop graphical error on screen transition, the inner loop is to render
        // the tiles lengthwise and the outer loop is to render the floor and then roof
        this.floorAndRoof = this.game.add.group();
        for(i2 = 1; i2 > -1; i2--)
           for(i = 0; i < 26; i++)
            new WorldObject(i * 128, i2 * 480, 1.0, 1.0, 'platform', this.game, this.floorAndRoof);

        this.boostButton = this.add.button(70, 605, 'boostButton', this.player.boost, this.player, 0, 0, 0, 0);
        this.boostButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.boostButton.scale.x = 1.5;
        this.boostButton.scale.y = 1.5;
        this.boostButton.fixedToCamera = true;

        this.invertButton = this.add.button(830, 605, 'invertGravityButton', this.player.invertGravity, this.player, 0, 0, 0, 0);
        this.invertButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.invertButton.scale.x = 1.5;
        this.invertButton.scale.y = 1.5;
        this.invertButton.fixedToCamera = true;

        this.scoreText = game.add.text(450, 575, 'Score ' + this.player.getScore(), { font: '24px Impact', fill: '#f00' });
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.fixedToCamera = true;
    },

    /**Runs the update code for the Game class, input, score incrementation, player movement etc.
     * @private
     * @function */
    update: function () {

       if(this.gameOver == false)
       {
            this.player.update();

            if(this.game.physics.arcade.collide(this.player.character, this.floorAndRoof)
            || this.game.physics.arcade.collide(this.player.character, this.randomPlatforms))
                this.player.updateOnFloor(true);
            else
                this.player.updateOnFloor(false);

           if(this.game.physics.arcade.collide(this.player.character, this.obstacles))
                this.gameOver = true;

            this.scoreText.text = 'Score ' + this.player.getScore();

            if(this.game.camera.x + this.game.camera.width >= 100 * 32)
            {
                for(i = 0; i < this.randomPlatforms.length; i++)
                {
                    var current = this.randomPlatforms.getAt(i);

                    if(current.position.x <= 900)
                        current.kill();

                    if(current.position.x >= 2300)
                        this.randomPlatforms.xy(i, current.position.x - 2300, current.position.y);

                }

                for(i = 0; i < this.obstacles.length; i++)
                {
                    var current = this.obstacles.getAt(i);

                    if(current.position.x <= 900)
                        current.kill();

                    if(current.position.x >= 2300)
                        this.obstacles.xy(i, current.position.x - 2300, current.position.y);

                }

                this.player.updatePosition(450, this.player.character.y);
            }

        }
        else
       {
           this.player.updateGravity(0);
           this.player.updateVelocity(0,0);
       }
    }
};