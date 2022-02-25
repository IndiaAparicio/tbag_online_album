let bg;
let song, song2;
let clientWidth;
let clientHeight;
let soundOn = false;
let vorschau;
let vorschau_klick = true;

var cols, rows;
var scl = 20;
var w = 3000;
var h = 1000;
var trenchxStart = 29;
var trenchxEnd = 22;
var trenchyStart = 30;
var trenchyEnd = 21;
var gradientSteps = 10;
var sunHeight = 150;
var sunSize = 600;
var canvasSize = 400;
var halfCanvasSize = canvasSize * 0.5;

const size = 60;

var flying = 0;

var terrain = [];

var waterColors = [];


function preload() {
  bg_load = true;
  vorschau = loadImage('./assets/orkun-min.png');
  //bg = loadImage('./platzhalter.png');
  //song=loadSound('./assets/Gris.mp3');
  song2 = loadSound('./assets/orkun_sound.mp3');
  //amplitude = new p5.Amplitude(); 
}

function setup() {
    clientWidth = document.getElementById('cnv-sketch').clientWidth;
    clientHeight = windowHeight * 0.85;
    let cnv = createCanvas(clientWidth -10,clientHeight, WEBGL);
    cnv.parent('cnv-sketch');

    amplitude = new p5.Amplitude(); 

    cols = w/ scl;
    rows = h/ scl;

    for (var y = 0; y < rows-1; y++) {
      for (var x = 0; x < cols; x++) {
          if(x <= trenchxStart && x >=trenchxEnd){
              waterColors.push(color(250,215,random(160,255)))
          }else{
              waterColors.push(color(0,0,random(150,200)))
          }
      }
    }

    colours = [
      color(8, 44, 127), // Night blue
      color(255, 0, 253), //Neon pink
      color(255,69,0), // Red orange
      color(0, 29, 95), // Dark blue
    ];
  
    for (var x = 0; x < cols; x++) {
      terrain[x] = [];
      for (var y = 0; y < rows; y++) {
        terrain[x][y] = 0; //specify a default value for now
      }
    }

}


function draw() {

  if(vorschau_klick){
    image(vorschau, -width/2, -height/2, width, height, vorschau.width/4, vorschau.height/4, width, height);
  }else{

    flying -= 0.005;
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
        xoff += 0.1;
      }
      yoff += 0.1;
    }
  
  
  
    background(50, 90, 100);
    push();
    translate(0, -200,-500);
      
  
     // sky burst
    from = color(69, 103, 108);
    to = color(240, 220, 180);
    for (var i = gradientSteps; i > 0; --i) {
       var hsize = map(i, gradientSteps, 0, canvasSize + 800, halfCanvasSize);
       fill(lerpColor(from, to, 1 - i / gradientSteps));
       ellipse(50,-100, hsize, hsize);
    }
  
    pop();
  
    push()
    translate(0, -200,-500);
    from = color(230, 210, 150);
    to = color(240, 220, 230);
    noStroke()
    //fill(lerpColor(from, to, 1 - 2 / gradientSteps));
    for (var i = gradientSteps; i > 0; --i) {
      var sizes = map(i, gradientSteps, 0, sunSize, 0);
      fill(lerpColor(from, to, 1 - i / gradientSteps));
      ellipse(50,-100,sizes)
    }
    pop();
  
    rotateX(PI/3);
    fill(colours[3]);
    stroke(colours[0]);
    strokeWeight(1);
    noStroke();
  
    push();
    translate(-w/2, -h/2);
    for (var y = 0; y < rows-1; y++) {
     beginShape(TRIANGLE_STRIP);
     for (var x = 0; x < cols; x++) {
       fill(waterColors[x]);
       vertex(x * size, (y * size), terrain[y][x]);
       vertex(x * size, ((y + 1) * size), terrain[y + 1][x]);
  
     }
     endShape();
    } 

  }


}

function mousePressed() {
    if (song2.isPlaying()) {
      // .isPlaying() returns a boolean
      //song.stop();
      song2.stop();
      vorschau_klick = true;
    } else {
      //song.play();
      song2.setVolume(0.09);
      song2.play();
      vorschau_klick = false;
    }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
