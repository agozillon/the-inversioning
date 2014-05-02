/**
 * Created by ANDREW on 02/05/14.
 */

/**
 * Class that controls the positioning, creation(Phaser based so it sets up rendering too), reseting and freezing of the World's Walls, Obstacles, Platforms and floors
 * it randomly generates all of the WorldObjects positions based off of the concept of considering each space between two walls as a "Room"
 * @param {Phaser.Game} game - link to the currently active Phaser Game object
 * @param {number} spaceBetweenWalls - the distance you wish to space the walls apart
 * @param {number} platformSpriteWidth - size of the platform sprites width in pixels
 * @param {number} wallSpriteHalfWidth - size of the wall sprites width halfed in pixels
 * @param {number} obstacleSpriteWidth - size of the obstacle sprites width in pixels
 * @param {number} floorSpriteWidth - size of the floor sprites width in pixels
 * @param {number} totalWalls - total number of walls we wish in the game
 * @param {number} numberOfDoubleWalls - this is how many "double walls" we wish which are walls that have a top and bottom with a small space between
 * this gets deducted from the total walls so if we had 8 walls total and 2 double walls, we'd only have 6 set of walls two would be doubled up
 * @param {number} totalPlatforms - total number of platforms we wish in the game
 * @param {number} platformsPerRoom - number of platforms we want between each set of walls
 * @param {number} totalObstacles - total number of obstacles we wish in the game
 * @param {number} obstaclesPerRoom - number of obstacles we want between each set of walls
 * @constructor
 */
function GameWorldManager(game, spaceBetweenWalls, platformSpriteWidth, wallSpriteHalfWidth, obstacleSpriteWidth, floorSpriteWidth, totalWalls, numberOfDoubleWalls, totalPlatforms,
    platformsPerRoom, totalObstacles, obstaclesPerRoom ){
    this.game = game;
    this.obstacles = null;
    this.walls = null;
    this.platforms = null;
    this.floorAndRoof = null;
    this.spaceBetweenWalls = spaceBetweenWalls;
    this.platformWidth = platformSpriteWidth;
    this.wallHalfWidth = wallSpriteHalfWidth;
    this.obstacleWidth = obstacleSpriteWidth;
    this.floorWidth = floorSpriteWidth;
    this.wallCount = totalWalls;
    this.doubleWalls = numberOfDoubleWalls;
    this.platformCount = totalPlatforms;
    this.platformPerRoom = platformsPerRoom;
    this.obstacleCount = totalObstacles;
    this.obstaclesPerRoom = obstaclesPerRoom;

    // randomize all the objects positions
    this.wallPositions =  this.wallRandomizer(80, 400);
    this.platformPositions = this.platformRandomizer(100, 400);
    this.obstaclePositions = this.obstacleRandomizer(30, 448);
    this.floorAndRoofPositions = this.floorAndRoofPlacement(480);
    this.obstaclesIterator = 0;
    this.wallIterator = 2;
    this.platformIterator = 0;
}

/**
 * Function that creates all the worlds objects as WorldObject's which creates Phaser Images and adds them to a Phaser Group
 * allowing them to be displayed on screen
 * @function
 * @public
 */
GameWorldManager.prototype.create = function(){
    // loops through all the positions we have and creates WorldObjects from them and adds them to groups for easy use and access by Phaser
    this.obstacles = game.add.group();
    for(var i = 0; i < this.obstaclePositions.length; i++)
        new WorldObject(this.obstaclePositions[i][0], this.obstaclePositions[i][1], 1.0, 1.0, this.obstaclePositions[i][2], 'spikes', game, this.obstacles, true);

    this.platforms = game.add.group();
    for(i = 0; i < this.platformPositions.length; i++)
        new WorldObject(this.platformPositions[i][0], this.platformPositions[i][1], 1.0, 1.0, 0, 'platformMetal', game, this.platforms, false);

    this.walls = game.add.group();
    for(i = 0; i < this.wallPositions.length; i++)
        new WorldObject(this.wallPositions[i][0], this.wallPositions[i][1], 1.0, 1.0, 0, 'wall', game, this.walls, true);

    this.floorAndRoof = game.add.group();
    for(i = 0; i < this.floorAndRoofPositions.length; i++)
        new WorldObject(this.floorAndRoofPositions[i][0], this.floorAndRoofPositions[i][1], 1.0, 1.0, 0, 'platform', game, this.floorAndRoof, true);
};

