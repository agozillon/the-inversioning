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
 * @param {number} rot - rotation of the WorldObject sprite
 * @param {string} sprite - string that's a key of an image loaded in via Phasers load.image function
 * @param {Game} game - phaser game object to allow access to game specific functions
 * @param {Group} group - link to a phaser group object to allow all the WorldObject objects to be added to a group
 * that allows for easy collision checking etc.!
 * */
function WorldObject(posX, posY, scaleX, scaleY, rot, sprite, game, group, leftCollideable){
    this.game = game;
    this.worldObject = group.create(posX, posY, sprite);
    this.worldObject.scale.x = scaleX;
    this.worldObject.scale.y = scaleY;
    this.worldObject.angle = rot;
    this.worldObject.anchor.set(0.5);
    this.game.physics.enable(this.worldObject, Phaser.Physics.ARCADE);
    this.worldObject.body.immovable = true;
    this.worldObject.body.checkCollision.left = leftCollideable;
    this.worldObject.body.collideWorldBounds = false;
}