/**
 * Created by ANDREW on 22/04/14.
 */
function GameOverState(){
    this.currentState = null;
    this.goodGameOverScreen = new GameOverScreenState(true);
    this.gameOverScore = new GameOverScoreState();
    this.badGameOverScreen = new GameOverScreenState(false);
}

GameOverState.prototype.getGameOverScore = function(){
    return this.gameOverScore;
};

GameOverState.prototype.getGoodGameOverScreen = function(){
    return this.goodGameOverScreen;
};

GameOverState.prototype.getBadGameOverScreen = function(){
    return this.badGameOverScreen;
};

GameOverState.prototype.switch = function(game, state, playGameState){
    if(this.currentState != null)
        this.currentState.exit();

    this.currentState = state;

    this.currentState.create(game, this, playGameState);
};

GameOverState.prototype.update = function(game){
    this.currentState.update(game);
};
