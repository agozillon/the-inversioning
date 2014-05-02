/**
 * Created by ANDREW on 22/04/14.
 */

/**
 * Instantiates the GameOverStateManager which instantiates the goodGameOverScreen, gameOverScore and badGameOverScreen states
 * and allows the user to switch between them and return each of the states
 *@constructor
 */
function GameOverStateManager(){
    this.currentState = null;
    this.goodGameOverScreen = new GameOverScreenState(true);
    this.gameOverScore = new GameOverScoreState();
    this.badGameOverScreen = new GameOverScreenState(false);
}

/**
 * Function that returns this GameOverStateManager's instance of GameOverScoreState
 * @public
 * @function
 * @returns {GameOverScoreState}
 */
GameOverStateManager.prototype.getGameOverScore = function(){
    return this.gameOverScore;
};

/**
 * Function that returns this GameOverStateManager's instance of GameOverScreenState that has it's isHighscore parameter set as true
 * @public
 * @function
 * @returns {GameOverScreenState}
 */
GameOverStateManager.prototype.getGoodGameOverScreen = function(){
    return this.goodGameOverScreen;
};

/**
 * Function that returns this GameOverStateManager's instance of GameOverScreenState that has it's isHighscore parameter set as false
 * @public
 * @function
 * @returns {GameOverScreenState}
 */
GameOverStateManager.prototype.getBadGameOverScreen = function(){
    return this.badGameOverScreen;
};

/**
 * Function that switches between the GameOverStateManager's GameOver States, it accepts the state you wish to switch to as a parameter and
 * switches to it and exits the previous state as long as it wasn't null
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can pass it into the create function of the GameOver States
 * @param {GameOverScreenState | GameOverScoreState} gameOverState - a link to the GameOver State we wish to switch too
 * @param {Game} playGameState - a link to the current game session our own Game object not phasers, so I can pass it into our GameOver States
 * @public
 * @function
 */
GameOverStateManager.prototype.stateSwitch = function(game, gameOverState, playGameState){
    if(this.currentState != null)
        this.currentState.exit();

    this.currentState = gameOverState;

    this.currentState.create(game, this, playGameState);
};
/**
 * Function that essentially just calls the currently active GameOver states update function
 * @param {Phaser.Game} game - a link to the instantiated Phaser Game Object so we can pass it into the currently active states update function
 * @public
 * @function
 * */
GameOverStateManager.prototype.update = function(game){
    this.currentState.update(game);
};
