precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec3 absolutePos;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * positionVec4;
  
  absolutePos = positionVec4.xyz;
  vNormal = aNormal;
  vTexCoord = aTexCoord;
}
