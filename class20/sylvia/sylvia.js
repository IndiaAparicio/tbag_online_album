let bg;
let song;
let clientWidth;
let clientHeight;
let soundOn = false;

function preload() {
  bg_load = true;
  bg = loadImage('../../assets/india-min.png');
  song = loadSound('../../assets/sylvia_sound.mp3');
}

function setup() {
    clientWidth = document.getElementById('cnv-sketch').clientWidth;
    clientHeight = windowHeight * 0.85;
    let cnv = createCanvas(clientWidth -10,clientHeight);
    cnv.parent('cnv-sketch');
  }
  
  function draw() {
    background(bg);
    

    if(soundOn === false){
      
      fill('rgba(0,0,0, 0.5)');
      rect(0,0,width, height);
      fill(255);
      textSize(32);
      textAlign(CENTER);
      textStyle(BOLD);
      textFont('montserrat');
      text('TAP HERE TO PLAY', width/2, height/2);
      
    }
  }

  function mousePressed() {
    if (song.isPlaying()) {
      // .isPlaying() returns a boolean
      song.stop();
      soundOn = false;
    } else {
      song.play();
      soundOn = true;
    }
  }