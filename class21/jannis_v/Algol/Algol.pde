import java.util.Collections;
import processing.sound.*;


Boolean soundcard = false;

PImage img;


PGraphics pg;
PGraphics mask;
PShader portalShader;
PShader textureShader;
SoundFile file;
AudioIn in;


Amplitude amp;
BeatDetector beat;
FFT fft;

float currentAmp = 0;
int bands = 1024;
float[] spectrum = new float[bands];

float bpm = 138.0;


Boolean trigger = true;

ColorContainer cyan = new ColorContainer(color(13.0, 112.0, 143.0));
ColorContainer yaleblue = new ColorContainer(color(20.0, 57.0, 102.0));
ColorContainer solidpink = new ColorContainer(color(345.0, 63.0, 47.0));
ColorContainer orange = new ColorContainer(color(222.0, 82.0, 67.0));

ArrayList <ColorContainer> colorList = new ArrayList<ColorContainer>();

final static int depthSteps = 12;
IntList[] colorOrder;
int distance;
final static float goldenRatio = 1.618033988749;
int currentFill;
int jitterFactor = 0;


final static float fov = PI/3.0;
float xFrequency;
float yFrequency;
float zFrequency;

int groundObjectWidth;

float xAmplitude;
float yAmplitude;
final static float zAmplitude = 0.75;
float phase = 0.0;
float zoff = 0.0;
float r;
float velocity = 1.0;

void settings()
{
    //size(1000, 700, P3D);
    fullScreen(P3D);
}
void preload()
{
  
}

void setup() 
{

  img = loadImage("audio.png");
    //Anwendung passiert in drawSugaryScene();
    portalShader = loadShader("mask.glsl");
    textureShader = loadShader("texture.glsl");
    
    textureShader.set("texture", img);
      
      xAmplitude = width * 0.05;
      yAmplitude = height * 0.043;
      
      //Every two bars
      xFrequency = (bpm / 8.0) / 60.0;
      
      //Every four bars
      yFrequency = (bpm / 8.0) / 60.0;
      
      //Every eight bars
      zFrequency = (bpm / 8.0) / 60.0;
      
      distance = width / 5;
      groundObjectWidth = width / 5;
      
      pg = createGraphics(width, height, P3D);
    //fullScreen(P3D);
    
      
    colorList.add(cyan);
    colorList.add(yaleblue);
    colorList.add(solidpink);
    colorList.add(orange);
    
    colorOrder = new IntList[depthSteps];
    setUpIndexShuffle();
    currentFill = 15;
    

    
    
    amp = new Amplitude(this);
    
    
    if(soundcard)
    {
      in = new AudioIn(this, 0);
      amp.input(in);
      
        //in.play();
    }
    else
    {
      file = new SoundFile(this, "track.mp3");
      
      amp.input(file);
    
      file.play();
      //file.jump(40);
    }
    


    //noLoop();
}


void draw() 
{   
    background(245);
    translate(width / 2, 0, -50);
  
   //beatDetection();
    drawMask();
    drawScene();
    fill(0,0,0);

    
    portalShader.set("mask",mask);
    portalShader.set("maskThis",pg);
  
    filter(portalShader);
   
    /*
    pushMatrix();
    translate(width/2,0,0);
    image(pg, -width/2, 0, width, height);
    popMatrix();
    */
   
    
    
    if(jitterFactor > 0) jitterFactor--;
    
}


