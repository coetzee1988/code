var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var lives;
var flagpole;

var jumpSound;
var fallingSound;
var backgroundMusic;
var collectSound;
var gameOverSound;
var winSound;
var hurtSound;

var platforms;
var isContact;

var enemies;

var c1;
var c2;

function preload()
{
    soundFormats('mp3','wav');
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    fallingSound = loadSound('assets/fall.mp3');
    fallingSound.setVolume(0.1);
    
    collectSound = loadSound('assets/collect.wav');
    collectSound.setVolume(0.5);
    
    backgroundMusic = loadSound('assets/bensound-adventure.mp3');
    backgroundMusic.setVolume(0.05);
    
    gameOverSound = loadSound('assets/Game over1.mp3')
    gameOverSound.setVolume(0.3);
    
    winSound = loadSound('assets/win.wav')
    winSound.setVolume(0.1);
    
    hurtSound = loadSound('assets/hurt.wav')
    hurtSound.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    backgroundMusic.play();
    
    startGame();
}

function draw()
{ 
    c1 = color(0,191,255);
    c2 = color(255, 204, 230);
    setGradient (c1,c2);
    
    fill(255,255,0,80);
    noStroke();
    ellipse(width/2, height/2 +30, 400);
    
    push();
    translate(scrollPos,0);
    
    //Draw background mountains
    drawBackgroundMountains();
    
    pop();
    
	// draw some green ground
    noStroke();
	fill(0,155,0,250);
	rect(0, floorPos_y, width, height/4); 
    
    fill(238, 130, 238, 100);
    rect(0, 570, width, 5);
    
    push();
    translate(scrollPos,0);
    
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
    
	// Draw trees and bubblegum
    secondTrees();
    drawTrees();
    drawBubblegum();
    
    //draw cookies
    drawCookies();

	// Draw canyons.
    for (var i = 0; i< canyon_x.length; i++)
        {
            drawCanyon(canyon_x[i]);
            checkCanyon(canyon_x[i]);
        }
    
    //Draw platforms
    for (var i = 0; i <platforms.length; i++)
        {
            platforms[i].draw();
        }
    

	// Draw collectable items.   
    for (var i = 0; i < collectables.length; i++)
        {
            if (collectables[i].isFound == false)
              {
                 drawCollectable(collectables[i]);
                 checkCollectable(collectables[i]);
              }
            
            if (collectables[i].isFound == true)
              {
                 //
              }
        } 
    
    renderFlagpole();
    
    //Draw enemies
    for (var i=0; i < enemies.length; i++)
        {
            var contactThere = false;
            
            enemies[i].draw();
            
            var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
            
            if (isContact)
                {
                    lives -= 1;
                    startGame();
                    contactThere = true;
                }
            
            if (contactThere == true)
                {
                    hurtSound.play();
                }
            
        }
    
    pop();

	// Draw game character.
	drawGameChar();
    
    // Draw Score to screen.
    fill(10,10,10);
    noStroke();
    textSize(15);
    text("Score: " + game_score, 20, 20);
    
    // Draw Lives to screen
    text("Lives: ", 20, 40);
    checkPlayerDie();
    
    if (lives == 0)
        {
            fill(0);
            stroke(255,0,0);
            textSize(50);
            text("Game Over", width/2 -140, height/2);
            textSize(40);
            text("Press Space to Continue", width/2 -220, height/2 + 60);
            textSize(15);
        }
    
    if (lives == 0 && keyCode == 32)
                {
                    startGame();
                    lives = 3;
                }
   
    if (flagpole.isReached == true)
        {
            fill(0);
            stroke(255,255,0);
            textSize(50);
            text("Level Complete", width/2 -140, height/2);
            textSize(40);
            text("Press Space to Continue", width/2 -190, height/2 + 60); 
            textSize(15);        
        }
    
     if (flagpole.isReached == true && keyCode == 32)
        { 
            startGame();
            lives = 3;
        }
    


	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
        if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
    }

	if(isRight)
	{ 
		  if(gameChar_x < width * 0.8)
          {
		  	gameChar_x  += 5;
		  }
		  else
		  {
		  	scrollPos -= 5;
		  }
	}
    
    // Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++)
           {
               if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
               {
                   isContact = true;
                   isFalling = false;
                   break;
               }
           }
        
        if(isContact == false)
            {
                gameChar_y += 3;
                isFalling = true;
            }
    }
    else
    {
        isFalling = false;
    }
    
    if(flagpole.isReached == false)
        {
             checkFlagpole();
        }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;  
    
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2;
    bubblegum_y = height/2 + 135;
    cloud = {y_pos: 0, size: 50};
    mountain = {x_pos: -10, y_pos: 1.5, size: 100};
    
    canyon = {y_pos: 0, width:100};
    collectable = {y_pos: 100, size:50};
    
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isPlummeting = false;
    isFalling = false;
    isContact = false;
    
	// Initialise arrays of scenery objects.
    trees_x = [-700, 100, 450, 1000, 1500];
    clouds_x = [-1000, -200, 100, 500, 1000, 1500];
    
    bubblegum_x = [-750, 100, 400, 900, 1550];
    bubblegum2_x = [-725, 75, 425, 875, 1525];
    bubblegum3_x = [-790, 50, 500, 700, 1400];
    
    mountains1_x = [-1000, -50, 650];
    mountains2_x = [-950, 0, 700];
    mountains3_x = [-975, -25, 675];
    
    mountainsbackground_x1 = [-1100, 0, 750, 1500];
    mountainsbackground_x2 = [-800, -200, 550, 1700];
    
    canyon_x = [-1100, 0, 1500];
    collectables = [{pos_x:-950, isFound:false}, 
                    {pos_x:-300, isFound:false},
                    {pos_x:-500, pos_y:300, isFound:false},
                    {pos_x:400, isFound:false},
                    {pos_x:1500, isFound:false}];
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 2000};
    
    platforms = [];
    platforms.push(createPlatforms(-150,floorPos_y- 90,100));
    platforms.push(createPlatforms(775,floorPos_y- 90,100));
    
    enemies=[];
    enemies.push(new Enemy(-350, floorPos_y -30, 120));
    enemies.push(new Enemy(-25, floorPos_y -30, 80));
    enemies.push(new Enemy(850, floorPos_y -30, 150));
    enemies.push(new Enemy(1100, floorPos_y -30, 100));
       
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if (keyCode == 32)
        {
            jumpSound.play();
        }
    
    console.log(keyCode);
    
    if (keyCode == 37) //left arrow
        {
            isLeft = true;
        }
    
    else if (keyCode == 39) //right arrow
        {
            isRight = true;
        }
    
    if (keyCode ==32 && gameChar_y == floorPos_y) //spacebar
        {
            isFalling = true;
            gameChar_y -= 102;
        }
    
}

