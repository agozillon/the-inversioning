/**
 * Created by ANDREW on 21/03/14.
 */
/**
 * Created by ANDREW on 09/02/14.
 */

var game = new Phaser.Game(800, 600,"The Inversioning");

window.onload = function(){
    game.state.add('Init', GameState.Init);
    game.state.start('Init');
};