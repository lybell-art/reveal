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
	vec3 cameraDir=vec3(0.0,0.0,1.0);
	
	vec3 ambientCol=vec3(0.1,0.1,0.1);
	vec3 diffuseCol=vec3(1.0,1.0,1.0);
	vec3 diffuseLightDir=normalize((uViewMatrix * vec4(0.7,-1.0,1.0,0.0)).xyz);
	vec3 harfDiffuseLightDir=normalize((cameraDir+diffuseLightDir)/2);
	
	vec3 veiledColor=ambientCol + diffuseCol * dot(diffuseLightDir, vNormal) + diffuseCol * pow(max(0.0, dot(harfDiffuseLightDir,vNormal)), 2.5);
//	vec3 veiledColor = diffuseLightDir;
	vec3 uv = lightPos[0]/uResolution.xyx; 
	gl_FragColor=vec4(veiledColor.x, veiledColor.y, veiledColor.z, 1.0);
}
