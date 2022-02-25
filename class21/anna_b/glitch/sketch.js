

let shader;
let glitch;

let song;
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
function preload() {
  
  shader = loadShader("glitch/common.vert", "glitch/shaer.frag");
  glitch = loadShader('glitch/glitch.vert','glitch/glitch.frag');
  song = loadSound('glitch/assets/glitchFollows.mp3');
  
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.GL.getExtension('OES_standard_derivatives');

  blob = createGraphics(windowWidth, windowHeight, WEBGL);
  blob.shader(shader);

  final = createGraphics(windowWidth, windowHeight, WEBGL);
  final.shader(glitch);


  duration = song.duration() * 1000;

  getAudioContext().suspend();
  
  audioDataTexture = createImage(bands, 1);

  fft = new p5.FFT(0.9,bands);
  fft.setInput(song);

  amplitude = new p5.Amplitude();
  amplitude.setInput(song);

  buttons(); 
}

function draw() {
  background(0);
  console.log(frameRate())
  

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


  if (!song.isPlaying()){
    button1.style("display", "block")
    button.style("display", "none")
  } else{
    button1.style("display", "none")
    button.style("display", "block")
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buttons(){

  button = createButton('pause');
  button.position(0, 0);
  button.mousePressed(stopSong)
  button.addClass("button2");


  button1 = createButton('play');
  //button1.position(width/2-30, height/2);
  button1.mousePressed(playSong)
  button1.addClass("button1");



  button2 = createButton('animation off');
  button2.position(120, 0);
  button2.mousePressed(animationToggle)
  button2.addClass("button3");
  button2.style("display", "none");
}



function playSong() {
  if (!song.isPlaying()) {

    playing = true;
    userStartAudio();
    song.play();
    button.html("pause");
  } 
}
function stopSong() {
 if (song.isPlaying()) {
  playing = false;
    song.pause();
    button.html("play");
  } 
}


  function animationToggle() {
    animationOn = !animationOn;
    if (!animationOn) {

      shader.setUniform("iChannel0",  0);
      button2.html("animation off");
    } else {

      shader.setUniform("iChannel0",  audioDataTexture);
      button2.html("animation on");
      }
    
    }

 