/**
 * Function that returns GameWorldManagers Wall Phaser Group object which holds all the wall objects.
 * This allows for it to be looped through and checked for collisions outside of the GameWorldManager
 * @public
 * @function
 * @returns {Phaser.Group}
 */
GameWorldManager.prototype.getWallGroup = function(){
    return this.walls;
};

/**
 * Function that returns GameWorldManagers Platform Phaser Group object which holds all the wall objects.
 * This allows for it to be looped through and checked for collisions outside of the GameWorldManager
 * @public
 * @function
 * @returns {Phaser.Group}
 */
GameWorldManager.prototype.getPlatformsGroup = function(){
    return this.platforms;
};

/**
 * Function that returns GameWorldManagers Obstacles Phaser Group object which holds all the wall objects.
 * This allows for it to be looped through and checked for collisions outside of the GameWorldManager
 * @public
 * @function
 * @returns {Phaser.Group}
 */
GameWorldManager.prototype.getObstaclesGroup = function(){
    return this.obstacles;
};

/**
 * Function that returns GameWorldManagers FloorAndRoof Phaser Group object which holds all the wall objects.
 * This allows for it to be looped through and checked for collisions outside of the GameWorldManager
 * @public
 * @function
 * @returns {Phaser.Group}
 */
GameWorldManager.prototype.getFloorAndRoofGroup = function(){
    return this.floorAndRoof;
};

/**
 * Function that "freezes" all the currently held WorldObjects in GameWorldManager by setting there x velocity to 0
 * @public
 * @function
 */
GameWorldManager.prototype.freezeWorld = function(){
    // loops through all the game objects and sets there velocity to 0 so everything stops moving
    for(i = 0; i < this.platforms.length; i++){
        current = this.platforms.getAt(i);
        current.body.velocity.x = 0;
    }

    for(i = 0; i < this.obstacles.length; i++){
        current = this.obstacles.getAt(i);
        current.body.velocity.x = 0;
    }

    for(i = 0; i < this.walls.length; i++){
        current = this.walls.getAt(i);
        current.body.velocity.x = 0;
    }

    for(i = 0; i < this.floorAndRoof.length; i++){
        current = this.floorAndRoof.getAt(i);
        current.body.velocity.x = 0;
    }
};

/**
 * Function that resets all the GameWorldManagers WorldObjects by destroying all the currently held group
 * objects. And then re-randomizes there positions and call create to recreate them.
 * @public
 * @function
 */
GameWorldManager.prototype.reset = function(){
    // destroy all the Phaser objects in each group
    this.walls.destroy(true);
    this.platforms.destroy(true);
    this.obstacles.destroy(true);
    this.floorAndRoof.destroy(true);

    // randomize new positions
    this.wallPositions =  this.wallRandomizer(80, 400);
    this.platformPositions = this.platformRandomizer(100, 400);
    this.obstaclePositions = this.obstacleRandomizer(30, 448);
    this.floorAndRoofPositions = this.floorAndRoofPlacement(480);

    this.create();
};

/**
 * Function that updates all the WorldObjects Phaser Group's updates there x position constantly incase of speed boosts and repositions all of
 * them when they go off screen
 * @param {number} playerVelocityX - value that dictates the speed the world moves towards the player at should be the players current velocity on the X
 * @public
 * @function
 */
