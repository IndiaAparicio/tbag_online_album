//Online Album 
let vorschau;
let vorschau_klick = true;
let song; 

//Original
let shader;
let glitch;

//let song;
let canvas;
let blob;
let audioDataTexture ;
let bands = 512;
let red = 0.1;
let green = 1.0;
let blue = 0.3;

let playing = false;
let button, button1, button2;

let animationOn = true;
let currentTime;

let final;


function preload(){
  //Online Album
  song = loadSound('./assets/glitchFollows.mp3');
  vorschau = loadImage('./assets/anna_b_vorschau.png');

  //Original
  shader = loadShader("./common.vert", "./shaer.frag");
  glitch = loadShader('./glitch.vert','./glitch.frag');
}


function setup(){
    //Online Album 
  let clientWidth = document.getElementById('cnv-sketch').clientWidth;
  let clientHeight = windowHeight * 0.85;
  let cnv = createCanvas(clientWidth -10,clientHeight, WEBGL);
  cnv.parent('cnv-sketch');

  //Original
  pixelDensity(1);
  cnv.GL.getExtension('OES_standard_derivatives');

  blob = createGraphics(clientWidth -10,clientHeight, WEBGL);
  blob.shader(shader);

  final = createGraphics(clientWidth -10,clientHeight, WEBGL);
  final.shader(glitch);

  duration = song.duration() * 1000;

  getAudioContext().suspend();
  
  audioDataTexture = createImage(bands, 1);

  fft = new p5.FFT(0.9,bands);
  fft.setInput(song);

  amplitude = new p5.Amplitude();
  amplitude.setInput(song);

}

function draw(){

    //Online Album
  if(vorschau_klick){
    image(vorschau, -width/2, -height/2, width, height, vorschau.width/4, vorschau.height/4, width, height);
  }else{
    //Original
    background(0);
    //console.log(frameRate())

    fft.smooth();
    let spectrum = fft.analyze();

    audioDataTexture.loadPixels();
    for (let i = 0; i < audioDataTexture.width; i++) {
        audioDataTexture.pixels[i] =
        int(constrain(spectrum[i], 0, 255));
    }
    audioDataTexture.updatePixels();

    if(animationOn){
        currentTime = millis()/2000.0;
      } else {
        currentTime = 0;
    }

    green = map (spectrum[0], 120, 160, 0.7, 1);
    blue = map (spectrum[3], 100, 190, 0.0, 0.2);
    red = map (spectrum[8], 155,190, 0.2, 0.9);

    blob.shader(shader);

    shader.setUniform("uFrameCount", frameCount);
    shader.setUniform("ytransform", spectrum )

    shader.setUniform("xtransform", spectrum )

    shader.setUniform("iSampleRate", song.sampleRate() )
    shader.setUniform("amp", amplitude )
    shader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);

    shader.setUniform("iResolution", [float(width), float(height), 0.0] )
    shader.setUniform("u_resolution", [float(width), float(height), 0.0] )
    shader.setUniform("iTime", currentTime);
    shader.setUniform("iChannelTime",currentTime)
    shader.setUniform("iChannelResolution", [float(width), float(height), 0.0]  );
    shader.setUniform("iChannel0",  audioDataTexture);
    shader.setUniform("red",  red);
    shader.setUniform("green",  green);
    shader.setUniform("blue",  blue);

    blob.quad(-1, -1, 1, -1, 1, 1, -1, 1); 
    
    glitch.setUniform("iResolution", [width, height, 0.0]);
    glitch.setUniform("iTime", currentTime);
    glitch.setUniform("iFrame", frameCount);
    glitch.setUniform( "iMouse", [mouseX, mouseY, 0.0, 0.0]);
    glitch.setUniform("iChannel0", blob);

    final.shader(glitch);
    final.quad(-1,-1,1,-1,1,1,-1,1);
    image(final,width*-0.5, height*-0.5);

    if (song.currentTime() >= song.duration() - 0.1) {
        playing = false;  
    }
  }
}

//Online Album
function mousePressed(){
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
    console.log("stop_song");
    vorschau_klick = true;
  } else {
    song.play();
    console.log("play_song");
    vorschau_klick = false;
  }
}



function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}