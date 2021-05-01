#define MAX_LIGHTS 10

precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord; //texture map coord

uniform mat4 uProjectionMatrix; //camera->viewpoint transformation matrix
uniform mat4 uModelViewMatrix; //local->camera-relative transformation matrix
uniform mat4 uViewMatrix; //absolute->camera-relative transformation matrix
uniform vec2 uResolution; //screen width&height
uniform vec3 lightPos[MAX_LIGHTS]; //lights position
//uniform sampler2D video;

float getAttn(float dist)
{
	return 1.0/(1.0 + 0.1*dist + 0.01*dist*dist);
}

void main()
{
	vec3 absolutePos = vPosition;
	vec3 cameraDir=vec3(0.0,0.0,1.0);
	
	vec3 ambientCol=vec3(0.1,0.1,0.1);
	vec3 veiledCol=vec3(1.0,1.0,1.0);
	vec3 diffuseLightDir=normalize((uViewMatrix * vec4(0.7,-0.8,1.0,0.0)).xyz);
	vec3 reflectLightDir=reflect(-diffuseLightDir, vNormal);
	
	vec3 veiledDiffuse = veiledCol * max(0.0, dot(diffuseLightDir, vNormal));
	vec3 veiledSpecular = veiledCol * pow(max(0.0, dot(reflectLightDir,cameraDir)), 8.0);
	float veiledDst = distance(diffuseLightDir * 1000.0, absolutePos);
	float veiledAttn = getAttn(veiledDst / 400.0) ;
	
//	vec3 veiledColor=ambientCol + veiledAttn * (veiledDiffuse + veiledSpecular);
	vec3 veiledColor = veiledSpecular;
//	vec3 veiledColor = diffuseLightDir;
	vec3 uv = lightPos[0]/uResolution.xyx; 
	gl_FragColor=vec4(veiledColor.x, veiledColor.y, veiledColor.z, 1.0);
}
