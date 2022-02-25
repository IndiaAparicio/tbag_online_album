precision mediump float;

attribute vec3 aPosition;
attribute vec3 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vPosition;
varying vec4 vColor;

void main(){
    vec4 vPosition = vec4(aPosition, 1.0);

    //vColor = aVertexColor; // the console told me that it isnt able to convert 

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;
}