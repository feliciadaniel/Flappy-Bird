//board
let board;
let boardwidth = 360; //bg image has these exact dimensions thats why the width and height have these values
let boardheight = 640;
let context;

//bird
let birdwidth = 34; //width/height ratio  = 408/228 = 17/12
let birdheight = 24;
let birdX = boardwidth/8; //starting X and Y position of the bird
let birdY = boardheight/2;
let birdImg; 

let bird = { //bird object 
    x : birdX,
    y : birdY,
    width : birdwidth,
    height  : birdheight
}


//pipes
let pipeArray = [];
let pipewidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let velocityX = -2;//speed of the pipes moving left hece the negative number.
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let GameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw  flappy bird 
    // context.fillStyle = "green";
    // context.fillRect(bird.x , bird.y , bird.width , bird.height ); //draws a green rectangle in the designated x and y positions

    //load image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){  //loads the bird on to the canvas
    context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = './bottompipe.png';


    requestAnimationFrame(update);
    setInterval(placePipes, 1300); //would place pipes in game ever 1500 ms (every 1.5 seconds)
    document.addEventListener("keydown" , moveBird);
}

function update() { //updates the frames of the canvas and redraws the canvas over and over again
    requestAnimationFrame(update);
    if(GameOver) {
        return;
    }
    context.clearRect(0, 0,board.width, board.height); //to update the frames, the older frame needs to be cleared outor the frames would stack on top of each other.


    //bird is painted over and over again
    velocityY+=gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY,0); //ensures the bird stays within the canvas and doesnt go past the top of the canvas
    context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height);


    if(bird.y > board.height) {
        GameOver = true;
    }
    //pipes
    for(let i = 0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img , pipe.x , pipe.y , pipe.width , pipe.height);//cant seee the pipes yet on screen bc its being drawn at the very end of the screen,(pipeX = board.width).
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width ){
            score += 0.5; //score is incremented by 0.5 because there are two pipes.
            pipe.passed=true;
        }

        if(detectCollision(bird , pipe)) {
            GameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
        pipeArray.shift(); //removes first element from the array.
    }
    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score , 5 , 45);

}

function placePipes(){
    if(GameOver){
        return;
    }
    //(0-1)*pipeheight/2.
    //0 -> -128(pipeheight/4)
    //1 -> -128 - 256 (pipeheight/4 - pipeheight/2) = -3/4 pipeheight 
    //so the height of the pipe will be generated at random from the range 1/4 to 3/4 shifting upwards
    let randomPipeY = pipeY - pipeheight/4 - Math.random()*(pipeheight/2);
    let openingSpace = board.height/4; //space between top and bottom pipe

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipewidth,
        height : pipeheight,
        passed : false //checks if bird has passed this pipe yet.
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp"  || e.code == "KeyX") {
        //jump
        velocityY = -6;
    }
}

function detectCollision(a , b){
return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}