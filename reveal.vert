precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  
  vPosition = aPosition;
  vNormal = aNormal;
  vTexCoord = aTexCoord;
}
