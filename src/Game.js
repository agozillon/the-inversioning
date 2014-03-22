/**
 * Created by ANDREW on 21/03/14.
 */

GameState.Game = function (game) {
     this.inversionTimer = 0;
     this.inversionCooldown = 500;
};

GameState.Game.prototype = {

    create: function () {
        // adding a sprite to the player, positioning, changing the images center to it's
        // center instead of far left and Enabling Physics for the player
        this.player = game.add.sprite(game.world.centerX, 0, 'player');
        this.player.scale.x = 2;
        this.player.scale.y = 2;
        this.player.anchor.set(0.5);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.drag.set(20); // adds an opposing physical force to the object so it doesn't infinitely move
        this.player.body.gravity.y = 50;
    },

    update: function () {

        this.inversionTimer += this.game.time.elapsed;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.player.body.velocity.x = -50;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.player.body.velocity.x = 50;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.inversionTimer >= this.inversionCooldown){
            this.player.body.gravity.y = -this.player.body.gravity.y;
            this.inversionTimer = 0;
        }
    }

};