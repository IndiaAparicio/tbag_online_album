let boxsize, positionCubes, positionText;
let abstand, menge, gesamtmenge, translateNachMenge;
let amp;
let widthMusicVisualizer = 4;
let heightMusicVisualizer = 100;


let font, fontSize;
let india, malte, sylvia, lucas, orkun, ula, johanna, seb;
let img_johanna, img_india, img_orkun, img_sylvia, img_seb, img_lucas, img_ula, img_malte;
let song_johanna, song_india, song_orkun, song_sylvia, song_seb, song_lucas, song_ula, song_malte;
let alleProjekte = [];
let startWebsite = false;
let readyForLink = false;

function preload() {
 //rect(0,0,100,100);
 font = loadFont('./assets/Montserrat-Black.ttf');

 img_johanna = loadImage('./class20/johanna/assets/johanna_vorschau-min.png');
 img_india = loadImage('./class20/india/assets/india_vorschau-min.png');
 img_malte = loadImage('./class20/malte/assets/malte_vorschau-min.png');
 img_seb = loadImage('./class20/seb/assets/seb_vorschau-min.png');
 img_sylvia = loadImage('./assets/origamiclouds.png');
 img_lucas = loadImage('./class20/lucas/assets/lucas-min.png');
 img_orkun = loadImage('./class20/orkun/assets/orkun_vorschau-min.png');
 img_ula = loadImage('./class20/ula/assets/ula_vorschau-min.png');

 song_johanna = loadSound('./class20/johanna/assets/johanna_sound.mp3');
 song_india = loadSound('./class20/india/assets/india_sound.mp3');
 song_malte = loadSound('./class20/malte/assets/malte_sound.mp3');
 song_seb = loadSound('./class20/seb/assets/seb_sound.mp3');
 song_sylvia = loadSound('./class20/sylvia/assets/sylvia_sound.mp3');
 song_lucas = loadSound('./class20/lucas/assets/lucas_sound.mp3');
 song_orkun = loadSound('./class20/orkun/assets/orkun_sound.mp3');
 song_ula = loadSound('./class20/ula/assets/ula_sound.mp3');
 
}


function setup() {


  
    createCanvas(windowWidth, windowHeight, WEBGL);

    boxsize = windowWidth/20;
    positionCubes = windowHeight/10;
    positionText = -windowHeight/8;

    //Create all Projects as an Object
    india = new BoxProject(0,boxsize,"SLEEP_PARALYSIS", "by_India_Aparicio", img_india, song_india, './class20/india/india.html');
    malte = new BoxProject(0,boxsize,"S2_NACH_BERNAU", "by_Malte_Hillebrand", img_malte, song_malte, './class20/malte/malte.html');
    lucas = new BoxProject(0,boxsize,"THOUGHTS_IN_PROGRESS", "by_Lucas_Grey", img_lucas, song_lucas, './class20/lucas/lucas.html');
    ula = new BoxProject(0,boxsize,"SWARM", "by_Ula_Przybylska", img_ula, song_ula, './class20/ula/ula.html');
    sylvia = new BoxProject(0,boxsize,"ALIEN_SWAMP", "by_Sylvia_Rybak", img_sylvia, song_sylvia, './class20/sylvia/sylvia.html');
    orkun = new BoxProject(0,boxsize,"WARFARE_PARADISE", "by_Orkun_Aydinli", img_orkun, song_orkun, './class20/orkun/orkun.html');
    johanna = new BoxProject(0,boxsize,"A_WEIRD_MORNING", "by_Johanna_Hartmann", img_johanna, song_johanna, './class20/johanna/johanna.html');
    seb = new BoxProject(0,boxsize,"WINDS_OF_KYOTO", "by_Sebastian_Wilhelm",img_seb, song_seb, './class20/seb/seb.html');

    //Put all Projects in an array
    alleProjekte = [india, malte, lucas, ula, sylvia, orkun, johanna, seb];
  

    //FONT
    fontSize = windowWidth/25;

    textFont(font);
    textSize(fontSize);
    textAlign(CENTER, CENTER);


    
    centerBoxes();


    fft = new p5.FFT(0.9, 128);
    

}
  
