let sketchLucas = function(lg){

  let song;
  let fft;
  let ampl;
  let button;
  let volhistory = [];
  let deletetionAmount = 20;

  let vert = [];
  let iterate = 64;

  let basicShader;

  let isPlaying = false;
  let setUpDone = false;

  

  lg.preload = function(){
    lg.basicShader = lg.loadShader('./lucas/basic.vert', './lucas/basic.frag');
    lg.song = lg.loadSound("./lucas/audio/ThoughtsInProgress.mp3");
  }

  lg.setup = function() {
    let clientWidth = document.getElementById('cnv-sketch').clientWidth;
    let clientHeight = document.getElementById('cnv-sketch').clientHeight;
    let cnv = lg.createCanvas(clientWidth -10,clientHeight, lg.WEBGL);
    cnv.parent('cnv-sketch');
    
      lg.fft = new p5.FFT(0.7, iterate);
      lg.ampl = new p5.Amplitude();

      for(let i = 0; i < iterate - deletetionAmount; i++){
        let randX = lg.random(lg.width / -4, lg.height / 4);
        let randY = lg.random(lg.width / -4, lg.height / 4);
        let randZ = lg.random(lg.with / -4, lg.height / 4);
        
      
        vert[i] = lg.createVector(randX, randY, randZ);
        setUpDone = true;
    }
  }
  
  lg.draw = function() {
    lg.background(200);
    

    lg.basicShader.setUniform('u_time', lg.frameCount * 0.01);

    if(setUpDone){

      let level = lg.ampl.getLevel();
      let rotationGain = lg.map(level, 0, 1, 0, 3);
  
      let angleX = lg.frameCount * 0.01 + rotationGain;
      let angleY = lg.frameCount * 0.01 + rotationGain;
      let angleZ = lg.frameCount * 0.01 + rotationGain;
  
      lg.rotateX(angleX);
      lg.rotateY(angleY);
      lg.rotateZ(angleZ);

      let spectrum = lg.fft.analyze();

      for(let i = 0; i < spectrum.length - deletetionAmount; i++){

        let amp = spectrum[i];
        let offset = lg.map(amp, 0, 255, 1, 3);
  
        vert[i] = lg.createVector(offset);
      }

      lg.beginShape(lg.TRIANGLE_STRIP);
      lg.strokeWeight(1);

      for(let v of vert){
        
        let randR = lg.random(255);
        let randG = lg.random(255);
        let randB = lg.random(255);
        lg.fill(randR, randG, randB);

        let randX = lg.random(lg.windowWidth / -4, lg.windowHeight / 4);
        let randY = lg.random(lg.windowWidth / -4, lg.windowHeight / 4);
        let randZ = lg.random(lg.windowWidth / -4, lg.windowHeight / 4);
        lg.vertex(v * randX, 2, v* randZ);
        
      }
      lg.endShape();
      console.log(vert);
    }
  }

  lg.mousePressed = function(){

    if(!isPlaying){
      lg.song.play();
      isPlaying = true;
      console.log('jo');
    }

  }




lg.newVertex = function(_pos, _col){

}

class Vertex {
    constructor(_pos, _col){
        this.pos = _pos;
        this.col = _col;
    }
  
    move(amount){
        this.offset = lg.createVector(amount, amount, amount);
    }
    
    show(){
        lg.strokeWeight(1);
        //noFill();
        lg.fill(this.col.x, this.col.y, this.col.z);
        lg.vertex(this.pos.x * this.offset.x, this.pos.y * this.offset.y, this.pos.z * this.offset.z);        
    }
  }

 

  

}


let sLucas = new p5(sketchLucas);



