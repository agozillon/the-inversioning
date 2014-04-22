/**
 * Created by ANDREW on 21/03/14. Of Note is that the state setup and states are similar to the
 * Mobile Games Framework from Phaser (as it's generally how you setup states in an OO manor for phaser)
 */

/** A blank GameState object that we attach all of the game States too as per Phaser Frameworks
 * standard template. Would be termed a "Singleton" class in other languages, variables shared
 * across all states can be stored here. OF NOTE: All States added to the GameState class and then Phaser State
 * have instant access to the Phaser game, add, camera, cache, input, load, math, sound, stage, time, tweens, world
 * particles, physics, rnd
 * @constructor */
var GameState = {
    platformPositions: null,
    obstaclePositions: null,
    backgroundScrollX: null,
    playerPosition: null,
    floorAndRoofPositions: null

};