void drawScene()
{
     //directionalLight(255, 255, 255, 0, -1, -1);
    //ambientLight(102, 102, 102);
    stroke(currentFill);
    fill(currentFill);
    
    pg.shader(portalShader);
  //pg.smooth(2);
  //pg.perspective(fov, float(width)/float(height), 0.1, 1000);
    pg.beginDraw();
    //pg.directionalLight(255, 255, 255, 0, 1, -1);
    pg.ambientLight(255, 255, 255);
  //pg.colorMode(ARGB, 255);    
    pg.background(63, 53, 100);
    pg.translate(width / 2, 0, -50);
    pg.stroke(orange.col1);
    pg.fill(orange.col1);
    
    
    
    float currentTime = (float) millis() / 1000.0;
    
    
    float zfactor = map(sin(TWO_PI * zFrequency * currentTime), -1.0, 1.0, 1.25, 1.25 + zAmplitude);
    float xConstant = TWO_PI * xFrequency * currentTime;
    float yConstant = TWO_PI * yFrequency * currentTime;

    
    
    for (int i = 0; i < depthSteps; i++)
    {
        //float spectrumFactor = map(sqrt(sqrt(spectrum[i + 2])), 0.0, 1.0, 1.0, 3.0) * random(-2.0, 2.0);
        float spectrumFactor = 0;
        //println(spectrumFactor);
        float xOffset = xAmplitude * sin(xConstant  + 0.8 * i);
        float yOffset = yAmplitude * map(sin(yConstant + 0.8 * i), -1.0, 1.0, -1.0, 0.0);
        float edgeLength = (distance / 4);
        float pyramidX = (width / 2.0) + xOffset;
        float pyramidZ = i * - distance * zfactor;
        float quadY = height / 2 * goldenRatio + yOffset;
        
        pushMatrix();
        
        translate(0, 0, pyramidZ);

        drawPyramid(edgeLength, (- width /2.0) + xOffset + spectrumFactor, yOffset + spectrumFactor, spectrumFactor);
        drawPyramid(edgeLength, pyramidX + spectrumFactor, yOffset + spectrumFactor, spectrumFactor); 
        drawQuad(groundObjectWidth, distance * (zfactor / 4), xOffset + spectrumFactor, quadY + spectrumFactor, spectrumFactor);   
        
        popMatrix();
        
        pg.pushMatrix();
        
        pg.translate(0, 0, pyramidZ);

        drawGrape(edgeLength * 0.65,(- width /2.0) + xOffset + spectrumFactor, yOffset + spectrumFactor, spectrumFactor);
        drawGrape(edgeLength * 0.65, pyramidX + spectrumFactor, yOffset + spectrumFactor, spectrumFactor); 
        drawCircle(groundObjectWidth, distance * (zfactor / 4), xOffset + spectrumFactor, quadY + spectrumFactor, i);   
        
        pg.popMatrix();
    } 
    pg.endDraw();
    
    phase += 0.01;
    
    
    r = 300;
  
}