function keyReleased()
{
    
     if (keyCode == 37) //left arrow
        {
            isLeft = false;
        }
    
    else if (keyCode == 39) //right arrow
       {
           isRight = false;
        }
     
     if (keyCode ==32 && gameChar_y < floorPos_y) //spacebar
        {
            isFalling = true;
        }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
	 //Jumping Left
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -52, 35, 30);
     ellipse(gameChar_x, gameChar_y -52, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x -7, gameChar_y -38, 10, 15);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x -5, gameChar_y -38, 2, 2);
     ellipse(gameChar_x -7, gameChar_y -41, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x, gameChar_y -28, 9, 4);
     strokeWeight(1);
     fill(0,0,0);
     ellipse(gameChar_x -14, gameChar_y -28, 7, 9);
     fill(255,192,203);
     ellipse(gameChar_x -14, gameChar_y -26, 5, 4);
    
     //Arms and Legs
     //Arms
     strokeWeight(1);
     stroke(0,0,0);
     line(gameChar_x +15, gameChar_y -35, gameChar_x +5, gameChar_y -35);
     line(gameChar_x -18, gameChar_y -37, gameChar_x -23, gameChar_y -37);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +5, gameChar_y -35, 3, 3);
     ellipse(gameChar_x -24, gameChar_y -37, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +6, gameChar_y -21, gameChar_x +13, gameChar_y -14);
     line(gameChar_x -5, gameChar_y -21, gameChar_x -10, gameChar_y -16);
     line(gameChar_x -10, gameChar_y -16, gameChar_x -3, gameChar_y -14);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +13, gameChar_y -14, 3, 3);
     ellipse(gameChar_x -3, gameChar_y -14, 3, 3);

	}
	else if(isRight && isFalling)
	{
     //Jumping Right 
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -52, 35, 30);
     ellipse(gameChar_x, gameChar_y -52, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x +7, gameChar_y -38, 10, 15);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x +5, gameChar_y -38, 2, 2);
     ellipse(gameChar_x +7, gameChar_y -41, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x, gameChar_y -28, 9, 4);
     strokeWeight(1);
     fill(0,0,0);
     ellipse(gameChar_x +14, gameChar_y -28, 7, 9);
     fill(255,192,203);
     ellipse(gameChar_x +14, gameChar_y -26, 5, 4);
    
     //Arms and Legs
     //Arms
     strokeWeight(1.5);
     stroke(0,0,0);
     line(gameChar_x +18, gameChar_y -37, gameChar_x +23, gameChar_y -37);
     line(gameChar_x -15, gameChar_y -35, gameChar_x -5, gameChar_y -35);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +25, gameChar_y -37, 3, 3);
     ellipse(gameChar_x -5, gameChar_y -35, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x -6, gameChar_y -21, gameChar_x -13, gameChar_y -14);
     line(gameChar_x +5, gameChar_y -21, gameChar_x +10, gameChar_y -16);
     line(gameChar_x +10, gameChar_y -16, gameChar_x +3, gameChar_y -14);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x -13, gameChar_y -14, 3, 3);
     ellipse(gameChar_x +3, gameChar_y -14, 3, 3);

	}
	else if(isLeft)
	{
     //Walking left
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -40, 35, 30);
     ellipse(gameChar_x, gameChar_y -40, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x -11, gameChar_y -26, 10, 14);
     ellipse(gameChar_x +4, gameChar_y -26, 10, 14);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x -7, gameChar_y -26, 2, 2);
     ellipse(gameChar_x +8, gameChar_y -26, 2, 2);
     ellipse(gameChar_x -9, gameChar_y -29, 4, 4);
     ellipse(gameChar_x +6, gameChar_y -29, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x +6, gameChar_y -16, 9, 4);
     ellipse(gameChar_x -12, gameChar_y -16, 9, 4);
     noFill();
     strokeWeight(1);
     stroke(0,0,0);
     bezier(gameChar_x, gameChar_y -18, 
            gameChar_x -1, gameChar_y -13, 
            gameChar_x -5, gameChar_y -12, 
            gameChar_x -6, gameChar_y -18);
    
     //Arms and Legs
     //Arms
     strokeWeight(1.5);
     line(gameChar_x +16, gameChar_y -25, gameChar_x+15, gameChar_y -21);
     line(gameChar_x +15, gameChar_y -21, gameChar_x+10, gameChar_y -18);
     line(gameChar_x -18, gameChar_y -25, gameChar_x -20, gameChar_y -18);
     line(gameChar_x -20, gameChar_y -18, gameChar_x -25, gameChar_y -20);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +10, gameChar_y -18, 3, 3);
     ellipse(gameChar_x -25, gameChar_y -20, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +6, gameChar_y -9, gameChar_x +6, gameChar_y -4);
     line(gameChar_x +6, gameChar_y -4, gameChar_x +10, gameChar_y -1);
     line(gameChar_x -5, gameChar_y -9, gameChar_x -5, gameChar_y);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +10, gameChar_y -1, 3, 3);
     ellipse(gameChar_x -5, gameChar_y, 3, 3);
 	 }
    
	else if(isRight)
	 {
     //Walking right
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -40, 35, 30);
     ellipse(gameChar_x, gameChar_y -40, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x -4, gameChar_y -26, 10, 14);
     ellipse(gameChar_x +11, gameChar_y -26, 10, 14);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x -8, gameChar_y -26, 2, 2);
     ellipse(gameChar_x + 7, gameChar_y -26, 2, 2);
     ellipse(gameChar_x -6, gameChar_y -29, 4, 4);
     ellipse(gameChar_x +9, gameChar_y -29, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x +12, gameChar_y -16, 9, 4);
     ellipse(gameChar_x -6, gameChar_y -16, 9, 4);
     noFill();
     strokeWeight(1);
     stroke(0,0,0);
     bezier(gameChar_x +6, gameChar_y -18, 
            gameChar_x +5,  gameChar_y -13, 
            gameChar_x +1, gameChar_y -13, 
            gameChar_x, gameChar_y -18);
    
     //Arms and Legs
     //Arms
     strokeWeight(1.5);
     line(gameChar_x +18, gameChar_y -25, gameChar_x+20, gameChar_y -19);
     line(gameChar_x +20, gameChar_y -19, gameChar_x+25, gameChar_y -20.7);
     line(gameChar_x -16, gameChar_y -25, gameChar_x -15, gameChar_y -21);
     line(gameChar_x -15, gameChar_y -21, gameChar_x -10, gameChar_y -18);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +25, gameChar_y -20.7, 3, 3);
     ellipse(gameChar_x -10, gameChar_y -18, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +6, gameChar_y -9, gameChar_x +6, gameChar_y);
     line(gameChar_x -5, gameChar_y -4, gameChar_x -9, gameChar_y -1);
     line(gameChar_x -5, gameChar_y -9, gameChar_x -5, gameChar_y -4);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x -9, gameChar_y -1, 3, 3);
     ellipse(gameChar_x +6, gameChar_y, 3, 3);    

	}
	else if(isPlummeting || isFalling)
	{
     //Jumping front facing  
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -42, 35, 30);
     ellipse(gameChar_x, gameChar_y -42, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x -9, gameChar_y -28, 10, 15);
     ellipse(gameChar_x +9, gameChar_y -28, 10, 15);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x -7, gameChar_y -28, 2, 2);
     ellipse(gameChar_x +11, gameChar_y -28, 2, 2);
     ellipse(gameChar_x -9, gameChar_y -31, 4, 4);
     ellipse(gameChar_x +9, gameChar_y -31, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x +12, gameChar_y -18, 9, 4);
     ellipse(gameChar_x -12, gameChar_y -18, 9, 4);
     strokeWeight(1);
     fill(0,0,0);
     ellipse(gameChar_x, gameChar_y -18, 7, 9);
     fill(255,192,203);
     ellipse(gameChar_x, gameChar_y -16, 5, 4);
    
     //Arms and Legs
     //Arms
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +18, gameChar_y -27, gameChar_x +23, gameChar_y -40);
     line(gameChar_x -18, gameChar_y -27, gameChar_x -23, gameChar_y -40);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +23, gameChar_y -40, 3, 3);
     ellipse(gameChar_x -23, gameChar_y -40, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +6, gameChar_y -11, gameChar_x +8, gameChar_y -6);
     line(gameChar_x -5, gameChar_y -11, gameChar_x -8, gameChar_y -6);
     line(gameChar_x +8, gameChar_y -6, gameChar_x +4, gameChar_y -2);
     line(gameChar_x -8, gameChar_y -6, gameChar_x -4, gameChar_y -2);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +4, gameChar_y -2, 3, 3);
     ellipse(gameChar_x -4, gameChar_y -2, 3, 3);
 	}
    
	else 
	{
     //standing facing forwards    
     //Body
     stroke(0,0,0);
     strokeWeight(1);
     fill(255,255,255);
     rect(gameChar_x -18, gameChar_y -40, 35, 30);
     ellipse(gameChar_x, gameChar_y -40, 35, 12);
    
     //Eyes
     fill(0,0,0);
     ellipse(gameChar_x -9, gameChar_y -26, 10, 15);
     ellipse(gameChar_x +9, gameChar_y -26, 10, 15);
     noStroke();
     fill(255,255,255);
     ellipse(gameChar_x -7, gameChar_y -26, 2, 2);
     ellipse(gameChar_x +11, gameChar_y -26, 2, 2);
     ellipse(gameChar_x -9, gameChar_y -29, 4, 4);
     ellipse(gameChar_x +9, gameChar_y -29, 4, 4);
    
     //Mouth and cheeks
     fill(255,192,203);
     ellipse(gameChar_x +12, gameChar_y -16, 9, 4);
     ellipse(gameChar_x -12, gameChar_y -16, 9, 4);
     noFill();
     strokeWeight(1);
     stroke(0,0,0);
     bezier(gameChar_x +4, gameChar_y -18, 
            gameChar_x +5, gameChar_y -12, 
            gameChar_x -5, gameChar_y -12, 
            gameChar_x -4, gameChar_y -18);
    
     //Arms and Legs
     //Arms
     strokeWeight(1.5);
     line(gameChar_x +18, gameChar_y -25, gameChar_x +23, gameChar_y -15);
     line(gameChar_x -18, gameChar_y -25, gameChar_x -23, gameChar_y -15);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +23, gameChar_y -15, 3, 3);
     ellipse(gameChar_x -23, gameChar_y -15, 3, 3);

     //Legs
     stroke(0,0,0);
     strokeWeight(1.5);
     line(gameChar_x +6, gameChar_y -9, gameChar_x +6, gameChar_y);
     line(gameChar_x -5, gameChar_y -9, gameChar_x -5, gameChar_y);
     noStroke();
     fill(0,0,0);
     ellipse(gameChar_x +6, gameChar_y, 3, 3);
     ellipse(gameChar_x -5, gameChar_y, 3, 3);
	}

}


// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    var incr = 2;
    
    for(var i =0; i < clouds_x.length; i++)
    { 
      fill(255, 230, 234)
      ellipse(clouds_x[i] +150, cloud.y_pos +155, cloud.size +35);
      ellipse(clouds_x[i] +100, cloud.y_pos +175, cloud.size);
      ellipse(clouds_x[i] +200, cloud.y_pos +175, cloud.size);
      rect(clouds_x[i] +96, cloud.y_pos +165, cloud.size +57, cloud.size -15);
    
      ellipse(clouds_x[i] +300, cloud.y_pos +35, cloud.size +30);
      ellipse(clouds_x[i] +250, cloud.y_pos +50, cloud.size);
      ellipse(clouds_x[i] +350, cloud.y_pos +50, cloud.size);
      rect(clouds_x[i] +250, cloud.y_pos +40, cloud.size +57, cloud.size -15);
        
     clouds_x +=incr;
    
    }
    
    
}

// Function to draw mountains objects.
function drawMountains()
{
  for(var i = 0; i< mountains1_x.length; i++)   
   {
       
    stroke(218,165,32);
    fill(255,204,0);
    triangle(mountains1_x[i] +625, mountain.y_pos +200, 
             mountains1_x[i] +765, mountain.y_pos +430, 
             mountains1_x[i] +480, mountain.y_pos +430);
    fill(255,140,0);
    triangle(mountains1_x[i] +625, mountain.y_pos +200, 
             mountains1_x[i] +716, mountain.y_pos +350, 
             mountains1_x[i] +532, mountain.y_pos +350);
    
    fill(255,215,0);
    triangle(mountains2_x[i] +700, mountain.y_pos +250, 
             mountains2_x[i] +800, mountain.y_pos +430, 
             mountains2_x[i] +590, mountain.y_pos +430);
    fill(255,165,0);
    triangle(mountains2_x[i] +700, mountain.y_pos +250, 
             mountains2_x[i] +772, mountain.y_pos +380, 
             mountains2_x[i] +620, mountain.y_pos +380);
    
    fill(255,223,0);
    triangle(mountains3_x[i] +620, mountain.y_pos +310, 
             mountains3_x[i] +690, mountain.y_pos +430, 
             mountains3_x[i] +545, mountain.y_pos +430);
    fill(255, 191, 0)
    triangle(mountains3_x[i] +620, mountain.y_pos +310, 
             mountains3_x[i] +677, mountain.y_pos +410, 
             mountains3_x[i] +559, mountain.y_pos +410);
    
    //snow on the mountains
    //biggest mountain
    noStroke();
    fill(255, 255, 255);
    triangle(mountains1_x[i] +625, mountain.y_pos +200, 
             mountains1_x[i] +668, mountain.y_pos +270, 
             mountains1_x[i] +581, mountain.y_pos +270);
    
    fill(255,140,0);
    triangle(mountains1_x[i] +605, mountain.y_pos +250, 
             mountains1_x[i] +620, mountain.y_pos +270, 
             mountains1_x[i] +581, mountain.y_pos +270);
    triangle(mountains1_x[i] +630, mountain.y_pos +250, 
             mountains1_x[i] +650, mountain.y_pos +270, 
             mountains1_x[i] +601, mountain.y_pos +270);
    triangle(mountains1_x[i] +618, mountain.y_pos +250, 
             mountains1_x[i] +650, mountain.y_pos +270, 
             mountains1_x[i] +601, mountain.y_pos +270);
    triangle(mountains1_x[i] +645, mountain.y_pos +250, 
             mountains1_x[i] +668, mountain.y_pos +270, 
             mountains1_x[i] +610, mountain.y_pos +270);
    rect(mountains1_x[i] +584, mountain.y_pos +267, 80, 15)
    
    //medium mountain
    fill(255, 255, 255);
    triangle(mountains2_x[i] +700, mountain.y_pos +250, 
             mountains2_x[i] +733, mountain.y_pos +310,
             mountains2_x[i] +663, mountain.y_pos +310);
    fill(255,165,0);
    triangle(mountains2_x[i] +675, mountain.y_pos +300, 
             mountains2_x[i] +690, mountain.y_pos +320, 
             mountains2_x[i] +655, mountain.y_pos +324);
    triangle(mountains2_x[i] +700, mountain.y_pos +300, 
             mountains2_x[i] +720, mountain.y_pos +320, 
             mountains2_x[i] +671, mountain.y_pos +320);
    triangle(mountains2_x[i] +688, mountain.y_pos +300,
             mountains2_x[i] +720, mountain.y_pos +320, 
             mountains2_x[i] +671, mountain.y_pos +320);
    triangle(mountains2_x[i] +715, mountain.y_pos +300, 
             mountains2_x[i] +738, mountain.y_pos +320, 
             mountains2_x[i] +680, mountain.y_pos +321);
    
    //smallest mountain
    fill(255, 255, 255);
    triangle(mountains3_x[i] +620, mountain.y_pos +310, 
             mountains3_x[i] +641, mountain.y_pos +349,
             mountains3_x[i] +596, mountain.y_pos +349);
    fill(255, 191, 0);
    triangle(mountains3_x[i] +605, mountain.y_pos +340, 
             mountains3_x[i] +615, mountain.y_pos +360,
             mountains3_x[i] +590, mountain.y_pos +364);
    triangle(mountains3_x[i] +625, mountain.y_pos +340, 
             mountains3_x[i] +645, mountain.y_pos +360, 
             mountains3_x[i] +596, mountain.y_pos +360);
    triangle(mountains3_x[i] +613, mountain.y_pos +340, 
             mountains3_x[i] +645, mountain.y_pos +360, 
             mountains3_x[i] +596, mountain.y_pos +360);
    triangle(mountains3_x[i] +634, mountain.y_pos +340, 
             mountains3_x[i] +645, mountain.y_pos +360, 
             mountains3_x[i] +600, mountain.y_pos +361);
    } 
}

