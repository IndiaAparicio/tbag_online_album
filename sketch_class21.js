let boxsize, positionCubes, positionText;
let abstand, menge, gesamtmenge, translateNachMenge;
let amp;
let widthMusicVisualizer = 4;
let heightMusicVisualizer = 100;


let font, fontSize;
let anna_b, marco_w, marco_b, marton_g, jonathan_h, andreea_m, tim_r, tillman_s, jannis_v, vivien_s;
let img_anna_b, img_marco_w, img_marco_b, img_marton_g, img_jonathan_h, img_tim_r, img_tillman_s, img_jannis_v, img_vivien_s, img_andreea_m;
let song_anna_b, song_marco_w, song_marco_b, song_marton_g, song_jonathan_h, song_tim_r, song_tillman_s, song_jannis_v, song_vivien_s, song_andreea_m;

let alleProjekte = [];
let startWebsite = false;
let readyForLink = false;

function preload() {
 //rect(0,0,100,100);
 font = loadFont('./assets/Montserrat-Black.ttf');

 img_anna_b = loadImage('./class21/anna_b/assets/anna_b_vorschau.png');
 img_marco_w = loadImage('./class21/marco_w/assets/preview.png');
 img_marco_b = loadImage('./class21/marco_b/assets/Preview.png');
 img_marton_g= loadImage('./class21/marco_b/assets/Preview.png');
 img_jonathan_h = loadImage('./class21/marco_b/assets/Preview.png');
 img_tim_r = loadImage('./class21/marco_b/assets/Preview.png');
 img_tillman_s = loadImage('./class21/marco_b/assets/Preview.png');
 img_jannis_v = loadImage('./class21/marco_b/assets/Preview.png');
 img_andreea_m = loadImage('./class21/marco_b/assets/Preview.png');
 img_vivien_s = loadImage('./class21/marco_b/assets/Preview.png');

 song_anna_b = loadSound('./class21/anna_b/assets/glitchFollows.mp3');
 song_marco_w = loadSound('./class21/marco_w/assets/marco_w.mp3');
 song_marco_b = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_marton_g = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_jonathan_h = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_tim_r = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_tillman_s = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_jannis_v = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_andreea_m = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 song_vivien_s = loadSound('./class21/marco_b/assets/TBAG_DarkChaos-Track.mp3');
 
}


function setup() {


  
    createCanvas(windowWidth, windowHeight, WEBGL);

    boxsize = windowWidth/20;
    positionCubes = windowHeight/10;
    positionText = -windowHeight/8;

    anna_b = new BoxProject(0, boxsize, "GLITCH", "by_Anna_Brauwers", img_anna_b, song_anna_b, './class21/anna_b/anna_bsp.html');
    marco_w = new BoxProject(0, boxsize, "SEADIS'_THEME", "by_Marco_Winter", img_marco_w, song_marco_w, './class21/marco_w/marco_w.html');
    marco_b = new BoxProject(0, boxsize, "DARK_CHAOS", "by_Marco_Braune", img_marco_b, song_marco_b, './class21/marco_b/marco_b.html'); 
    marton_g = new BoxProject(0, boxsize, "FLY", "by_Marton_Gasparik", img_marton_g, song_marton_g, './class21/marton_g/marton_g.html'); 
    jonathan_h = new BoxProject(0, boxsize, "SUPER_FORMULA", "by_Jonathan_Ho", img_jonathan_h, song_jonathan_h, './class21/jonathan_h/jonathan_h.html'); 
    tim_r = new BoxProject(0, boxsize, "FLUX", "by_Tim_Rumpf", img_tim_r, song_tim_r, './class21/tim_r/tim_r.html'); 
    tillman_s = new BoxProject(0, boxsize, "NO_NAME", "by_Tillman_Schaeuble", img_tillman_s, song_tillman_s, './class21/tillman_s/tillman_s.html'); 
    jannis_v = new BoxProject(0, boxsize, "ALGOL", "by_Jannis_Vol", img_jannis_v, song_jannis_v, './class21/jannis_v/jannis_v.html'); 
    andreea_m = new BoxProject(0, boxsize, "A_TRIP_DOWN_THE_SUPERMARKET", "by_Andreea_Mircea", img_andreea_m, song_andreea_m, './class21/andreea_m/andreea_m.html'); 
    vivien_s = new BoxProject(0, boxsize, "HEIZKRAFTWERK_MOABEAT", "by_Vivien_Schreiber", img_vivien_s, song_vivien_s, './class21/vivien_s/vivien_s.html'); 
   

    //Put all Projects in an array
    alleProjekte = [anna_b, marco_w, marco_b, marton_g, jonathan_h, tim_r, tillman_s, jannis_v, andreea_m, vivien_s];
  

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
      text('Class_2021', -windowWidth/2.4, -windowHeight/2.4,0);
      if(mouseX > windowWidth-200 && mouseY > windowHeight-80){
        fill(0,0,255);
        text('Go_To_Class_2020-->', windowWidth/2.4, windowHeight/2.4,0);
        if(mouseIsPressed){
          window.location = "./index.html"
        }
      }
      text('Go_To_Class_2020-->', windowWidth/2.4, windowHeight/2.4,0);
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

 
