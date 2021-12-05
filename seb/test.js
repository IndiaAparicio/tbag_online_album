
const test = function (p) {
  
  p.preload = function(){
    this.sound = p.loadSound("./resources/winds_of_kyoto.mp3", this.setupSound);
  }
  
  p.setupSound = function(){
    this.sound.playMode("restart");
  }

  p.setup = function(){

  }
}


const sketchtest = new p5(test)