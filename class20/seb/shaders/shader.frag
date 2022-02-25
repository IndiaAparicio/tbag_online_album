// webgl requires that the first line of the fragment shader specify the precision
// precision is dependent on device, but higher precision variables have more zeros
// sometimes you'll see bugs if you use lowp so stick to mediump or highp
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_fft;
uniform sampler2D u_depth;

vec3 rgb2hsb( in vec3 c ){
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz),
               vec4(c.gb, K.xy),
               step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r),
               vec4(c.r, p.yzx),
               step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                  d / (q.x + e),
                  q.x);
}

void main() {

  vec2 coords = gl_FragCoord.xy / u_resolution.xy;
  vec4 texture = texture2D(u_depth, coords);
  vec3 hsb_tex = rgb2hsb(texture.rgb);
  vec4 c_main = vec4(0.051, 0.0471, 0.0784, 1.0);
  vec4 c_depth = vec4(1.0, 0.1, 0.15, 1.0);
  float fft = smoothstep(0.1, 0.7, u_fft);
  

  // assign redColor to be output to the screen
  gl_FragColor = mix(c_main, c_depth, hsb_tex.z * fft);
}