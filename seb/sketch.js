let sketchIndia = function(i){

  
  

  i.setup = function() {
    let clientWidth = document.getElementById('cnv-sketch').clientWidth;
    let clientHeight = document.getElementById('cnv-sketch').clientHeight;
    let cnv = i.createCanvas(clientWidth -10,clientHeight, i.WEBGL);
    cnv.parent('cnv-sketch');
    //cnv.position(100,200);
  }
  
  i.draw = function() {
    
    i.background(i.mouseX,10,2);
    i.directionalLight(255,255,0,i.mouseX,i.mouseY,255);
    i.ambientMaterial(255);

    i.specularMaterial(255);
    i.sphere(80);

  }

  //i.windowResized = function() {
  //  i.resizeCanvas(i.windowWidth, i.windowHeight);
  //}

}

let sIndia = new p5(sketchIndia);