//Function for background mountains
function drawBackgroundMountains()
{
    for (var i = 0; i < mountainsbackground_x1.length; i++)
        {
    noStroke();
    fill(60, 115, 215);
    triangle(mountainsbackground_x1[i] +250, mountain.y_pos +200, 
             mountainsbackground_x1[i], 576, 
             mountainsbackground_x1[i] +500, 576);
        }
    
     for (var i = 0; i < mountainsbackground_x2.length; i++)
        {
    noStroke();
    fill(60, 115, 215);
    triangle(mountainsbackground_x2[i] +250, mountain.y_pos +300, 
             mountainsbackground_x2[i], 576, 
             mountainsbackground_x2[i] +500, 576);
        }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {      
    fill(51, 12, 0);
    rect(trees_x [i] +21, 350, 15, 83);
    rect(trees_x[i]-72, 378, 15, 55);

    fill(255,20,147,200);
    ellipse(trees_x[i] +28,treePos_y +34,40);
    ellipse(trees_x[i] +3,treePos_y +64,40);
    ellipse(trees_x[i] +13,treePos_y +44,40);
    ellipse(trees_x[i] +43,treePos_y +44,40);
    ellipse(trees_x[i] +28,treePos_y +64,40); 
    ellipse(trees_x[i] +53,treePos_y +64,40);
    
    fill(255,105,180,200);
    ellipse(trees_x[i] -62, treePos_y +62,50);
    ellipse(trees_x[i] -92, treePos_y +92,50);
    ellipse(trees_x[i] -82,treePos_y +72,50);
    ellipse(trees_x[i] -32, treePos_y +92,50); 
    ellipse(trees_x[i] -47,treePos_y +72,50); 
    ellipse(trees_x[i] -62, treePos_y +92,50);
    
    //Small hole in tree 
    fill(75,53,31);
    ellipse(trees_x -14,treePos_y +177,10,10);
    } 
}

function secondTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
    fill(255);
    rect(trees_x [i]-25, 320, 10, 112);
    
    fill(255,0,0)
    ellipse(trees_x [i] -20, 302, collectable.size +7);
        
    fill(255,255,255);
    ellipse(trees_x [i] -30, 292, collectable.size -40);
    ellipse(trees_x [i] -37, 300, collectable.size -40,collectable.size -35);
    }
}

function drawCookies()
{
    var cookies1 = [-400, -275, 0, 100, 350, 400, 600, 700, 1000, 1500];
    
    for (var i =0; i < cookies1.length; i++)
        {     
                   stroke(192, 154, 105);
                   fill(222,184,135);
                   ellipse(cookies1[i], 570, 80); 
                   
                   fill(51, 12, 0);
                   ellipse(cookies1[i] -20, 560, 10);
                   ellipse(cookies1[i] , 560 +18, 14)
                   ellipse(cookies1[i] +5 , 560 -10, 15);
                   
                   fill(109,29,9);
                   ellipse(cookies1[i] +23 , 560 +10, 12);
                   ellipse(cookies1[i] -20 , 560 -19, 12);
                   ellipse(cookies1[i] -20, 560, 10);
                    
                   noStroke();
                   ellipse(cookies1[i] +23 , 560 -18, 12);
                   ellipse(cookies1[i] , 560 -2, 13)
        }
    
}

