var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverImage;
var restart, restartImage
var jumpSound, dieSound, checkPointSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.setCollider("circle", 0, 0, 45);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300, 100)
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1;
  gameOver.visible = false;
  
  restart = createSprite(300,140)
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  
  score = 0;
}

function draw() {
  background("grey");
   text("Score: "+ score, 500,50);   
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4;
    
    score = score+ Math.round(getFrameRate() / 50)
    
  //score = score + 1;
      
    if(keyDown("space")&& trex.y >= 162.5) {
      trex.velocityY = -13;
      jumpSound.play();
    }
  
     trex.velocityY = trex.velocityY + 0.8;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //spawn the clouds
     spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState=END; 
      dieSound.play();
    }
  
  if(score%100 === 0 && score > 0){
      checkPointSound.play();
    }
    
  }
  
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
       reset();
  }
    
  }
  
 
  
 

  
  trex.collide(invisibleGround);
  
 
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -6 - score/100;

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5 ;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3 - score/100;
    
     //assign lifetime to the variable
    cloud.lifetime = 220;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY; 
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  restart.visible = false;
  gameOver.visible = false;
  trex.changeAnimation("running",trex_running);
  score = 0;
}