void drawPyramid(float t, float posX, float posY, float posZ) 
{ 
    
    stroke(0);
    
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

void drawQuad(float squareWidth, float squareDepth, float posX, float posY, float posZ)
{
    beginShape(QUAD);
    
    fill(currentFill);
    
    vertex(-squareWidth + posX, posY, posZ);
    vertex(posX, posY,  -squareDepth + posZ);
    vertex(squareWidth + posX, posY, posZ);
    vertex(posX, posY, squareDepth + posZ);
    
    endShape();
}


void drawMask()
{
    mask = createGraphics(width, height,P2D);
    mask.noSmooth();
    
    float currentTime = (float) millis() / 1000.0;
        
    float phase = sin(TWO_PI * xFrequency * currentTime);
    float offFactor = map(phase, -1.0, 1.0, 5.0, 3.0);
    
    float lerp = 0.98; //must be between 0-1
    currentAmp = lerp * currentAmp + (1.0-lerp) * amp.analyze();
    
    //println(currentAmp);
    
    float compressedAmp = pow(currentAmp, 4.2);
   
    
    mask.beginDraw();
    mask.fill(0,0,0);
    mask.pushMatrix();
    mask.translate(width/2, height/2);
    mask.beginShape();
    
    noFill();
    noStroke();
    pushMatrix();
    translate(0, height/2, 110);
    textureWrap(REPEAT);
    beginShape();
    texture(img);
    //shader(textureShader);
    for (float a = 0.0; a < TWO_PI; a += 0.01) {
      float xoff = map(cos(a), -1.0, 1.0, 0.0, offFactor);
      float yoff = map(sin(a), -1.0, 1.0, 0.0, offFactor);
      //r = map(noise(xoff, yoff,zoff), 0.0, 1.0, 100.0, 250.0) * ((float) frameCount)/velocity;
      r = map(noise(xoff, yoff,zoff), 0.0, 1.0, height/4, height/2) * (40.0 * compressedAmp);
      //r = map(spectrum[i-1], 0.0, 1.0, height/4, height/2) * (35.0 * compressedAmp);
      float x = r * cos(a);
      float y = r * sin(a);
      
      mask.vertex(x, y);
      vertex(x,y,x+width/2,y+height/2);
    }
    
    zoff += 0.01;
    
    endShape(CLOSE);
    popMatrix();
    mask.endShape(CLOSE);
    mask.popMatrix();
    mask.endDraw();
}



void drawGrape(float r, float posX, float posY, float posZ) 
{  
    //this pyramid has 4 sides, each drawn as a separate triangle
    //each side has 3 vertices, making up a triangle shape
    //the parameter " t " determines the squareWidth of the pyramid
    
    pg.noStroke();
    pg.fill(orange.col1);

   
  
  
  float x;
  float z;
  float gridRadius = ((float) width) / 9.0;
  float rotationSteps;
  float heightFactor = 0.82;
  
  float h = posY;
  int layers = 10;
  
  pg.noStroke();
  pg.fill(orange.col1);
  
  for(int i = 0; i <= layers; i++)
  {
    int indexSkip = (i + 2) % colorList.size();
    pg.fill(colorList.get(indexSkip).col1);
    rotationSteps = gridRadius/r * PI;
    for(float a = 0.0; a < TWO_PI; a += TWO_PI / rotationSteps)
    {
      x = gridRadius * cos(a);
      z = gridRadius * sin(a);
      pg.pushMatrix();
      pg.translate(posX + x, h, posZ + z);
      pg.sphereDetail(10);
      pg.sphere(r);
      pg.popMatrix();
    }
     if(i == layers && gridRadius >= 4*r)
     {
       for(float thisGridRadius = gridRadius - 2*r; thisGridRadius >= r; thisGridRadius -= 2*r)
       {
        rotationSteps = thisGridRadius/r * PI;
        for(float a = 0.0; a < TWO_PI; a += TWO_PI / rotationSteps)
        {
          x = thisGridRadius * cos(a);
          z = thisGridRadius * sin(a);
          pg.pushMatrix();
          pg.translate(posX + x, h, posZ + z);
          pg.sphereDetail(10);
          pg.sphere(r);
          pg.popMatrix();
        }
       }
       return;
     }
     
     gridRadius *= heightFactor;
     h += 1.5 * r;
  }
}

void drawCircle(float squareWidth, float squareDepth, float posX, float posY, int depthStep)
{  
    IntList indezes = colorOrder[depthStep];
    pg.pushMatrix();
    pg.translate(0,posY,0);
    pg.rotateX(PI/2);
    
    for(int i = 4; i >= 1; i--)
    {
      int index = indezes.get(i-1);
      pg.fill(colorList.get(index).col1);
      pg.stroke(colorList.get(index).col1);
      pg.pushMatrix();
      pg.translate(0, 0, 0.1 / (float) i);
      pg.ellipse(posX, 0, 2 * squareWidth * ((float) i/4.0), 2 * squareDepth * ((float) i/4.0));
      pg.popMatrix();
    }

    
    pg.popMatrix();
}

class ColorContainer {

color col1=color(0);

ColorContainer(color c_) {
   col1=c_;
} 

}// the constructor

void setUpIndexShuffle()
{
  for(int i = 0; i<colorOrder.length; i++)
  {
    IntList tempList = new IntList(0, 1, 2, 3);
    tempList.shuffle();
    colorOrder[i] = tempList;
  }
}
