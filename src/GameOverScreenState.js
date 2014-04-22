/**
 * Created by ANDREW on 22/04/14.
 */
function GameOverScreenState(isHighscore){
    this.isAHighscore = isHighscore;
};

GameOverScreenState.prototype.create = function(game, gameOverControl, playGameState){
    this.gameoverBackground = game.add.sprite(game.world.width/2, game.world.height/2, 'blankBackground');
    this.gameoverBackground.anchor.set(0.5,0.5);
    this.gameoverBackground.scale.x = 0.5;
    this.gameoverBackground.scale.y = 0.5;

    this.gameOverText = game.add.text((game.world.width / 2), (game.world.height / 2) - 120, 'Game Over', { font: '24px Impact', fill: '#f00' });
    this.gameOverText.anchor.set(0.5, 0.5);

    this.highscoreInfoText = game.add.text((game.world.width / 2), (game.world.height / 2) - 50, '', { font: '24px Impact', fill: '#f00' });
    this.highscoreInfoText.anchor.set(0.5, 0.5);

    if(this.isAHighscore == true)
        this.highscoreInfoText.text = 'You have a highscore!';
    else
        this.highscoreInfoText.text = "Sadly you don't have a highscore";

    if(this.isAHighscore == true)
    {
        this.enterScoreButton = game.add.sprite((game.world.width / 2), (game.world.height / 2),'enterScoreButton');
        this.enterScoreButton.inputEnabled = true;
        this.enterScoreButton.events.onInputDown.add(function(){gameOverControl.switch(game,gameOverControl.getGameOverScore(),playGameState)}, gameOverControl);
        this.enterScoreButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
        this.enterScoreButton.scale.x = 0.75;
        this.enterScoreButton.scale.y = 0.5;
    }

    this.replayButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 50,'replayButton');
    this.replayButton.inputEnabled = true;
    this.replayButton.events.onInputDown.add(function(){playGameState.reset(), this.exit()}, this);
    this.replayButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.replayButton.scale.x = 0.75;
    this.replayButton.scale.y = 0.5;

    this.backToMenuButton = game.add.sprite((game.world.width / 2), (game.world.height / 2) + 100,'backToMenuButton');
    this.backToMenuButton.inputEnabled = true;
    this.backToMenuButton.events.onInputDown.add(function(){playGameState.setPositions(), game.state.start('Menu')}, game);
    this.backToMenuButton.anchor.setTo(0.5, 0.5); // changes the point where its positioned from the Anchor point
    this.backToMenuButton.scale.x = 0.75;
    this.backToMenuButton.scale.y = 0.5;

}

GameOverScreenState.prototype.exit = function(){
    this.gameOverText.destroy();
    this.highscoreInfoText.destroy();
    this.gameoverBackground.destroy();
    this.backToMenuButton.destroy();
    this.replayButton.destroy();

    if(this.isAHighscore)
        this.enterScoreButton.destroy();
}

GameOverScreenState.prototype.update = function(game){
}