function draw() {

    background(0,0,0);

    
   if(startWebsite){
      //create all Boxes
      push();
      translate(translateNachMenge,0,0);
      for(let i = 0; i < menge; i++){
            //createBox(i*abstand,boxsize);
            alleProjekte[i].positionX = i*abstand;
            alleProjekte[i].creationBox();  
      }
      pop();
      textSize(fontSize/5);
      fill(255);
      text('Class_2020', -windowWidth/2.4, -windowHeight/2.4,0);
      text('Go_To_Class_2021-->', windowWidth/2.4, windowHeight/2.4,0);
   }else{
      fill(255);
      text('Click_to_start', 0, 0,0);
   }

   //MUSIC VISUALIZER
    let spectrum = fft.analyze();
    //make spectrum shorter because the highest tones never get visualized
    for(let i = 0; i < 20; i++){spectrum.pop();}
    for (let i = 0; i < spectrum.length; i++) {
        let amp = spectrum[i];
        let y = map(amp, 0, 128, 0, heightMusicVisualizer);
        stroke(250);
        fill(255);
        push();
          translate(-(widthMusicVisualizer*spectrum.length)/2, positionText-30);
          rect(i*widthMusicVisualizer, 0, widthMusicVisualizer, -y);
        pop();
      //line(i, height, i, y);
    }
}

function mousePressed(){
  startWebsite = true;
  setTimeout(setLinkReady, 500);
}

function setLinkReady(){
  readyForLink = true;
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    for(let i = 0; i < menge; i++){
      alleProjekte[i].size = windowWidth/20;
      boxsize = windowWidth/20;
    }

    centerBoxes();

}


//Values I need to push all boxes in the center, depending on amount of projects 
function centerBoxes() {
    abstand = windowWidth/10;
    menge = alleProjekte.length;
    gesamtmenge = ((boxsize)*menge) + ((abstand-boxsize)*(menge-1));
    translateNachMenge = (-gesamtmenge/2) + (boxsize/2);
}





//The projects-class
  class BoxProject{
    constructor(positionX, size, text, byName, img, song, link){
      this.positionX = positionX;
      this.size = size;
      this.text = text;
      this.byName = byName;
      this.img = img;
      this.song = song;
      this.link = link;
      this.soundOn = false;
      this.positionY = positionCubes;
    }

    creationBox(){
      //If certain 
      if(mouseX > windowWidth/2-this.size/2+this.positionX+translateNachMenge && mouseX < windowWidth/2+this.size/2+this.positionX+translateNachMenge){
        
        //PLAY SOUND
        if(!this.soundOn){
          this.song.play();
          this.soundOn = true;
        }
        push();
          //BACKGROUND RECTANGLE
          noStroke();
          fill(0,0,100);
          translate(0,-boxsize,-boxsize);
          image(this.img,this.positionX-abstand/2,-windowHeight/2,abstand,windowHeight*1.2,this.img.width/2,0,abstand,windowHeight*2);
          //rect(this.positionX-abstand/2,-windowHeight/2, abstand,windowHeight*2);
        pop();
        push();
          //BOX
          noFill();
          stroke(255);
          this.positionY -= 1;
          if(this.positionY < -windowHeight/2){
            this.positionY = windowHeight/2;
          }
          translate(this.positionX,this.positionY,0);
          rotateX(frameCount * 0.01);
          rotateY(frameCount * 0.01);
          box(this.size);
        pop();

        push();
          //TEXT
          translate(gesamtmenge/2-this.size/2,positionText,0);
          fill(255);
          textSize(fontSize);
          text(this.text, 0, 0,0);
          translate(0,fontSize,0);
          textSize(fontSize/3);
          text(this.byName, 0, 0,0);
        pop();

        if(mouseIsPressed && readyForLink){
          //console.log('pressed');
          window.location = this.link;
        }
      }else{
        this.song.stop();
        this.soundOn = false;
        this.positionY = positionCubes;

        push();
        noStroke();
          //fill(155,0,0);
          let locX = mouseX - windowWidth / 2;
          let locY = mouseY - windowHeight / 2;

          
          specularColor(255, 0, 0);
          //pointLight(255, 0, 0, 0, locX, 50);
          specularColor(0, 255, 0);
          pointLight(0, 0, 255, -windowWidth/2, -windowHeight/2, -100);
          pointLight(locX, locY, 0, locX, locY, -100);
          ambientLight(abs(locX)/5, 0, locX/5);
          specularMaterial(250);
          shininess(0);
          translate(this.positionX,this.positionY,0);
          rotateX(frameCount * 0.01);
          rotateY(frameCount * 0.01);
          box(this.size);

          //other shapes
          //torus(30, 15, 3, 12);
          //sphere(this.size/5);
          //torus(this.size/1.5, this.size/20);
          //rotateX(frameCount * -0.01);
          //rotateY(frameCount * -0.01);
          //torus(this.size/2.5, this.size/20);

        pop();
      }

    }
  }

 