GameWorldManager.prototype.update = function(playerVelocityX){

    // goes through all the obstacles resets them if there off the left side of the screen
    // and updates its X velocity (needs to be done each loop incase the player boosts and increases
    // there velocity)
    for(var i = 0; i < this.obstacles.length; i++)
    {
        var current = this.obstacles.getAt(i);

        // if its off the left side of the screen
        if(current.position.x <= -80)
        {
            // randomize the obstacle, similar to the obstaclesRandomiation function except that it bases
            // the minimum position off the last position of the newest positioned wall(wallIterator)
            var ranMax, ranMin;
            ranMin = this.walls.getAt(this.wallIterator).position.x + this.obstacleWidth + Math.floor(this.obstaclesIterator / 2) * this.spaceBetweenWalls / (this.obstaclesPerRoom / 2);
            ranMax = ranMin + (this.spaceBetweenWalls / this.obstaclesPerRoom) - (this.obstacleWidth + this.wallHalfWidth);

            this.obstaclesIterator++;

            // sets obstacle iterator to 0 once it reaches 8 i.e do the top obstacle placement then bottom of the
            // section and then reset to replace them all again
            if(this.obstaclesIterator >= this.obstaclesPerRoom)
                this.obstaclesIterator = 0;

            // randomize its x position
            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
        }

        // set the obstacles phaser physics velocity to our players -ve x velocity to make
        // objects move towards the player.
        current.body.velocity.x = -playerVelocityX;
    }

    // just calculating it out here so it only gets done once
    var spaceBetweenObjects = this.wallHalfWidth + (this.platformWidth / 2);

    // loops through the platforms positions them if they go off screen and sets
    // there velocity to the inverse of the players (we're not moving the player
    // in the world, we're moving the world to the player, makes life easier whilst
    // keeping accurate physics)
    for(i = 0; i < this.platforms.length; i++){
        current = this.platforms.getAt(i);

        // randomize the platforms, similar to the platformRandomiation function except that it bases
        // the minimum position off the last position of the newest positioned wall(wallIterator)
        if(current.position.x <= -80){
            ranMin = this.walls.getAt(this.wallIterator).position.x  + spaceBetweenObjects + (this.platformIterator * this.spaceBetweenWalls / this.platformPerRoom);
            ranMax = ranMin + (800 - ((spaceBetweenObjects * 2) + ((this.platformWidth / 2) * ((this.platformPerRoom * 2) - 2)))) / this.platformPerRoom;

            this.platformIterator++;

            // resets the iterator to 0 as we're positioning them on a per room basis from the wall
            if(this.platformIterator >= this.platformPerRoom)
                this.platformIterator = 0;

            current.position.x = game.rnd.integerInRange(ranMin, ranMax);
            current.position.y = game.rnd.integerInRange(100, 400);
        }

        current.body.velocity.x = -playerVelocityX;
    }

    // loops through the walls positions them if they go off screen and sets
    // there velocity to the inverse of the players (we're not moving the player
    // in the world, we're moving the world to the player, makes life easier whilst
    // keeping accurate physics)
    for(i = 0; i < this.walls.length-1; i++){
        current = this.walls.getAt(i);
        // gets the the last wall the 4th which we never place on its own
        // we always place it alongside another wall
        var lastWall = this.walls.getAt(3);

        // works similar to the WallRandomization function
        if(current.position.x <= -80){
            current.position.x = this.spaceBetweenWalls * (this.wallCount - this.doubleWalls); // furthest away point on the x where the walls can spawn

            this.wallIterator = i; // the wall iterator is the last known wall to be positioned so we can
            // place all other world objects from it

            // choose the walls side based on the outcome of the randomizer I.E top or bottom
            if(game.rnd.integerInRange(1, 1000) % 2 == 0){
                current.position.y = 80;
            }else{
                current.position.y = 400;
            }

            // check if the 4th wall is off the screen if it is randomly check if we wish
            // to place the 4th wall alongside the current wall to make a double sided blockade
            // of walls
            if(lastWall.position.x <= -80 && game.rnd.integerInRange(1, 1000) % 2 == 0){
                lastWall.position.x = current.position.x;

                if(current.position.y == 80){
                    lastWall.position.y = 400;
                }else{
                    lastWall.position.y = 80;
                }
            }
        }

        // assign both the 4th wall and current wall the players -ve velocity
        current.body.velocity.x = -playerVelocityX;
        lastWall.body.velocity.x = -playerVelocityX;
    }

    // loops through the floor and roof tiles and positions them one after the other as
    // they drop off of the left hand side of the screen. Unfortunately just adding them onto the end
    // of the screen width sadly makes the tiles positioning gradually break apart as we boost
    // hence the slightly more complex positioning after the last known tile on the far right
    for(i = 0; i < this.floorAndRoof.length; i++){
        current = this.floorAndRoof.getAt(i);

        if(current.position.x <= -80){
            // basically just finds us the floor/roof piece to the "left" of the current one
            var previous;
            if(i != 0 && i != this.floorAndRoof.length / 2)
                previous = this.floorAndRoof.getAt(i-1);
            else if(i < this.floorAndRoof.length / 2)
                previous = this.floorAndRoof.getAt(this.floorAndRoof.length/2-1);
            else
                previous = this.floorAndRoof.getAt(this.floorAndRoof.length-1);

            current.position.x = previous.position.x + previous.width;
        }

        current.body.velocity.x = -playerVelocityX;
    }
};

