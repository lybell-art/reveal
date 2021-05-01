#define MAX_LIGHTS 10

precision mediump float;

varying vec3 absolutePos; //camera-relative position
varying vec3 vNormal; //camera-relative normal vector
varying vec2 vTexCoord; //texture map coord

uniform mat4 uViewMatrix; //absolute->camera-relative transformation matrix
uniform vec2 uResolution; //screen width&height
uniform vec3 lightPos[MAX_LIGHTS]; //lights position
//uniform sampler2D video;

void main()
{
	vec3 ambientCol=vec3(0.1,0.1,0.1);
	vec3 diffuseCol=vec3(0.3,0.3,0.3);
	vec3 diffuseLightDir=(uViewMatrix * vec4(0.7,1.0,1.0,1.0)).xyz;
	
	vec3 veiledColor=ambientCol + diffuseCol * dot(diffuseLightDir, vNormal)
	vec3 uv = lightPos[0]/uResolution.xyx; 
	gl_FragColor=vec4(veiledColor.x, veiledColor.y, veiledColor.z, 1.0);
}
