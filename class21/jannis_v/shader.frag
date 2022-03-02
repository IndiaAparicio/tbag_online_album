// Set the precision
precision highp float;

uniform float slider;

uniform vec2 mouse;

uniform sampler2D tex;
uniform sampler2D mask;

uniform vec2 resolution;

varying vec2 vTexCoord;

void main() {
  
  vec2 uv = vTexCoord;
  // Flip the texture coords
  uv.y = 1.0 - uv.y;
  
  vec4 mask = texture2D(mask, uv).rgba;
  vec4 scene = texture2D(tex, uv).rgba;
  
  float alphaMask = mask.r;

  if (alphaMask > 0.5){
        gl_FragColor = vec4(scene.r,scene.g,scene.b, 1.0);
    
    } else {
        gl_FragColor = vec4(scene.r,scene.g,scene.b, 0.0);
    }
    /*
      vec2 uv = vTexCoord;
  // Flip the texture coords
  uv.y = 1.0 - uv.y;
  
  vec2 texel = 1.0 / resolution;
  
  vec4 wobble = texture2D(mask, uv);
  vec4 scene = texture2D(tex, uv);
  
  float grad = step(uv.x, 0.7) * step(uv.y, 0.3) * step(0.2, uv.x) * step(0.2, uv.y);
  
  vec4 color = mix(scene, wobble, grad);

  gl_FragColor = color;
  gl_FragColor.a = 1.0;
  */
} 