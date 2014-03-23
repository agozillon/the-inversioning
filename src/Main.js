/**
 * Created by ANDREW on 21/03/14.
 */
/**
 * Created by ANDREW on 09/02/14.
 */

 /** A phaser game object which houses all of the games various states and logic */
var game = new Phaser.Game(800, 600,"The Inversioning");

window.onload = function(){
    game.state.add('Init', GameState.Init); // adding an initialize state to the Phaser Game and then starting it
    game.state.start('Init');
};