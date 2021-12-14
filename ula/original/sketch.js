let sound;
let nums_x = [-10, 0, 10];
let nums_y = [100, -100]
let e = 0;
let f = 0;

function preload() {
  sound = loadSound('SWARM.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
 }

 function succulent (size) {

  for (let i=0; i < 60; i++) {
    push();
    
    let step = frameCount % 20;
    let angle = map(step, 50, 10, 0, TWO_PI);
    let cos_a = cos(angle);
    let sin_a = sin(angle);
    
    rotate(i / 5.0);
    scale(i / 8.0);
    
    applyMatrix(cos_a, sin_a, -sin_a, cos_a, e, f);
    
    noFill();
    beginShape();
    vertex(nums_x[0] * size, nums_y[0] * size);
    vertex(nums_x[1] * size, nums_y[1] * size);
    vertex(nums_x[2] * size, nums_y[0] * size);
    endShape(CLOSE);
  
    pop();
   } 


 }

function draw(){
  //gold
	background(212, 175, 55);
	fill(0, 10);
  

	translate(width/2, height/2);
  
  //dark green
  stroke(0, 40, 0, 80);
  //stroke(0, 160);
  succulent(1.2);

  //plum
  stroke(139, 0, 139, 40);
  succulent(0.9);
  
  //light pink
  stroke(255, 183, 197, 40);
  succulent(0.6);

  //lemon
  stroke(100, 95.7, 31, 50);
  succulent(0.2);
  }

  function mousePressed() {
    sound.play();
    e+= 50;
    let vol = amp.getLevel();
    
  }

  