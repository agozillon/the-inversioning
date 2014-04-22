/**
 * Created by ANDREW on 22/04/14.
 */
function GameOverScoreState(){
    this.highscore = null;
};

GameOverScoreState.prototype.create = function(game, gameOverControl, playGameState){

    this.gameoverBackground = game.add.tileSprite(game.world.width/2, game.world.height/2, 400, 300,'blankBackground');
    this.gameoverBackground.anchor.set(0.5,0.5);

    this.congratulationsText = game.add.text((game.world.width / 2), (game.world.height / 2) - 120, 'Congratulations', { font: '24px Impact', fill: '#f00' });
    this.congratulationsText.anchor.set(0.5, 0.5);

    this.onHighscoreText = game.add.text((game.world.width / 2), (game.world.height / 2) - 90, 'on your highscore!', { font: '24px Impact', fill: '#f00' });
    this.onHighscoreText.anchor.set(0.5, 0.5);

    this.scoreDisplayText = game.add.text((game.world.width / 2), (game.world.height / 2) - 20, 'Score: ' + playGameState.player.getScore(), { font: '24px Impact', fill: '#f00' });
    this.scoreDisplayText.anchor.set(0.5, 0.5);

    this.doneButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 100,'doneButton');
    this.doneButton.inputEnabled = true;
    this.doneButton.events.onInputDown.add(function(){playGameState.setPositions(), game.state.start('Menu')}, game);
    this.doneButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.doneButton.scale.x = 0.75;
    this.doneButton.scale.y = 0.5;

    this.highscore = new Highscore(game, (game.world.width / 2), (game.world.height / 2) + 40);
    this.highscore.updateVisibility(true);
    this.highscore.updateScore(playGameState.player.getScore());
}

GameOverScoreState.prototype.exit = function(){
    this.doneButton.destroy();
    this.gameoverBackground.destroy();
    this.scoreDisplayText.destroy();
    this.congratulationsText.destroy();
    this.onHighscoreText.destroy();
    this.highscore.destroy();
}

GameOverScoreState.prototype.update = function(game){
    if(game.input.activePointer.isDown){
        if(game.input.activePointer.worldX > 550)
            this.highscore.incrementIndex();

        if(game.input.activePointer.worldX < 350)
            this.highscore.decrementIndex();

        if(game.input.activePointer.worldY > 400)
            this.highscore.decrementChar();

        if(game.input.activePointer.worldY < 200)
            this.highscore.incrementChar();

    }

    this.highscore.update();

}