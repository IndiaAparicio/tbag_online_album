let song;
let fft;
let button;
let volhistory = [];

function toggleSong(){
    if (song.isPlaying()){
        song.pause();
    }  else {
        song.play();
    }
}


function preload(){
    song = loadSound("audio/Forecast.mp3");
}

function setup(){
    createCanvas(400,400);
    button = createButton('toggle');
    button.mousePressed(toggleSong);
    song.play();
    fft = new p5.FFT(0.9, 64);
}

function draw(){
    background(150);
    let spectrum = fft.analyze();
    stroke(255);
    for(let i = 0; i < spectrum.length; i++){

        let amp = spectrum[i];
        let y = map(amp, 0, 255, height, 0);
        line(i * 5, height, i * 5, y);
    }
    //console.log(spectrum);
    stroke(255);
    noFill();
}

