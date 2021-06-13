var restart,restartImage;
var booster=0;
var bg,bgImage;
var mario_running, mario_collide,mario,marioJump;
var dieSound;
var brickGroup,brickImage;
var coinGroup,coinImage,coinScore=0;
var coinSound;
var status="play";
var obstacleGroup,obs1,obs2,obsImage1,obsImage2;
function preload(){
    restartImage=loadImage("images/restart.png");
    mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png",
  "images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
  bgImage = loadImage("images/bgnew.jpg");
    brickImage=loadImage("images/brick.png");
    coinSound=loadSound("sounds/coinSound.mp3");
    marioJump=loadSound("sounds/jump.mp3");
    mario_collide=loadAnimation("images/dead.png");
    dieSound=loadSound("sounds/dieSound.mp3");
    obsImage2=loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png");
    obsImage1=loadAnimation("images/mush1.png","images/mush1.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png");
    coinImage=loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png");
}

function setup() {
createCanvas(1000, 600);
//background sprite
bg=createSprite(580,300);
bg.addImage(bgImage);
bg.scale=0.5;
bg.velocityX=-6;
//restart sprite
restart=createSprite(500,300);
//adding restart image
//restart.addImage(restartImage);
restart.scale=0.5;
restart.visible=false;
//mario sprite
mario=createSprite(200,505,20,50);
mario.addAnimation("running",mario_running);
mario.addAnimation("collide",mario_collide);
mario.scale=0.3;
mario.debug=true;
//platform for mario,it is invisible
ground=createSprite(200,585,400,10);
ground.visible=false;
//group for bricks
brickGroup=new Group();
//group of coins
coinGroup=new Group();
//group of obstacles
obstacleGroup=new Group();
}


function draw() {
//game in play mode
        if(status==="play"){
            if(keyDown("b")){
                booster=1;
            }
            else{
                booster=0;
            }
        //decides speed of the background
            if(booster==1){
                bg.velocityX=-15;
        
            }
            else{
                bg.velocityX=-6;
            }
            if(keyDown("space")){
                mario.velocityY=-16;
                marioJump.play();
        
            }
            if(bg.x<200){
                bg.x=bg.width/4;
            }
            mario.velocityY=mario.velocityY+0.5;
            mario.collide(ground);
            //call the brick function
            generateBricks();
            //mario collide with bricks
            for(var i=0;i<(brickGroup).length;i++){
                var temp=(brickGroup).get(i);
                if(temp.isTouching(mario)){
                    mario.collide(temp);
                }
            }
            //infinite coins
            generateCoins();
        
            //catch the coins
            for(var i=0;i<coinGroup.length;i++){
                var temp=coinGroup.get(i);
                if(temp.isTouching(mario)){
                    coinSound.play();
                    temp.destroy();
                    temp=null;
                    coinScore++;
        
                }
            }
            //infinite obstacles
            obstacles();
            //mario interacting with obstacles
            if(obstacleGroup.isTouching(mario)){
                status="end";
                booster=0;
                dieSound.play();
        
        
            }
            //avoid mario being pushed away
            if(mario.x<200){
                mario.x=200;
            }
            //stop mario from going out of the screen
            if(mario.y<50){
                mario.y=50;
            }    
    
//game in end mode
    else if(status==="end"){
        bg.velocityX=0;
        mario.velocityY=0;
        mario.velocityX=0;
        mario.changeAnimation("collide",mario_collide);
        obstacleGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        brickGroup.setVelocityXEach(0);
        obstacleGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);
        brickGroup.setLifetimeEach(-1);
        mario.setCollider("rectangle",0,0,300,10);
        mario.y=570;
        mario.scale=0.4;
        restart.visible=true;
        if(mousePressedOver(restart)){
          console.log("restart");
          restartGame();
        }
        
    }
    

}

drawSprites();
strokeWeight(20);
stroke("green");
fill("White");
if(booster==1){
    text("YOU ARE PLAYING BOOSTER MODE",140,150);
    text("Total Coins Collected="+coinScore,140,100);    
}
else{
    text("Total Coins Collected="+coinScore,140,100);
}

}

//infinite no. of bricks
function generateBricks(){
    if(frameCount%70==0){
        var brick=createSprite(1200,120,40,10);
    brick.y=random(50,450);
//increase in velocity for booster mode
    if(booster==1){
        brickGroup.setVelocityXEach(-15);

    }
    else{
        brickGroup.setVelocityXEach(-5);
    }
    brick.addImage(brickImage);
    brick.scale=0.5;
    brick.lifetime=400;
    brickGroup.add(brick);
    }
}

//infinite no. of coins
function generateCoins(){
    if(frameCount%50===0){
        var coin=createSprite(1200,120,40,10);
        coin.addAnimation("coin",coinImage);
        coin.y=random(80,350);
//increase in velocity for booster mode
        if(booster==1){
         coinGroup.setVelocityXEach(-15);   
        }
        else{
            coinGroup.setVelocityXEach(-5);
        }
        coin.scale=0.1;
        coin.lifetime=1200;
        coinGroup.add(coin);
    }
}

//infinite obstacles
function obstacles(){
    if(frameCount%100===0){
        var obs=createSprite(1200,545,10,40);
//increase in velocity for booster mode
        if(booster==1){
            obstacleGroup.setVelocityXEach(-15);
        }
        else{
            obstacleGroup.setVelocityXEach(-4);
        }
        
//generate random number 1 or 2 which decides animation to be loaded
        var rand=Math.round(random(1,2));
        obs.scale=0.2;
//switch animation to the sprite obs by turtle ans mushroom
        switch(rand){
            case 1:
                obs.addAnimation("mush",obsImage1);
                break;
            case 2:
                obs.addAnimation("tur",obsImage2);
                break;
            
        }
        obs.lifetime=400;
        obstacleGroup.add(obs);
    }
}

function restartGame(){
    status="play";
    restart.visible=false;
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    brickGroup.destroyEach();
    coinScore=0;
    mario.changeAnimation("running",mario_running);
}


















