
//MODELS/OBJECTS
let angle = 0;
let canvas;
let alienplant;
let tentacle;
//SOUND
let amplitude;
let vol;
let music;
let fft;
let spectrum;
let smoothing = 0.8;
let binCount = 512;
//PARTICLES
let particles =  new Array(binCount);
//COORDINATES
let x = 0;
let y;
let ofy = 0.0;


//LoadingObjects
function preload() {
  music = loadSound("./LouderExport_RybakTBAGProjectFinal.mp3");
  //alienplant = loadModel("./Plant.obj");
  //tentacle = loadModel("./Tentacle2.obj");
}

function setup() {
  canvas = createCanvas(500, 400, WEBGL);

  //Sound
  canvas.mouseClicked(musicController);
  amplitude = new p5.Amplitude();
  fft = new p5.FFT(smoothing, binCount);
  
  //ParticleSetup
  for (let i = 0; i < particles.length; i++) {
    let x = map(i, 0, binCount, -300, width);
    let pos = createVector(x, y);
    particles[i] = new Particle(pos);
  }
  

}

function draw() {
  background(200);
  cursor(CROSS);

  //PARTICLES
  let spectrum = fft.analyze(binCount);

  for (let i = 0; i < binCount; i++) {
    let thisLevel = map(spectrum[i], 0, 255, 0, 1);

    particles[i].update(thisLevel);
    particles[i].draw();
  
  }

  //LIGHTING
  let locx = mouseX - height / 2;
  let locy = mouseY - width / 2;

  pointLight(200, 100, 255, locx, locy, 50);

  ambientLight(35, 30, 10);
  
  //SOUNDANALYSIS
  vol = amplitude.getLevel();


  //BACKGROUND RAYS
  push();
  noStroke();
  specularMaterial(50, 8);
  translate(0, 0, -600);
  
  let radius = 200;

  beginShape();
  let ofx = 0;
  for (var a = 0; a < TWO_PI; a += 0.01) {
    let offset = map(noise(ofx, ofy), 0.2, 0.6, -500, 500);
    let r = radius + offset;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
    ofx += 0.1;
  }
  endShape();
  pop();

  ofy += 0.002;
  

  //TORUS

  push()
  specularMaterial(250, 200);
  noStroke();
  translate(mouseX-width/2, mouseY-height/2);
  let st = sin(angle);
  let ct = cos(angle);
  applyMatrix( ct**2, ct*st,  -st,  0.0,
    st**2*ct-ct*st, st**3+ct**2, st*ct,  0.0,
    ct*st*ct+st**2, ct*st**2-st*ct, ct**2,  0.0,
    0.0, 0.0, 0.0,  1.0);
    torus(20, 5);

  pop()

  angle += 0.05

  //FOG
  
  push();
  translate(0, 300, 500);
	rotateX(300);
  specularMaterial(100, 180, 100, 15);
  noStroke();

	for (let k = 0; k < 50; k++) {
	
		beginShape();
		for (let j = 0; j < TWO_PI; j += TWO_PI/6){
			let rd = k * 80
			let h = rd * cos(j)
			let w = rd * sin(j)
			let l = sin(frameCount/30 + k/20) * 50
			vertex(h, w, l);
		}
		endShape(CLOSE);
	}
	pop();

  //3D

  
  push();
  noFill();
  stroke(255);
  strokeWeight(0.5);
  translate(0,300,-200);
  scale(100 + mouseY/10);
  rotateX(9.5 + vol);
  rotateY(mouseX/100);
  model(alienplant);
  pop();

  push();
  noFill();
  stroke(0);
  strokeWeight(0.5)
  translate(200,300,-200);
  scale(60+ mouseY/5);
  rotateX(9.5 + vol);
  rotateY(mouseX/-200 + vol/3);
  model(alienplant);
  pop();

  push();
  noFill();
  stroke(0);
  strokeWeight(0.5)
  translate(-200,300,-200);
  scale(80 + mouseY/20);
  rotateX(9.5 + vol);
  rotateY(mouseX/-100);
  model(alienplant);
  pop();

  //TENTACLES
  //LEFT
  push();
  noFill();
  stroke(0);
  strokeWeight(0.7)
  translate(-350,300,-200);
  scale(100 + mouseY/5 + vol*20);
  rotateX(35 + vol/2);
  rotateY(mouseX/-200);
  model(tentacle);
  pop();

//MIDDLELEFT
  push();
  noFill();
  stroke(0);
  strokeWeight(0.5)
  translate(-100,300,-200);
  scale(50 + mouseY/5 + vol*20);
  rotateX(35 + vol/2);
  rotateY(mouseX/-200);
  model(tentacle);
  pop();

  //MIDDLERIGHT
  push();
  noFill();
  stroke(0);
  strokeWeight(0.5)
  translate(80,300,-200);
  scale(50 + mouseY/5 + vol*20);
  rotateX(9.5 + vol/2);
  rotateY(mouseY/-200);
  model(tentacle);
  pop();
  
  //RIGHT
    push();
    noFill();
    stroke(0);
    strokeWeight(0.5)
    translate(300,350,-200);
    scale(50 + mouseY/5 + vol*20);
    rotateX(9.5);
    rotateY(mouseX/200);
    model(tentacle);
    pop();

    

}

//PARTICLES
let Particle = function(pos) {
  this.pos = pos;
  this.scale = random(0, 0.8);
  this.speed = createVector(0, random(0, 1));
  this.color = [0];
}

let theyExpand = 1;

Particle.prototype.update = function(someLevel) {
  this.pos.y += this.speed.y / (someLevel);
  if (this.pos.y > height) {
    this.pos.y = -300;
  }
  this.diameter = map(someLevel, 0, 1, 0, 50) * this.scale * theyExpand;

}


Particle.prototype.draw = function() {
  fill(this.color);
  noStroke();
  ellipse(
    this.pos.x * 2, this.pos.y * 2,
    this.diameter, this.diameter
  );

}

//SOUND
function musicController() {
  if (music.isPlaying()) {
    music.stop();
  } else {
    music.play()
  }
}
