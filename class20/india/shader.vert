



// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision mediump float;
#endif


// p5.js attribute values 
attribute vec3 aPosition;       // the vertex position ////automatically gets the position of every vertex on your canvas / built in shader functionality
attribute vec4 aVertexColor;    // a color value associated with the vertex
attribute vec2 aTexCoord;       // a texture coord associated with the vertex
attribute vec3 aNormal;         // a normal vector associated with the vertex

// Default p5.js uniforms available to both fragment and vertex shader
//Without those varaibles (and multipling them in the gl_Position the output is verformt.)
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;



varying vec3 vPosition;



void main() {

  // Copy the position data into a vec4, adding 1.0 as the w parameter 
  vec4 positionVec4 = vec4(aPosition, 1.0); //when w = 1.0 the vector is treated as a position, when w = 0.0 the vector is treated as a direction / w is 4. parametor in vec4


  //calculation to fix the bug that in p5 all shapes are not in the middle of the sketch
  //positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // Scale to make the output fit the canvas. 


  //save calculations in gl_Position, which is automatically transferred to .frag
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

}