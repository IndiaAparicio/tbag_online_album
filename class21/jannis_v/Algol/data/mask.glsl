#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

//#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform sampler2D maskThis;
uniform sampler2D mask;

uniform vec2 texOffset;
varying vec4 vertColor;
varying vec4 maskedColor;
varying vec4 vertTexCoord;

void main() {
    
    vec2 st = vertTexCoord.st;
    
    vec4 texColor = texture2D(texture, st).rgba;
    vec4 maskedColor = texture2D(maskThis,st).rgba;
    vec4 maskColor = texture2D(mask, vec2(vertTexCoord.s, vertTexCoord.t)).rgba;
    //vec4 maskColor = texture2D(mask, vertColor.st).rgba;
    
    //gl_FragColor = mix(texColor, vec4(0, 0, 0, 0.5), 1.0 - maskColor.r);
    //float luminance = dot(vec3(0.2126, 0.7152, 0.0722), maskColor);
    
    float alphaMask = maskColor.r;
    
    if (alphaMask > 0.5){
        gl_FragColor = vec4(texColor.r,texColor.g,texColor.b,1.0);
    
    } else {
        gl_FragColor = vec4(maskedColor.r,maskedColor.g,maskedColor.b,1.0 - maskColor.r);
    }
    
}