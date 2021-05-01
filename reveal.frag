#define MAX_LIGHTS 10

precision mediump float;

varying vec3 absolutePos;
varying vec3 vNormal;
varying vec2 vTexCoord;

uniform vec2 uResolution;
uniform vec3 lightPos[MAX_LIGHTS];
//uniform sampler2D video;

void main()
{
  vec3 uv = lightPos[0]/uResolution.xyx; 
  gl_FragColor=vec4(uv.x, uv.y, uv.z, 1.0);
//  vec3 c = -vNormal*0.5 + 0.5;
//  vec4 color = vec4(c.x, c.z, 0 ,1.0);
//  vec4 screenCol = vec4(0.3, 0.3, 0, 1.0);
  // Lets just draw the texcoords to the screen
//  gl_FragColor = 1.0 - (1.0-color) * (1.0-screenCol);
}