/**
 * Function that randomizes the platforms positions based off all of the GameWorldManagers passed in platform values
 * @param {number} maxHeight - the maximum height to position the platforms (it should be a low value in phaser lower is higher)
 * @param {number} minHeight - the minimum height to position the platforms (it should be a high value in phaser higher is lower)
 * @public
 * @function
 */
GameWorldManager.prototype.platformRandomizer = function(maxHeight, minHeight){
    var positions = [];

    // space required to seperate the two objects from each others center
    // i.e the wall and platform MUST be this apart to be outside of each other
    var spaceBetweenObjects = this.wallHalfWidth + (this.platformWidth / 2);

    for(var i = 0; i < this.platformCount; i++)
    {
        // essentially all the maths is to position the platforms between the walls and not inside them
        // distance till next wall = spaceBetweenWalls / platformsPerRoom * the iterator to increment it
        // + spaceBetweenObjects is to make sure it doesn't end up in at least the first wall & the math at the ranMax is to get
        // the space inbetween that we can randomize the platform so that it's not inside another platform and not inside a wall (works for the most part
        // has occasional difficulty with the walls on the right of the platforms)
        var ranMin = this.spaceBetweenWalls + spaceBetweenObjects + (i * this.spaceBetweenWalls / this.platformPerRoom);
        var ranMax = ranMin + (this.spaceBetweenWalls - ((spaceBetweenObjects * 2) + ((this.platformWidth / 2) * ((this.platformPerRoom* 2) - 2)))) / this.platformPerRoom;

        positions[i] = [];
        positions[i][0] = this.game.rnd.integerInRange(ranMin, ranMax);
        positions[i][1] = this.game.rnd.integerInRange(maxHeight, minHeight);
    }

    return positions;
};

/**
 * Function that randomizes the obstacle positions based off all of the GameWorldManagers passed in obstacle values
 * @param {number} topPosition - place to position the Obstacles on the top row (it should be a low value in phaser lower is higher)
 * @param {number} bottomPosition - place to position the Obstacles on the bottom row (it should be a high value in phaser higher is lower)
 * @public
 * @function
 */
