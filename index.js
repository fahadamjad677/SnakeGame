const arrowUp=document.querySelector("#arrowUp");
const arrowDown=document.querySelector("#arrowDown");
const arrowLeft=document.querySelector("#arrowLeft");
const arrowRight=document.querySelector("#arrowRight");
const scoreBoard=document.querySelector(".score");
const highScoreBoard=document.querySelector(".highScore");
const move=document.querySelector("#move");
const food=document.querySelector("#food");
const gameOverSound=document.querySelector("#gameOver");
//------------------------------------DESKTOP------------------------------------------------------------
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
const devicePixelRatio = window.devicePixelRatio || 1;
const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                          ctx.mozBackingStorePixelRatio ||
                          ctx.msBackingStorePixelRatio ||
                          ctx.oBackingStorePixelRatio ||
                          ctx.backingStorePixelRatio || 1;
console.log(devicePixelRatio);
console.log(backingStoreRatio);
const ratio = devicePixelRatio / backingStoreRatio;
canvas.width = (canvas.clientWidth * ratio);
canvas.height = (canvas.clientHeight * ratio)-20;


// Scale the context
ctx.scale(ratio, ratio);
console.log(canvas.width,canvas.height);
console.log(canvas.clientWidth,canvas.clientHeight);
//Desktop time interval speed and width, height of snake and food
let width=30;
let height=30;
let speed=300;
let maxWidth=570;
let maxHeight=360;
// Multiplyer to get the whole area of width and height of canvas and radius to get rounded rectangle
let multiplyerX=20;
let multiplyerY=13;
let foodRadius=12;
let snakeRadius=10;
if(canvas.clientWidth===300){
    canvas.width = (canvas.clientWidth * ratio)-1;
    canvas.height = (canvas.clientHeight * ratio)-21;
    
    
    // Scale the context
    ctx.scale(ratio, ratio);
//------------------------------------MOBILE------------------------------------------------------------
// Mobile width and height of snake and food ,speed multiplyers to get whole width and height and food radius
width=15;
height=15;
speed=200;
multiplyerX=19;
multiplyerY=25;
foodRadius=4;
snakeRadius=5;
maxHeight=375;
maxWidth=285;
}

let foodPosition={
    x:0,
    y:0
}
let foodPositionIncrement={
    x:3,
    y:3
}
let velocity={
    x:0,
    y:0,
}
let headPosition={
    x:Math.floor((300/2)),
    y:Math.floor((300/2))
}
let bodyPosition=[];
let score=0;
let highScore=0;
//Checking if highScore key is set or not if set then taking the data and storing it into highScore
let temp=localStorage.getItem("highScore");
if(temp!==null){
    highScore=Number(temp);
}
highScoreBoard.innerHTML=`HighScore: ${highScore}`;

function roundedRect(ctx,Position, width, height, radius,color) {
    let {x,y}=Position;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height-2, x + radius, y + height-2, radius);
    ctx.arcTo(x + width-2, y + height-2, x + width-2, y + height - radius, radius);
    ctx.arcTo(x + width-2, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fillStyle=color;
    ctx.fill();
    ctx.strokeStyle="black";
    ctx.lineWidth=1;
    ctx.stroke();
  }