function drawBubblegum()
{
    for (var i =0; i < bubblegum_x.length; i++)
        {
           fill(255,255,0,100);
           ellipse(bubblegum_x[i], bubblegum_y, 20);
           fill(255);
           ellipse(bubblegum_x[i] -5, bubblegum_y -5, 5);
            
        };
    for (var i =0; i < bubblegum2_x.length; i++)
        {
           fill(255,0,0,100);
           ellipse(bubblegum2_x[i], bubblegum_y, 20);
           fill(255);
           ellipse(bubblegum2_x[i] -5, bubblegum_y -5, 5);  
        }
    
    for (var i =0; i < bubblegum3_x.length; i++)
        {
           fill(0,0,255,100);
           ellipse(bubblegum3_x[i], bubblegum_y, 20);
           fill(255);
           ellipse(bubblegum3_x[i] -5, bubblegum_y -5, 5);  
        }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

function drawCanyon(t_canyon)
{
    fill(60, 115, 215);
    rect(t_canyon +150, canyon.y_pos +430, canyon.width +48, 150);
    noStroke();
    
    //spikes in the canyon
    fill(75,0,130);
    triangle(t_canyon +150, canyon.y_pos +435, 
             t_canyon +150, canyon.y_pos +480, 
             t_canyon +190, canyon.y_pos +455);
    triangle(t_canyon +150, canyon.y_pos +500, 
             t_canyon +190, canyon.y_pos +520, 
             t_canyon +150, canyon.y_pos +550);
    triangle(t_canyon +150, canyon.y_pos +580, 
             t_canyon +200, canyon.y_pos +580, 
             t_canyon +175, canyon.y_pos +540);
    triangle(t_canyon +250, canyon.y_pos +580, 
             t_canyon +210, canyon.y_pos +580, 
             t_canyon +185, canyon.y_pos +540);
    triangle(t_canyon +230, canyon.y_pos +520, 
             t_canyon +260, canyon.y_pos +590, 
             t_canyon +290, canyon.y_pos +590);
    
    fill(139,0,139);
    triangle(t_canyon +250, canyon.y_pos +580, 
             t_canyon +200, canyon.y_pos +580, 
             t_canyon +275, canyon.y_pos +540); 
    triangle(t_canyon +150, canyon.y_pos +435, 
             t_canyon +150, canyon.y_pos +480, 
             t_canyon +190, canyon.y_pos +500);
    triangle(t_canyon +150, canyon.y_pos +505, 
             t_canyon +150, canyon.y_pos +520, 
             t_canyon +190, canyon.y_pos +500);
    triangle(t_canyon +300, canyon.y_pos +580, 
             t_canyon +280, canyon.y_pos +580, 
             t_canyon +285, canyon.y_pos +560);
}

function checkCanyon(t_canyon)
{
      if (gameChar_world_x <= t_canyon +280 && gameChar_world_x >= t_canyon +153)
        {
            if(gameChar_y >= floorPos_y)
                {
                isPlummeting = true;
                gameChar_y += 6;
                isLeft = false;
                isRight = false;
                }
   
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

function drawCollectable(t_collectable)
{
    fill(0,0,0);
    rect(t_collectable.pos_x +370, collectable.y_pos +320, collectable.size -45, collectable.size -30);
    
    fill(255,0,0);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -13);
    fill(255,255,255);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -20);
    fill(255,0,0);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -27);
    fill(255,255,255);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -34);
    fill(255,0,0);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -41);
    fill(255,255,255);
    ellipse(t_collectable.pos_x +373, collectable.y_pos +302, collectable.size -48);

}

