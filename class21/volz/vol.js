let vorschau;
let vorschau_klick = true;
let song; 

//Original
let pg;
let mask;
let temp;
let portalShader;
let portalShader2;

let trigger = true;
const depthSteps = 12;
let distance;
const goldenRatio = 1.618033988749;
let currentFill;
let jitterFactor = 0;
const fov = Math.floorPI/3.0;

const xWavelength = 62.0;
const yWavelength = 37.0;
const zWavelength = 150.0;

const xAmplitude = 50.0;
const yAmplitude = 30.0;
const zAmplitude = 1.2;

let phase = 0.0;
let zoff = 0.0;
let r;
let velocity = 1.0;

function preload(){
  portalShader2 = loadShader('shader.vert', 'shader.frag');

  song = loadSound('./Algol/data/track.mp3');
  vorschau = loadImage('./Algol/previewImage.png');
}


function setup(){
  let clientWidth = document.getElementById('cnv-sketch').clientWidth;
  let clientHeight = windowHeight * 0.85;
  let cnv = createCanvas(clientWidth -10,clientHeight, WEBGL);
  cnv.parent('cnv-sketch');

  temp = createGraphics(width, height,WEBGL);
    temp.shader(portalShader2);
    mask = createGraphics(width, height);

    pg = createGraphics(width, height, WEBGL);
    //pg.directionalLight(255, 255, 255, -0.1, -0.5, -1);
    //pg.ambientLight(60, 60, 60);
    pg.pointLight(255, 255, 255, 0, 0, 100);
   
    //smooth(2);

    //perspective(fov, width / height, 0.1, 500);

    distance = width /5;
    
    currentFill = 15;

}

function mouseReleased() 
{
    jitterFactor = 30;
}

