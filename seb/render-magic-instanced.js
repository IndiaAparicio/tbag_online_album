// At the time of creation my mood was not the best, so apologies for the silly naming of some functions. It was a byproduct of my related cynism.

let sketchSeb = function(sw){

    sw.preload = function() {
        this.mySound = sw.loadSound('resources/winds_of_kyoto.mp3', this.setupSound, (err) => console.error(err));
        this.myShader = sw.loadShader('shaders/shader.vert', 'shaders/shader.frag', () => {
            this.mainShaderInit = true;
            console.log("Main Shader loaded");
        }, (err) => console.error(err));
        this.depthShader = sw.loadShader('shaders/shader.vert', 'shaders/depth.frag', () => {
            this.depthShaderInit = true;
            console.log("Depth Shader loaded");
        }, (err) => console.error(err));
    }

    sw.setup = function() {
        this.NUMBER_OF_VERTS = 10;
        this.vertices = [];
        this.matrix = false;
        this.matrixModifier = 1; 
        this.relaxed = true;
        this.isPlaying = false;
        this.clientWidth = document.getElementById('cnv-sketch').clientWidth;
        this.clientHeight = document.getElementById('cnv-sketch').clientHeight;
        this.cnv = sw.createCanvas(this.clientWidth -10, this.clientHeight, sw.WEBGL);
        this.cnv.parent('cnv-sketch');
        this.main = sw.createGraphics(this.clientWidth, this.clientHeight, sw.WEBGL);
        this.outline = sw.createGraphics(this.clientWidth, this.clientHeight, sw.WEBGL);
        sw.giveBirthToPoints();
    }

    sw.setupSound = function(){
        this.amplitude = new p5.Amplitude();
        this.fft = new p5.FFT();
        this.peakDetect = new p5.PeakDetect(200, 2000, 0.002);
        this.mySound.playMode('restart');
        this.duration = this.mySound.duration();
        this.fft.smooth(0.5);
        this.soundInit = true;
    }

    sw.mousePressed = function(){
        if(!this.isPlaying){
            this.mySound.play();
            this.isPlaying = true;
        }
    }

    sw.draw = function() {
        let size, rotate, thickness = 0;
        sw.orbitControl(2.0, 3.0, 0.5);
        sw.background(0);
        if(this.mainShaderInit && this.depthShaderInit && this.soundInit){
            this.fft.analyze();
            size = sw.map(this.fft.getEnergy("highMid"), 0, 255, 1, 10);
            rotate = sw.map(this.fft.getEnergy("lowMid"), 0, 255, 0, sw.HALF_PI * 2);
            thickness = sw.map(this.fft.getEnergy("lowMid"), 0, 255, 1, 10)
            this.peakDetect.update(this.fft);
            if(this.peakDetect.isDetected){
                sw.addVert();
            } 
         
            this.outline.shader(this.depthShader);
            this.outline.orbitControl();
            this.outline.clear();
            this.outline.noStroke();
            this.outline.background(0);
    
            sw.welcomeToTheMatrix(size, rotate, this.outline);
            sw.generateGeometry(this.outline);
            this.outline.pop();
    
            sw.aesthetics(thickness);
            sw.shader(this.myShader);
            sw.welcomeToTheMatrix(size, rotate);
            sw.generateGeometry();
            sw.pop();
            
            this.depthShader.setUniform("u_resolution", [this.depthShader.width, this.depthShader.height]);
            this.depthShader.setUniform("u_time", this.millis() / 1000.0);
            this.myShader.setUniform("u_resolution", [this.width, this.height]);
            this.myShader.setUniform("u_time", this.millis() / 1000.0);
            this.myShader.setUniform("u_depth", this.outline);
            this.myShader.setUniform("u_fft", /*size / */10.0);
        }
    }

    sw.addVert = function(){
        const vertex = sw.createVector(
            sw.random(-sw.windowWidth, sw.width/2), 
            sw.random(-sw.height/2, sw.height/2),
            sw.random(-sw.height/2, sw.height/2)
        );
        sw.vertices.push(vertex);
        sw.vertices.sort(sw.fromMinToMax);
    }

    sw.giveBirthToPoints = function(){
        for(let i = 0; i < this.NUMBER_OF_VERTS; i++){
            sw.addVert();
        }
    }

    sw.generateGeometry = function(context){
        if(context){
            context.beginShape(sw.TRIANGLE_STRIP);
            for(let v of this.vertices){
                context.vertex(v.x, v.y, v.z);
            }
            context.endShape();
        } else {
            sw.beginShape(sw.TRIANGLE_STRIP);
            for(let v of this.vertices){
                sw.vertex(v.x, v.y, v.z);
            }
            sw.endShape();
        }
    }

    sw.welcomeToTheMatrix = function(s, r ,context){

        if (this.matrix) {
            this.matrixModifier += 0.08;
        } else if (!this.relaxed && this.matrixModifier > 1 - (this.matrixModifier / 10)) {
            this.matrixModifier -= (this.matrixModifier / 4) * 0.2 + 0.05;
        } else {
            this.relaxed = true;
            if (this.matrixModifier < 1){
                this.matrixModifier += 0.01;
            }
        }
        if(context){
            context.push();
            context.rotateX(r);
            context.scale(this.matrixModifier * s, 1, 1);
        } else {
            sw.push();
            sw.rotateX(r);
            sw.scale(this.matrixModifier * s, 1, 1);
        }

    }

    sw.activateMatrix = function(){
        this.matrix = true;
    }

    sw.releaseMatrix = function(){
        this.matrix = false;
        this.relaxed = false;
    }

    sw.keyPressed = function(){
        if (sw.keyCode === 32) {
            this.matrix = true;
          } 
          return false;
    }

    sw.keyReleased = function(){
        if (sw.keyCode === 32) {
            this.matrix = false;
            this.relaxed = false;
          }
          return false; // prevent any default behavior
    }

    sw.aesthetics = function(s){
        sw.strokeWeight(2.0 * s);
        sw.stroke(255, 10, 20);
    }

    sw.recordOldCanvas = function(){
        this.oldWidth = sw.width;
        this.oldHeight = sw.height;
    }

    sw.fromMinToMax = function(a, b){
        return  a.x > b.x ? 1 : -1;
    }

    sw.resizeVertices = function(){
        return this.vertices.map(v => { 
            let vert = v
                vert.x = sw.map(vert.x, -oldWidth / 2, oldWidth / 2, -width / 2, width / 2);
                vert.y = sw.map(vert.y, -oldHeight / 2, oldHeight / 2, -height / 2, height / 2);
                return vert;
        })
    }

    sw.maxPosition = function(verts, component){
        return verts.map(vert => vert[component])
                .reduce( (max, vert) => Math.max(max, vert), - (component == "y" ? sw.height : sw.width) / 2);
    }
   

}




let sSeb = new p5(sketchSeb);

