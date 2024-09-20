const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
context.font = "40px Georgia";
let gameSpeed = 1;
let gameOver = false;

// mouse game
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};
canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

//player
const playerLeft = new Image();
playerLeft.src = 'assets/player_left.png';
const playerRight = new Image();
playerRight.src = 'assets/player_right.png';

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 10;
    this.angle = 0;
    this.frameX = 0;
    this.fameY = 0;
    this.spriteWidth = 120;
    this.spriteHeight = 190;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dy,dx);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= dx / 30;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 30;
    }
  }
  draw() {
    if (mouse.click) {
      context.lineWidth = 0.2;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    const scaleFactor = 2.5; // Adjust this to change the size
    if (this.x >= mouse.x) {
      context.drawImage(playerLeft, this.frameX * this.spriteWidth, this.fameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60 * scaleFactor, 0 - 45 * scaleFactor, this.spriteWidth / 4 * scaleFactor, this.spriteHeight / 4 * scaleFactor);
    } else {
      context.drawImage(playerRight, this.frameX * this.spriteWidth, this.fameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60 * scaleFactor, 0 - 45 * scaleFactor, this.spriteWidth / 4 * scaleFactor, this.spriteHeight / 4 * scaleFactor);
    }
    context.restore();
  }
}
const player = new Player();

// bong bong
const bongArry = [];
const bongImage = new Image();
bongImage.src = 'assets/bong_pop_frame_01.png'
class Bong {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    context.drawImage(bongImage, this.x-55,this.y - 55,this.radius*2,this.radius*2);
  }
}

function handleBong(params) {
  if (gameFrame % 50 === 0) {
    bongArry.push(new Bong());
  }
  for (let i = 0; i < bongArry.length; i++) {
    bongArry[i].update();
    bongArry[i].draw();
    if (bongArry[i].y < 0 - bongArry[i].radius * 2) {
      bongArry.splice(i, 1);
      i--;
    } else if (bongArry[i].distance < bongArry[i].radius + player.radius) {
        if (!bongArry[i].counted){
          score++;
          bongArry[i].counted = true;
          bongArry.splice(i,1);
          i--;
        }
      }
  }
  for (let i = 0; i < bongArry.length; i++) {

  }
}

//background
const background = new Image();
background.src = 'assets/layer3.png';

const BG ={
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height
}

function handleBackground() {
  BG.x1 -= gameSpeed;
  if(BG.x1 <= -BG.width) BG.x1 = BG.width;
  BG.x2 -=gameSpeed;
  if (BG.x2 <= -BG.width) BG.x2 = BG.width;
  context.drawImage(background, BG.x1,BG.y, BG.width,BG.height);
  context.drawImage(background, BG.x2,BG.y, BG.width,BG.height);
}

const background1 = new Image();
background1.src = 'assets/layer2.png';

const L2 ={
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height
}

function handleBackground1() {
  L2.x1 -= gameSpeed;
  if(L2.x1 <= -L2.width) L2.x1 = L2.width;
  L2.x2 -=gameSpeed;
  if (L2.x2 <= -L2.width) L2.x2 = L2.width;
  context.drawImage(background1, L2.x1,L2.y, L2.width,L2.height);
  context.drawImage(background1, L2.x2,L2.y, L2.width,L2.height);
}

const background3 = new Image();
background3.src = 'assets/layer1.png';

const L1 ={
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height
}

function handleBackground3() {
  L1.x1 -= gameSpeed;
  if(L1.x1 <= - L1.width) L1.x1 = L1.width;
  L1.x2 -=gameSpeed;
  if (L1.x2 <= -L1.width) L1.x2 = L1.width;
  context.drawImage(background3, L1.x1,L1.y, L1.width,L1.height);
  context.drawImage(background3, L1.x2,L1.y, L1.width,L1.height);
}

//enemy
const enemyImage = new Image();
enemyImage.src = 'assets/angler1.png';

class Enemy {
  constructor() {
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 70;
    this.speed = Math.random()*2+2;
    this.frame = 0;
    this.frameX = 0
    this.frameY = 0
    this.spriteWidth = 228;
    this.spriteHeight = 169;
  }

  draw(){
    const scaleFactor = 2.5;
    context.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight,this.x - 60,this.y - 70,this.spriteWidth/3 * scaleFactor,this.spriteHeight/3 * scaleFactor);
  }
  update(){
    this.x -=this.speed;
    if (this.x < 0 - this.radius * 2){
      this.x = canvas.width + 100;
      this.y = Math.random()*(canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 5 === 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame === 3 || this.frame === 7 || this.frame === 11){
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame <  7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0
    }
    //collision with player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < this.radius + player.radius - 2){
      handleGameOver();
    }
  }
}
const enemy1 = new Enemy();
function handleEnemies() {
  enemy1.draw();
  enemy1.update();
}

function handleGameOver() {
  context.fillStyle = 'white';
  context.fillText(`GAME OVER, you reached score: ` + score,110,250);
  gameOver = true;
}

// loop game
function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground3();
  handleBackground1();
  handleBackground();
  handleBong();
  player.update();
  player.draw();
  handleEnemies();
  context.fillStyle = "black";
  context.fillText("score: " + score, 10, 50);
  gameFrame++;
   if (!gameOver) window.requestAnimationFrame(gameLoop);
}
gameLoop();

window.addEventListener('resize', function (){
  canvasPosition = canvas.getBoundingClientRect();
});