function draw(){

  if(vorschau_klick){
    image(vorschau, -width/2, -height/2, width, height, vorschau.width/4, vorschau.height/4, width, height);
  }else{
    directionalLight(255, 255, 255, 0, -1, -1);
    ambientLight(102, 102, 102);
    background(245);
    translate(0, -height/2, -50);

    fill(currentFill);

    let zfactor = map(sin(frameCount / zWavelength), -1.0, 1.0, 1.25, 1.25 + zAmplitude);

    
    for (let i = 0; i <= depthSteps; i++)
    {
        let xOffset = xAmplitude * sin((frameCount / xWavelength) + 0.8 * i);
        let yOffset = yAmplitude * map(sin((frameCount / yWavelength) + 0.8 * i), -1.0, 1.0, -1.0, 0.0);
        let edgeLength = (distance / 4.0);
        let pyramidX = (width / 2.0) + xOffset;
        let pyramidZ = i * - distance * zfactor;
        let quadY = height / 2.0 * goldenRatio + yOffset;
        
        push();
        
        translate(0, 0, pyramidZ);

        drawPyramid(edgeLength, -pyramidX + getJitter(jitterFactor), yOffset + getJitter(jitterFactor), getJitter(jitterFactor));
        drawPyramid(edgeLength, pyramidX + getJitter(jitterFactor), yOffset + getJitter(jitterFactor), getJitter(jitterFactor)); 
        drawQuad(200, distance * (zfactor / 4), xOffset + getJitter(jitterFactor), quadY + getJitter(jitterFactor), getJitter(jitterFactor));   
        
        pop();
    }  
    
    drawMask();
    
    
    drawSecondScene();
    
    if(jitterFactor > 0) jitterFactor--;
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


function drawPyramid(t, posX, posY, posZ) 
{ 
    
    //stroke(0);
    
    //this pyramid has 4 sides, each drawn as a separate triangle
    //each side has 3 vertices, making up a triangle shape
    //the parameter " t " determines the squareWidth of the pyramid
    beginShape(TRIANGLES);
    
    vertex( -t + posX, -t + posY, -t + posZ);
    vertex(t + posX, -t + posY, -t + posZ);
    vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    vertex(t + posX, -t + posY, -t + posZ);
    vertex(t + posX, -t + posY, t + posZ);
    vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    vertex(t + posX, -t + posY, t + posZ);
    vertex( -t + posX, -t + posY, t + posZ);
    vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    vertex( -t + posX, -t + posY, t + posZ);
    vertex( -t + posX, -t + posY, -t + posZ);
    vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    endShape();
}

function drawQuad(squareWidth, squareDepth, posX, posY, posZ)
{
    beginShape();
    
    fill(currentFill);
    
    vertex(-squareWidth + posX, posY, posZ);
    vertex(posX, posY,  -squareDepth + posZ);
    vertex(squareWidth + posX, posY, posZ);
    vertex(posX, posY, squareDepth + posZ);
    
    endShape();
}

function drawMask()
{
    //mask.noSmooth();
    //mask.perspective(fov, float(width)/float(height), 0.1, 20000);
   // shader(portalShader);
    
    //mask.beginDraw();
    mask.background(0);
    mask.fill(255,0,0);
    //mask.noSmooth();
    mask.push();
    mask.translate(width/2, height/2);
    mask.beginShape();
    for (let a = 0.0; a < (Math.PI * 2); a += 0.1) {
      let xoff = map(cos(a), -1.0, 1.0, 0.0, 2.0);
      let yoff = map(sin(a), -1.0, 1.0, 0.0, 2.0);
      //r = map(noise(xoff, yoff,zoff), 0.0, 1.0, 100.0, 250.0) * ((float) frameCount)/velocity;
      r = map(noise(xoff, yoff, zoff), 0.0, 1.0, height/2, height) * map(sin(frameCount/ 50.0), -1.0, 1.0, 0.1, 1.2);
      let x = r * cos(a);
      let y = r * sin(a);
      mask.vertex(x, y);
    }
    
    zoff += 0.01;
    
    mask.endShape(CLOSE);
    mask.pop();

    phase += 0.01;
    
}


function getJitter(factor)
{
    return (factor / 5) * random(-1.0, 1.0);
}

function drawSecondScene()
{
  {


  //pg.colorMode(ARGB, 255);    
  pg.background(76, 0, 158);


  //pg.stroke(227, 117, 0);
  pg.noStroke();
  //pg.fill(227, 117, 0);
  pg.ambientMaterial(227, 117, 0);
  pg.push()
  pg.translate(0, -height/2, -50);
  
  let zfactor = map(sin(frameCount / zWavelength), -1.0, 1.0, 1.25, 1.25 + zAmplitude);

    
  for (let i = 0; i <= depthSteps; i++)
  {
      let xOffset = xAmplitude * sin((frameCount / xWavelength) + 0.8 * i);
      let yOffset = yAmplitude * map(sin((frameCount / yWavelength) + 0.8 * i), -1.0, 1.0, -1.0, 0.0);
      let edgeLength = (distance / 4);
      let pyramidX = (width / 2.0) + xOffset;
      let pyramidZ = i * - distance * zfactor;
      let quadY = height / 2 * goldenRatio + yOffset;
        
      pg.push();
        
      pg.translate(0, 0, pyramidZ);

      drawSecondPyramid(edgeLength, -pyramidX + getJitter(jitterFactor), yOffset + getJitter(jitterFactor), getJitter(jitterFactor));
      drawSecondPyramid(edgeLength, pyramidX + getJitter(jitterFactor), yOffset + getJitter(jitterFactor), getJitter(jitterFactor)); 
      drawSecondQuad(200, distance * (zfactor / 4), xOffset + getJitter(jitterFactor), quadY + getJitter(jitterFactor), getJitter(jitterFactor));   
        
     pg.pop();
     
  }
  pg.pop();
  
  }


  portalShader2.setUniform("tex", pg);
  portalShader2.setUniform("mask", mask);

  push()
  translate(-width/2,0,50);
  //temp.background(0);
  temp.rect(0, 0, width, height);

  image(temp, 0,0,width,height);

  pop();
  //image(pg, 0,0,width,height);
  pg.clear();

}

function drawSecondPyramid(t, posX, posY, posZ) 
{ 
    
    //this pyramid has 4 sides, each drawn as a separate triangle
    //each side has 3 vertices, making up a triangle shape
    //the parameter " t " determines the squareWidth of the pyramid
    pg.beginShape(TRIANGLES);
    
    pg.vertex( -t + posX, -t + posY, -t + posZ);
    pg.vertex(t + posX, -t + posY, -t + posZ);
    pg.vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    pg.vertex(t + posX, -t + posY, -t + posZ);
    pg.vertex(t + posX, -t + posY, t + posZ);
    pg.vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    pg.vertex(t + posX, -t + posY, t + posZ);
    pg.vertex( -t + posX, -t + posY, t + posZ);
    pg.vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    pg.vertex( -t + posX, -t + posY, t + posZ);
    pg.vertex( -t + posX, -t + posY, -t + posZ);
    pg.vertex(posX, height / 2 * goldenRatio + posY, posZ);
    
    pg.endShape(CLOSE);
}

function drawSecondQuad(squareWidth, squareDepth, posX, posY, posZ)
{
    pg.beginShape();
    
    pg.vertex(-squareWidth + posX, posY, posZ);
    pg.vertex(posX, posY,  -squareDepth + posZ);
    pg.vertex(squareWidth + posX, posY, posZ);
    pg.vertex(posX, posY, squareDepth + posZ);
    
    pg.endShape(CLOSE);
}