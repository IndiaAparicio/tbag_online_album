precision mediump float;

uniform float u_time;

varying vec4 vColor;

void main() {
    float colChange = sin(u_time);

    vec4 vColor = vec4(vColor.xyz * colChange, 1.0);// I wanted to implement this to see if this would work with 
                                                    // the shader but actuallyit didnt work at all
                                                    // but it worked in other tests but here it didnt

    gl_FragColor = vColor;
}