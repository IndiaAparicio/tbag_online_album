//Online ALbum
let vorschau;
let vorschau_klick = true;
let song; 


//Original
let fft, amp_bass, amp_mid, amp_treble,bg, stars, myFont, r_number; 

function preload(){
  //uniformsShader = loadShader('shader.vert', 'shader.frag');
  song = loadSound('./assets/TBAG_DarkChaos-Track.mp3');
  vorschau = loadImage('./assets/Preview.png');
}


function setup(){
  //Online Album
  let clientWidth = document.getElementById('cnv-sketch').clientWidth;
  let clientHeight = windowHeight * 0.85;
  let cnv = createCanvas(clientWidth -10,clientHeight);
  cnv.parent('cnv-sketch');

  //Original
  r_number = random(0,99);
    
  //mode setup
  angleMode(DEGREES);
  rectMode(CENTER);

  //audio setup
  fft = new p5.FFT(); 
}

//variables to change color and size over time
let colorCounter = 0;
let lowCounter = 300;
let midCounter = 37.5;
let highCounter = 37.5;
//=======
let rotator = 0;
let sizer = 0;
let sizer2 = 0;
let started = false;

let rotStart = 0;

function draw(){

  if(vorschau_klick){
    image(vorschau, 0, 0, width, height, vorschau.width/4, vorschau.height/4, width, height);
  }else{
    background(0);

    //======Stars==========
    randomSeed(r_number);
    fill(249,255,240,colorCounter/2);
    for(let i=0; i<=width; i+=10){
          ellipse(random(width),random(height),2);
    }
    fill(0);
    ellipse(width/2,height/2,850);
    //===========================

    //enable mouse input to change rotation and size
    rotator = map(mouseX,0, width, -90, 90);
    sizer = map(mouseY,0,height,0,1.5);
    sizer2 = map(mouseY,height,0,0,4);

    //audio analysis
    let wave = fft.waveform();
    fft.analyze();
    amp_bass = fft.getEnergy(80,150);
    amp_mid = fft.getEnergy("mid");
    amp_treble = fft.getEnergy("treble");


       //shapes
       noFill();
       setColor([colorCounter/2,55+colorCounter,55+colorCounter],[colorCounter/2,55+colorCounter,55+colorCounter],10);
       draw_triangle(lowCounter+amp_bass/2, width/2, height/2,0-rotator,true);
       draw_triangle(300+amp_bass/2*sizer, width/2, height/2,0-rotator,true);
       draw_triangle(midCounter+amp_mid/4, width/2, height/2,180+rotator);
       draw_triangle(highCounter+amp_treble, width/2, height/2,180+rotator);
       draw_triangle(37.5, width/2, height/2,180+rotator);
   
       if(sizer2>1){
       draw_triangle(37.5*sizer2, width/2, height/2,180+rotator);
       }
   
       drawingContext.shadowBlur=0;

       noStroke();
       fill(255,255,255,colorCounter);
       
       push();
       translate(width/2, height/2); 
       for(let i=5; i<=175; i++){
         let index = floor(map(i,0,180,0, wave.length-1));
         let r = map(wave[index],-1,1,275,375); 
         
         for(let j=0; j<=3; j++){
           let x = r*sin(i);
           let y = r*cos(i); 
           ellipse(x-(10*j),y,1);
         }
       }
       setColor(0,255,20);
       noFill();
       stroke(255,255,255,colorCounter/4);
       arc(0,0,650,650,90,270);
       pop();

        //variable changing over time - set a limit
    if(colorCounter<200 && song.isPlaying()){
      colorCounter+=amp_bass/600;
    }

    //light scene up at high freqs
    if(amp_treble>=0.52){
      if(colorCounter<500){
        colorCounter+=20;
      }
      
    }else{
      if(colorCounter>200){
        colorCounter-=20;
      }
    }

    if(lowCounter<=320){
      lowCounter+=amp_bass/1000;
    }
    if(midCounter<=150){
      midCounter+=amp_mid/1000;
    }
    if(highCounter<=75){
      highCounter+=amp_treble/100;
    }
  }
}

//draw an equilateral triangle around a defined middle
function draw_triangle(sideLenght, middlePoint_X, middlePoint_Y,rotation, edges_only=undefined,){
    
  const radius = sideLenght;
  const middleX = middlePoint_X;
  const middleY = middlePoint_Y;
  const rot = rotation;

  push();
  translate(middleX, middleY);
  rotate(rot);

  //use polar coordinates to define points of the triangle
  //negative to turn it upside down
  const x1 = -radius*cos(30);
  const y1 = -radius*sin(30);
  const x2 = -radius*cos(150);
  const y2 = -radius*sin(150);
  const x3 = -radius*cos(270);
  const y3 = -radius*sin(270);
  triangle(x1,y1,x2,y2,x3,y3);

  if(edges_only){
    noStroke();
    fill(0);
    drawingContext.shadowBlur=0;
    rotate(180);
    triangle(x1,y1,x2,y2,x3,y3);
  }
  pop();
}

//all in one function to define the look
function setColor(strokeColor, glowColor, glowRadius){
  stroke(strokeColor);
  drawingContext.shadowBlur=glowRadius;
  drawingContext.shadowColor=color(glowColor);

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