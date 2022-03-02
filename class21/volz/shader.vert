// attribute is the variable type
// vec3 is the data type
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main(){
  
  vTexCoord = aTexCoord;
  
  // vec4 holds 4 components xyzw or rgba or stuv
  vec4 position = vec4(aPosition.x, aPosition.y, aPosition.z, 1.0);
  
  position.xy = position.xy * 2.0 - 1.0;
  
  // Output the position from the shader
  gl_Position = position;
}