let vorschau;
let vorschau_klick = true;
let song; 


function preload(){
  //uniformsShader = loadShader('shader.vert', 'shader.frag');
  song = loadSound('./assets/india_sound.mp3');
  vorschau = loadImage('./assets/india-min.png');
}


function setup(){
  let clientWidth = document.getElementById('cnv-sketch').clientWidth;
  let clientHeight = windowHeight * 0.85;
  let cnv = createCanvas(clientWidth -10,clientHeight, WEBGL);
  cnv.parent('cnv-sketch');

}

function draw(){

  if(vorschau_klick){
    image(vorschau, -width/2, -height/2, width, height, vorschau.width/4, vorschau.height/4, width, height);
  }else{
    background(0);
   fill(250,0,50);
   rect(100,100,100);
  }
}

function mousePressed(){
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
    vorschau_klick = true;
  } else {
    song.play();
    vorschau_klick = false;
  }
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}