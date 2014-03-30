/**
 * Created by ANDREW on 30/03/14.
 */
/**
 * Created by ANDREW on 30/03/14.
 */
/**
 * WorldObject is an object intended to be the platforms and obstacles in the game which the player can
 * can interact with. I.E Obstacles kill the player and Platforms allow the player to walk on them
 * there is nothing that sets the two apart other than how they interact with the player in the game loop
 * @constructor
 * @param {number} posX - position of WorldObject on the x plane
 * @param {number} posY - position of WorldObject on the y plane, positive is down
 * @param {number} scaleX - width scale of the WorldObject sprite
 * @param {number} scaleY - height scale of the WorldObject sprite
 * @param {string} sprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {Game} game - phaser game object to allow access to game specific functions
 * @param {Group} group - link to a phaser group object to allow all the WorldObject objects to be added to a group
 * that allows for easy collision checking etc.!
 * */
function WorldObject(posX, posY, scaleX, scaleY, sprite, game, group){
    this.game = game;
    this.platform = group.create(posX, posY, sprite);
    this.platform.scale.x = scaleX;
    this.platform.scale.y = scaleY;
    this.platform.anchor.set(0.5);
    this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
    this.platform.body.immovable = true;
    this.platform.body.collideWorldBounds = false;
}