let angle = 0;
let v100 = 100;
let v0 = 0;
let v75 = 75;
let slider;
let fft;
let amp;
let uniformsShader;
let tra100 = 100;

let bgColor = 20;
let lightColor = 255;

function preload(){

    uniformsShader = loadShader('shader.vert', 'shader.frag');
    song = loadSound('./img/audio-project-m.mp3');
}

function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL);
    noStroke();
    song.play();
    amp = new p5.Amplitude(0.8); //smoothening
    fft = new p5.FFT(0.95, 64); //second value array length, dirst value smoothening
}

function draw(){
    shader(uniformsShader);

    let mx = map(mouseX, 0, width, 0, 255);
    let my = map(mouseY, 0, height, 0, 255);


    background(mx, 0, bgColor);




    //////////////////////// MAPPING VARIABLES TO SOUND ////////////////////////////////////

    let spectrum = fft.analyze(); //gives us an array
    let bass, lowMid, mid, highMid, treble;

    bass = fft.getEnergy("bass");
    lowMid = fft.getEnergy("lowMid");
    mid = fft.getEnergy("mid");
    highMid = fft.getEnergy("highMid");
    treble = fft.getEnergy("treble");
    //console.log("Bass: "+bass+" lowMid: "+lowMid+" mid: "+mid+" highMid: "+highMid+" treble: "+treble);    

    let vol = amp.getLevel();
    diam = map(vol, 0, 1, 20, 300);

    v75 = map(bass, 0, 255, -350, -20);
    v100 = map(mid, 0, 255, -350, -20);

    v75_1 = map(mid, 0, 255, 60, 120);
    v100_1 = map(treble, 0, 255, 60, 320);

   





    //////////////////////// SHADER / LIGHT ////////////////////////

    uniformsShader.setUniform('mouse', [mx, my]);

    
    stroke(255);
    strokeWeight(1);
    ambientLight(100);
    directionalLight(lightColor,mx,my,0,0,-1);





    push();
    fill(100);
    noStroke();
    let formZ = map(bass,0,255,-1000,200);
    tra100 = map(bass,0,255,50,150);
    createBGShape(tra100,formZ);
    pop();

  
push();
scale(2);  
    for (let i = 0; i < 10; i++){
        push();
        noStroke();
        fill(100-(i*10));
        scale(i*0.9);
        createBGShape(tra100, -600-i);
        pop();
    }
pop();


    //////////////////////// MOVING AND ROTATING MATRIX ////////////////////////
  
    rotateX(angle);
    rotateY(angle * 0.4);
    rotateZ(angle * 0.3);

  

    //////////////////////// GEOMETRY ////////////////////////
    
    //Box
    fill(255);
    shader(uniformsShader);
    noStroke();
    box(diam);

    strokeWeight(2);
    noFill();

    // outer Cage
    stroke(highMid);
    createShape2(v75, v100);

    //inner Cage
    stroke(bass,0,0);
    createShape2(v75_1, v100_1);

    angle += 0.007;

    let randomPositionX = [-300,  100,  50,  0,  -250, 300, 250, -300,  250,-300,200, -50];
    let randomPositionY = [100,  -300,  250,-300,200, -50,  300,-300,  100,  -300, 0 ,100];
    let randomPositionZ = [-300,  100,  -300, 0 ,100, 0, -200,200, -50,  300,100,  -300 ];
    for(let i = 0; i <randomPositionX.length; i++){
        translate(randomPositionX[i],randomPositionY[i],randomPositionZ[i]);
        rotateZ(randomPositionX[i]*0.02);
        rotateX(mouseY*0.001);
        rotateY(mouseX*0.001);
        sphere(10);
    }
    
    for(let i = 0; i <randomPositionX.length; i++){
        stroke(255);
        translate(0,0,0);
        rotateY(mouseY*0.001);
        rotateZ(-3);
        rotateX(mouseX*0.001);
        translate(randomPositionX[i],randomPositionY[i],randomPositionZ[i]);
        sphere(10);
    }
    

  
    

  

   
    

    

orbitControl();

}

function mousePressed(){
    bgColor = random (0,255);
    lightColor = random(0,255);
}


function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}





//////////////////////// CREATING CAGES ////////////////////////

function createShape2(small, high){
    createShape1(small, high);
    rotateX(PI/2);
    createShape1(small, high);
    rotateX(-PI/2);
    createShape1(small, high);

    rotateY(PI/2);
    createShape1(small, high);
    rotateY(-PI/2);
    createShape1(small, high);
}

function createShape1(small, high) {
    beginShape();
    vertex(-high, v0,0 ); //links
    vertex(-small, small, 0 ); //unten links
    vertex(v0, high, 0); //unten
    vertex(small, small, 0); // unten rechts
    vertex(high, v0, 0); // rechts
    vertex(small, -small, 0); // oben rechts
    vertex(v0, -high, 0); //oben
    vertex(-small, -small, 0); //oben links
    endShape(CLOSE); 
}



function createBGShape(xValue, zValue){
    beginShape();


    // Matrix for rotation around the Y axis
    let mx1 = map(mouseX, 0, windowWidth, -1.0, 1.0);
    let my1 = map(mouseY,0,windowHeight, -1.0, 1.0)
    console.log(mouseX);
    applyMatrix(  1.0, mx1,  0.0,  0.0,
                 my1, 1.0, 0.0,  0.0,
                 0.0, 0.0,  1.0,  0.0,
                 0.0, 0.0, 0.0,  1.0);
    vertex(-xValue,-xValue,zValue);
    vertex(0,-150,zValue);
    vertex(xValue,-xValue,zValue);
    vertex(150,-0,zValue);
    vertex(xValue,xValue,zValue);
    vertex(0,150,zValue);
    vertex(-xValue,xValue,zValue);
    vertex(-150,0,zValue);
    endShape();
}