function drawHead(ctx,headPosition,width,height,velocity){
    headPosition.x=headPosition.x +((velocity.x) *width);
    headPosition.y=headPosition.y +((velocity.y)*height);
    roundedRect(ctx,headPosition,width,height,snakeRadius+1,"red");
}
function drawGrid(ctx,width,height,multiplyerX,multiplyerY){
    for(let  i=0;i<multiplyerX;i++){
        for(let j=0;j<multiplyerY;j++){
            ctx.strokeStyle=`rgba(119,226,119,0.1)`;
            ctx.strokeRect(i*width,j*height,30,30);
        }
    }
}
function clearGrid(ctx,width,height,multiplyerX,multiplyerY){
    for(let  i=0;i<multiplyerX;i++){
        for(let j=0;j<multiplyerY;j++){
           ctx.clearRect(i*width,j*height,30,30);
        }
    }
}
function drawFoodSame(ctx,foodPosition,width,height){
    let requiredPosition={...foodPosition};
    requiredPosition.x+=foodPositionIncrement.x;
    requiredPosition.y+=foodPositionIncrement.y;
    roundedRect(ctx,requiredPosition,width-5,height-5,foodRadius,"yellow");
}
function drawFood(ctx,foodPosition,width,height,headPosition,bodyPosition,multiplyerX,multiplyerY){
    foodPosition.x=(Math.floor((Math.random()*multiplyerX))*width);
    foodPosition.y=(Math.floor((Math.random()*multiplyerY))*height);
    //if foodPosition repeats head or body position then new position will be selected
    let check=false;
    do{
        check=false;
        if(foodPosition.x===headPosition.x && foodPosition.y===headPosition.y){
            foodPosition.x=(Math.floor((Math.random()*multiplyerX))*width);
            foodPosition.y=(Math.floor((Math.random()*multiplyerY))*height);
            check=true;
        } 
        else if(bodyPosition.length>=1){
            for(let i=0;i<bodyPosition.length;i++){
                if(foodPosition.x===bodyPosition[i].x && foodPosition.y===bodyPosition[i].y){
                    foodPosition.x=(Math.floor((Math.random()*multiplyerX))*width);
                    foodPosition.y=(Math.floor((Math.random()*multiplyerY))*height);
                    check=true;
                }
            }
        }else if(foodPosition.x<0 || foodPosition.x>=maxWidth || foodPosition.y<=0 || foodPosition.y>maxHeight){
            foodPosition.x=(Math.floor((Math.random()*multiplyerX))*width);
            foodPosition.y=(Math.floor((Math.random()*multiplyerY))*height);
            check=true;
        }

        if(!check){
            break;
        }
    }while(1);
    let requiredPosition={...foodPosition};
    requiredPosition.x+=foodPositionIncrement.x;
    requiredPosition.y+=foodPositionIncrement.y;
    roundedRect(ctx,requiredPosition,width-5,height-5,foodRadius,"yellow");

}

function drawBody(ctx,bodyPosition,width,height,snakeRadius){
        roundedRect(ctx,bodyPosition,width,height,snakeRadius,"red");
}
function clearElement(ctx,Position,width,height){
    ctx.clearRect(Position.x-1,Position.y-1,width,height);
   }
function playSound(move){
  //playing move sound
  move.play().catch((error)=>{
    console.log(error);
  })
}
drawFood(ctx,foodPosition,width,height,headPosition,bodyPosition,multiplyerX,multiplyerY);
drawHead(ctx,headPosition,width,height,velocity);
function update(){
    window.addEventListener("keyup",(e)=>{

        if(e.key==="ArrowUp"){
            playSound(move);
            if(velocity.y!==1){
                velocity.x=0;
                velocity.y=-1;
            }
            
        }
        else if(e.key==="ArrowDown"){
            playSound(move);
            if(velocity.y!==-1){
                velocity.x=0;
                velocity.y=1;
            }
        }
        else if(e.key==="ArrowLeft"){
            playSound(move);
            if(velocity.x!==1){
                velocity.x=-1;
                velocity.y=0;
            }
        }
        else if(e.key==="ArrowRight"){
            playSound(move);
            if(velocity.x!==-1){
                velocity.x=1;
                velocity.y=0;
            }
        }
    })
     arrowUp.addEventListener("click",()=>{
                playSound(move);
                if (velocity.y !== 1) {
                    velocity.x = 0;
                    velocity.y = -1;
                }
            })
     arrowDown.addEventListener("click",()=>{
        playSound(move);
                if (velocity.y !== -1) {
                    velocity.x = 0;
                    velocity.y = 1;
                }
            })
    arrowRight.addEventListener("click",()=>{
        playSound(move);
                if (velocity.x !== -1) {
                    velocity.x = 1;
                    velocity.y = 0;
                }
            })
    arrowLeft.addEventListener("click",()=>{
        playSound(move);
                if (velocity.x !== 1) {
                    velocity.x = -1;
                    velocity.y = 0;
                }
            })
        
    // for Touch 
let touchStartX;
let touchEndX;
let touchStartY;
let touchEndY;
canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
    // Prevent scrolling
    e.preventDefault();
});