function checkCollectable(t_collectable)
{
   if(dist(gameChar_world_x +6, gameChar_y +17, t_collectable.pos_x +373, collectable.y_pos +320) <30)
        {
           t_collectable.isFound = true;
           collectSound.play();
           game_score += 1;
           
        }
}


function renderFlagpole()
{
   push()
    stroke(100);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(255,0,255);
    
    if (flagpole.isReached)
        {
         triangle(flagpole.x_pos, floorPos_y -250, flagpole.x_pos, floorPos_y -210, flagpole.x_pos +50, floorPos_y -230)
        }
    else
        {
        triangle(flagpole.x_pos, floorPos_y -40, flagpole.x_pos, floorPos_y , flagpole.x_pos +50, floorPos_y -20);
        }
    
   pop()
}


function checkFlagpole()
{
    flagpolereached = false;
    
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if (d < 15)
        {
            flagpole.isReached = true;
            flagpolereached = true;
        }  
    
    if (flagpolereached == true)
        {
            winSound.play();
        }
    
}    


function checkPlayerDie()
{
    var playerDead = false;
    
    if (gameChar_y == height - 66)
        {
            fallingSound.play();
        }
    
    if (gameChar_y == height) // character has fallen off of the screen
        {
            lives -= 1;
            
            if (lives >0)
                {
                    startGame();
                }
            if (lives == 0)
                {
                    playerDead = true;
                }
        }
    
    for (var i=0; i < lives; i++)
        {
            fill(255,0,0);
            ellipse(67 + i *20, 32, 10);
            ellipse(76 + i *20, 32, 10);
            triangle(63 + i *20, 34, 81 + i *20, 34, 71.5 + i *20, 42);
        }
    
    if (playerDead == true)
        {
            gameOverSound.play();
        }
    
}

function setGradient(c1,c2)
{
  noFill();
  for (var y = 0; y < height; y++) 
           {
              var inter = map(y, 0, height, 0, 1);
              var c = lerpColor(c1, c2, inter);
              stroke(c);
              line(0, y, width, y);
            
            }
    
}

function createPlatforms(x,y,length)
{
    var p = {x: x, 
             y: y,
             length: length, 
             draw:function()
                {
                 fill(255,140,0);
                 rect(this.x, this.y, this.length, 20);
                },
             checkContact: function(gc_x, gc_y)
                {
                  if (gc_x > this.x && gc_x < this.x + this.length)
                      {
                          var d = this.y - gc_y;
                          if (d >= 0 && d < 5)
                              {
                                  return true;
                              }
                      }
                    
                    return false;
                }
            };
    
    return p;
}

