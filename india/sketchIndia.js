

let sketchIndia = function(ia){
/*
  let scrollPositionCorrect = false;
  let indiapos = document.getElementById('test-test');
  let positionToTop = getCoords(indiapos);
    console.log(positionToTop);

    function getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
      };
    }

    document.addEventListener('scroll', function(){
    console.log(window.pageYOffset);

        if(window.pageYOffset > positionToTop.top){
            scrollPositionCorrect = true;
            //console.log(scrollPositionCorrect);
        }

    })*/

    
    //SKETCH BEGINS HERE SETUP MUST BE DONE BEFORE CHECK IF RIGHT POSITION




  let song;
  let amp;
  let fft;
  let slider;

  let angle = 0;
  let v100 = 100;
  let v0 = 0;
  let v75 = 75;
  let tra100 = 100;

  let bgColor = 20;
  let lightColor = 255;

  let uniformsShader;

  let isPlaying = false;

  ia.preload = function(){
    ia.uniformsShader = ia.loadShader('./india/shader.vert', './india/shader.frag');
    ia.song = ia.loadSound('./india/img/audio-project-m.mp3');
  }

  ia.setup = function() {
    let clientWidth = document.getElementById('cnv-sketch').clientWidth;
    let clientHeight = ia.windowHeight * 0.85;
    //let clientHeight = document.getElementById('cnv-sketch').clientHeight;
    let cnv = ia.createCanvas(clientWidth -10,clientHeight, ia.WEBGL);
    cnv.parent('cnv-sketch');

    //ia.song.play();

    ia.amp = new p5.Amplitude(0.8); 
    ia.fft = new p5.FFT(0.95, 64); 
  }

  
  
  ia.draw = function() {


    


    ia.background(20);
    ia.shader(ia.uniformsShader);

    let mx = ia.map(ia.mouseX, 0, ia.width, 0, 255);
    let my = ia.map(ia.mouseY, 0, ia.height, 0, 255);

    ia.background(mx, 0, bgColor);


    ////// MAPPING VARIABLES TO SOUND ///////////

    let spectrum = ia.fft.analyze(); 
    let bass, lowMid, mid, highMid, treble;
    bass = ia.fft.getEnergy("bass");
    lowMid = ia.fft.getEnergy("lowMid");
    mid = ia.fft.getEnergy("mid");
    highMid = ia.fft.getEnergy("highMid");
    treble = ia.fft.getEnergy("treble");

    let vol = ia.amp.getLevel();
    ia.diam = ia.map(vol, 0, 1, 20, 300);

    v75 = ia.map(bass, 0, 255, -350, -20);
    v100 = ia.map(mid, 0, 255, -350, -20);

    v75_1 = ia.map(mid, 0, 255, 60, 120);
    v100_1 = ia.map(treble, 0, 255, 60, 320);



    /////// SHADER / LIGHT /////////////

    ia.uniformsShader.setUniform('mouse', [mx, my]);

    ia.stroke(255);
    ia.strokeWeight(1);
    ia.ambientLight(100);
    ia.directionalLight(lightColor,mx,my,0,0,-1);


    ia.push();
    ia.fill(100);
    ia.noStroke();
    let formZ = ia.map(bass,0,255,-1000,200);
    tra100 = ia.map(bass,0,255,50,150);
    ia.createBGShape(tra100,formZ);
    ia.pop();

    ia.push();
    ia.scale(2);  
    for (let i = 0; i < 10; i++){
        ia.push();
        ia.noStroke();
        ia.fill(100-(i*10));
        ia.scale(i*0.9);
        ia.createBGShape(tra100, -600-i);
        ia.pop();
    
    ia.pop();


    /////// MOVING AND ROTATING MATRIX ///////////

    ia.rotateX(angle);
    ia.rotateY(angle * 0.4);
    ia.rotateZ(angle * 0.3);

    //////// GEOMETRY /////////

    ia.fill(255);
    ia.shader(ia.uniformsShader);
    ia.noStroke();
    ia.box(ia.diam);

    ia.strokeWeight(2);
    ia.noFill();

    // outer Cage
    ia.stroke(highMid);
    ia.createShape2(v75, v100);

    angle += 0.007;

    let randomPositionX = [-300,  100,  50,  0,  -250, 300, 250, -300,  250,-300,200, -50];
    let randomPositionY = [100,  -300,  250,-300,200, -50,  300,-300,  100,  -300, 0 ,100];
    let randomPositionZ = [-300,  100,  -300, 0 ,100, 0, -200,200, -50,  300,100,  -300 ];


    for(let i = 0; i <randomPositionX.length; i++){
      ia.translate(randomPositionX[i],randomPositionY[i],randomPositionZ[i]);
      ia.rotateZ(randomPositionX[i]*0.02);
      ia.rotateX(ia.mouseY*0.001);
      ia.rotateY(ia.mouseX*0.001);
      ia.sphere(10);
    }

    for(let i = 0; i <randomPositionX.length; i++){
      ia.stroke(255);
      ia.translate(0,0,0);
      ia.rotateY(ia.mouseY*0.001);
      ia.rotateZ(-3);
      ia.rotateX(ia.mouseX*0.001);
      ia.translate(randomPositionX[i],randomPositionY[i],randomPositionZ[i]);
      ia.sphere(10);
    }

    ia.orbitControl();
}
  }

  ia.mousePressed = function(){

    if(!isPlaying){
      ia.song.play();
      isPlaying = true;
    }
    
    bgColor = ia.random(0,255);
    lightColor = ia.random(0,255);
  }


  ia.createShape2 = function(small, high){
    ia.createShape1(small, high);
    ia.rotateX(ia.PI/2);
    ia.createShape1(small, high);
    ia.rotateX(-ia.PI/2);
    ia.createShape1(small, high);

    ia.rotateY(ia.PI/2);
    ia.createShape1(small, high);
    ia.rotateY(-ia.PI/2);
    ia.createShape1(small, high);
  }


  
  ia.createShape1 = function(small, high) {
    ia.beginShape();
    ia.vertex(-high, v0,0 ); //links
    ia.vertex(-small, small, 0 ); //unten links
    ia.vertex(v0, high, 0); //unten
    ia.vertex(small, small, 0); // unten rechts
    ia.vertex(high, v0, 0); // rechts
    ia.vertex(small, -small, 0); // oben rechts
    ia.vertex(v0, -high, 0); //oben
    ia.vertex(-small, -small, 0); //oben links
    ia.endShape(ia.CLOSE); 
  }


  ia.createBGShape = function(xValue, zValue){
    ia.beginShape();

    let mx1 = ia.map(ia.mouseX, 0, ia.width, -1.0, 1.0);
    let my1 = ia.map(ia.mouseY,0, ia.height, -1.0, 1.0);

    ia.applyMatrix(   1.0, mx1,  0.0,  0.0,
                      my1, 1.0, 0.0,  0.0,
                      0.0, 0.0,  1.0,  0.0,
                      0.0, 0.0, 0.0,  1.0);

    ia.vertex(-xValue,-xValue,zValue);
    ia.vertex(0,-150,zValue);
    ia.vertex(xValue,-xValue,zValue);
    ia.vertex(150,-0,zValue);
    ia.vertex(xValue,xValue,zValue);
    ia.vertex(0,150,zValue);
    ia.vertex(-xValue,xValue,zValue);
    ia.vertex(-150,0,zValue);
    

    ia.endShape();
  }

}



  let sIndia = new p5(sketchIndia);