canvas.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY=e.changedTouches[0].clientY;
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY =touchEndY-touchStartY;
    if (swipeDistanceX > 0 && swipeDistanceX>swipeDistanceY) {
        // Swipe right
        playSound(move);
        if (velocity.x !== -1) {
            velocity.x = 1;
            velocity.y = 0;
        }
        console.log("Swiped right!");
        console.log(swipeDistanceX,swipeDistanceY);
    }
     else if (swipeDistanceX < 0 && swipeDistanceX<swipeDistanceY) {
        // Swipe left
        playSound(move);
        if (velocity.x !== 1) {
            velocity.x = -1;
            velocity.y = 0;
        }
        console.log("Swiped left!");
        console.log(swipeDistanceX,swipeDistanceY);
    }
    else if(swipeDistanceY> 0 && swipeDistanceY>swipeDistanceX){
        playSound(move);
        if (velocity.y !== -1) {
            velocity.x = 0;
            velocity.y = 1;
        }
        console.log("swipeDown");
        console.log(swipeDistanceX,swipeDistanceY);
    }else if(swipeDistanceY<0)
    {
        if (velocity.y !== 1) {
            velocity.x = 0;
            velocity.y = -1;
        }
        console.log("swipeUP");
        console.log(swipeDistanceX,swipeDistanceY);
    }
});
}

function gameOver(headPosition,bodyPosition){
    if(headPosition.x<0 || headPosition.x>maxWidth){
        return true;
    }else if(headPosition.y<0 || headPosition.y>maxHeight){
        return true;
    }else{
        for(let i=0;i<bodyPosition.length;i++){
            if(headPosition.x===bodyPosition[i].x && headPosition.y===bodyPosition[i].y){
                return true;
            }
    }
}
}

let game=setInterval(()=>{
  
       let prevHead={
            x:headPosition.x,
            y:headPosition.y
         }
    
    if(headPosition.x===foodPosition.x && headPosition.y===foodPosition.y){
        score++;
         scoreBoard.innerHTML=`Score: ${score}`;
         playSound(food);
            if(highScore<=score){
                    highScore=score;
                    highScoreBoard.innerHTML=`High Score: ${highScore}`;
                }
        bodyPosition.push({...prevHead});
        clearElement(ctx,foodPosition,width,height);
        drawFood(ctx,foodPosition,width,height,headPosition,bodyPosition,multiplyerX,multiplyerY);
     }
     clearGrid(ctx,width,height,multiplyerX,multiplyerY);
        clearElement(ctx,headPosition,width,height);
         // Clearing all body elements to re-render at the next location
     for(let i=bodyPosition.length-1;i>=0;i--){
        clearElement(ctx,bodyPosition[i],width,height);
        if(i===0){
            bodyPosition[i]={...prevHead};
        }else{
            bodyPosition[i]={...bodyPosition[i-1]};
        }
    }
    for(let i=bodyPosition.length-1;i>=0;i--){  
     drawBody(ctx,bodyPosition[i],width,height,snakeRadius);
    }
        
    update();
    drawGrid(ctx,width,height,multiplyerX,multiplyerY);
    drawFoodSame(ctx,foodPosition,width,height);
    drawHead(ctx,headPosition,width,height,velocity);
    if(gameOver(headPosition,bodyPosition)){
            playSound(gameOverSound);
         if(highScore<=score){
            highScore=score;
            highScoreBoard.innerHTML=`High Score: ${highScore}`
            localStorage.setItem("highScore" ,highScore );
        }
        alert('Game Over');
        clearInterval(game);
    }
},speed);

