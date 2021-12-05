

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vPosition;
uniform vec2 mouse;



void main() {

    
    //defining any color (from 0 to 1.0 instead of 0-255)
    vec3 color = vec3(0.0, 0.0, 1.0);

    //gl_FragColor is ALWAYS last line in file and like the return value. it is a vec4 (r,g,b,a) 
    gl_FragColor = vec4(mouse.x, mouse.y, 0.5, 1.0 );

}