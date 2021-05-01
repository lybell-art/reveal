precision mediump float;

attribute vec3 aPosition; //local position
attribute vec2 aTexCoord; //relative texture coord
attribute vec3 aNormal; //absolute normal vector

uniform mat4 uProjectionMatrix; //camera->viewpoint transformation matrix
uniform mat4 uModelViewMatrix; //local->camera-relative transformation matrix
uniform mat3 uNormalMatrix; //absolute->relative normal transformation matrix

varying vec3 objPos;
varying vec3 objNormal;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = uModelViewMatrix * vec4(aPosition, 1.0); //camera-relative position
  gl_Position = uProjectionMatrix * positionVec4; //screen-relative position
  
  objPos = positionVec4.xyz;
  objNormal = normalize(uNormalMatrix * aNormal);
  vTexCoord = aTexCoord; //texture coordinate
}