GameWorldManager.prototype.obstacleRandomizer = function(topPosition, bottomPosition){

    var positionsAndRotations = [];
    var currentArrayPos = 0; // used as the first dimension iterator in the array below, unable to use i2 and i as there used for other things
    // space required to seperate the two objects from each others center
    // i.e the wall and platform MUST be this apart to be outside of each other
    var spaceBetweenObjects = this.wallHalfWidth + (this.obstacleWidth / 2);

    for(var i2 = 0; i2 < 2; i2++)
        for(var i = 0; i < this.obstacleCount / 2; i++)
        {
            // same idea as above except the ranMax maths is slightly different and we divide the obstacles per room by two as we position
            // half on the roof and half on the floor. The ranMax basically just gets the available space for each object between the two walls
            // and then negates the width of the wall and obstacle from it to get the "true" available space to that obstacle without it
            // touching another
            var ranMin = this.spaceBetweenWalls + spaceBetweenObjects + (i * this.spaceBetweenWalls / (this.obstaclesPerRoom / 2));
            var ranMax = ranMin + (this.spaceBetweenWalls / this.obstaclesPerRoom) - (this.obstacleWidth + this.wallHalfWidth);

            //(the spikes are centered so to avoid overlaps we must leave a space of 16 for each spike inbetween)
            positionsAndRotations[currentArrayPos] = []; // making the ith position an array as well making obstaclePositions a 2d array
            positionsAndRotations[currentArrayPos][0] = this.game.rnd.integerInRange(ranMin, ranMax); // setting positions


            if(i2 == 0){ // i2 = 0 is the top set of obstacles, i2 = 1 is the bottom set of obstacles
                positionsAndRotations[currentArrayPos][1] = topPosition;  // y position
                positionsAndRotations[currentArrayPos][2] = 180; // rotation
            } else {
                positionsAndRotations[currentArrayPos][1] = bottomPosition; // y position
                positionsAndRotations[currentArrayPos][2] = 0;   // rotation
            }
            currentArrayPos++;
        }

    return positionsAndRotations;
};

/**
* Function that randomizes and places the wall positions based off all of the GameWorldManagers passed in wall values, slightly less random than the
* other functions as the Obstacles and Platforms are based from the walls positions on the X
* @param {number} topPosition - place to position the walls that are on the roof or highest point (it should be a low value in phaser lower is higher)
* @param {number} bottomPosition - place to position the Walls that are on the floor or lowest point (it should be a high value in phaser higher is lower)
* @public
* @function
*/
GameWorldManager.prototype.wallRandomizer = function(topPosition, bottomPosition){
    // we have 4 wall pieces in play at all times, 1 set of 2 walls(bit on floor and roof)
    // and 2 sets of one wall randomly placed on the roof or floor and we space them all 800 apart
    // so the whole placement of the objects is based on the idea of the space between each wall
    // being a "room"
    positions = [];

    for(i = 0; i < this.wallCount; i++){
        positions[i] = [];

        // number of double walls detracts from the total wall count double walls are just essentially walls that
        // get doubled up on the same X, one on the top and one on the bottom.
        if(i < this.wallCount-this.doubleWalls){
            positions[i][0] = 800 + (i * this.spaceBetweenWalls); // set walls x position which is just the iterator * the space between walls

            // randomly choose if its on the roof or floor based on a modulus remainder from
            // 1 to 1000
            if(game.rnd.integerInRange(1, 1000) % 2 == 0){
                positions[i][1] = topPosition;
            }
            else{
                positions[i][1] = bottomPosition;
            }
        }else{  // this chooses where we'll put our 4th wall so we have a "double wall" where we can only go through the centre
            var randPlace = (this.game.rnd.integerInRange(1, 1000) % (this.wallCount - this.doubleWalls));
            positions[i][0] = 800 + (randPlace * this.spaceBetweenWalls); // position its x in one of our previous walls x areas

            // checks what the wall at the current x positions y is and
            // then sets it to the opposite of the current wall
            if(positions[randPlace][1] == 400){
                positions[i][1] = topPosition;
            }else{
                positions[i][1] = bottomPosition;
            }
        }
    }

    return positions;
};

/**
 * Function that positions the roof and floor sprites, not random just positions them one after the other
 * @param {number} floorMin - place to position the floor tiles, roof tiles are positioned at 0 (it should be a low value in phaser lower is higher)
 * @public
 * @function
 */
GameWorldManager.prototype.floorAndRoofPlacement = function(floorMin){
    // positions for the floor and roof bricks based on there center point
    var positions = [];
    var currentArrayPos = 0;
    for(i2 = 1; i2 > -1; i2--)
        for(i = 1; i < 10; i++)
        {
            positions[currentArrayPos] = [];
            positions[currentArrayPos][0] = (i * this.floorWidth)- this.floorWidth/2; // X, each floor piece get its position and then we negate half its width to get the position based off its center
            positions[currentArrayPos][1] = i2 * floorMin; // Y, if i2 is one its a floor piece
            currentArrayPos++;
        }

    return positions;
};