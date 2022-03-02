#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

//#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;


uniform vec2 texOffset;
varying vec4 vertColor;
varying vec4 maskedColor;
varying vec4 vertTexCoord;

void main() {
    
    vec2 st = vertTexCoord.st;
    
    vec4 texColor = texture2D(texture, st).rgba;

    gl_FragColor = vec4(texColor.r,texColor.g,texColor.b,1.0);
     
}