function Enemy(x, y, range)
{
    var left = false;
    
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if (this.currentX >= this.x + this.range)
            {
                this.inc = -1;
                left = true;
            }
        
        else if(this.currentX < this.x)
            {
                this.inc = 1;
                left = false;
            }
    }
    
    this.draw = function()
    {
        this.update();
        
        if (left == false)
        {
        //body
        fill(54, 159, 54);
        stroke(0, 100, 0);
        rect(this.currentX-14, this.y -10, 28, 35);
        
        //head
        noStroke();
        fill(0, 100, 0, 300);
        ellipse(this.currentX, this.y -15, 25);
        ellipse(this.currentX-12, this.y -18, 10);
        ellipse(this.currentX+12, this.y -18, 10);
        ellipse(this.currentX-15, this.y -5, 25);
        ellipse(this.currentX+15, this.y -5, 25);
        
        fill(0, 100, 0, 200);
        ellipse(this.currentX, this.y -10, 25);
        
        //arms
        strokeWeight(1.5);
        stroke(0,0,0);
        line(this.currentX +15, this.y +20, this.currentX +23, this.y +20);
        line(this.currentX -15, this.y +20, this.currentX -5, this.y +20);
        
        noStroke();
        fill(0,0,0);
        ellipse(this.currentX +25, this.y +20, 3, 3);
        ellipse(this.currentX -5, this.y +20, 3, 3);
        
        //Legs
        stroke(0,0,0);
        strokeWeight(1.5);
        line(this.currentX +6, this.y +25, this.currentX +6, this.y +30);
        line(this.currentX -5, this.y +25, this.currentX -5, this.y +30);
        
        noStroke();
        fill(0,0,0);
        ellipse(this.currentX +6, this.y +30, 3, 3);
        ellipse(this.currentX -5, this.y +30, 3, 3);
        
        //eyes
        fill(0,0,0);
        ellipse(this.currentX -7, this.y +10, 10, 10);
        ellipse(this.currentX +8, this.y +10, 10, 10);
        noStroke();
        
        fill(255,0,0);
        ellipse(this.currentX -5, this.y +8, 2, 2);
        ellipse(this.currentX +10, this.y +8, 2, 2);
        
        strokeWeight(1.5);
        stroke(0,0,0);
        line(this.currentX +10, this.y +2, this.currentX +5, this.y +7);
        line(this.currentX -5, this.y +6, this.currentX -10, this.y +2);
        
        //mouth
        fill(178, 34, 34);
        ellipse(this.currentX +1, this.y +18, 7, 7);  
        noStroke();
        }
        
        if (left)
        {
        //body
        fill(54, 159, 54);
        rect(this.currentX-15, this.y -10, 30, 35);
        stroke(0, 100, 0);
        rect(this.currentX-14, this.y -10, 28, 35);
        
        //head
        noStroke();
        fill(0, 100, 0, 300);
        ellipse(this.currentX, this.y -15, 25);
        ellipse(this.currentX-12, this.y -18, 10);
        ellipse(this.currentX+12, this.y -18, 10);
        ellipse(this.currentX-15, this.y -5, 25);
        ellipse(this.currentX+15, this.y -5, 25);
        
        fill(0, 100, 0, 200);
        ellipse(this.currentX, this.y -10, 25);
        
        //arms
        strokeWeight(1.5);
        stroke(0,0,0);
        line(this.currentX -15, this.y +20, this.currentX -23, this.y +20);
        line(this.currentX +15, this.y +20, this.currentX +5, this.y +20);
        
        noStroke();
        fill(0,0,0);
        ellipse(this.currentX -25, this.y +20, 3, 3);
        ellipse(this.currentX +5, this.y +20, 3, 3);
        
        //Legs
        stroke(0,0,0);
        strokeWeight(1.5);
        line(this.currentX +6, this.y +25, this.currentX +6, this.y +30);
        line(this.currentX -5, this.y +25, this.currentX -5, this.y +30);
        
        noStroke();
        fill(0,0,0);
        ellipse(this.currentX +6, this.y +30, 3, 3);
        ellipse(this.currentX -5, this.y +30, 3, 3);
        
        //eyes
        fill(0,0,0);
        ellipse(this.currentX -7, this.y +10, 10, 10);
        ellipse(this.currentX +8, this.y +10, 10, 10);
        noStroke();
        
        fill(255,0,0);
        ellipse(this.currentX +5, this.y +8, 2, 2);
        ellipse(this.currentX -10, this.y +8, 2, 2);
        
        strokeWeight(1.5);
        stroke(0,0,0);
        line(this.currentX +10, this.y +2, this.currentX +5, this.y +7);
        line(this.currentX -5, this.y +6, this.currentX -10, this.y +2);
        
        //mouth
        fill(178, 34, 34);
        ellipse(this.currentX -1, this.y +18, 7, 7);  
        noStroke();    
        }
        
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y+10)
        
        if(d < 35)
          {
              return true;
          }
        
        if (d < 45)
          {
               isFalling = true;
          }
        
        return false;
    }
    
}

