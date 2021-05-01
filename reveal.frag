#define MAX_LIGHTS 10

precision mediump float;

varying vec3 objPos;
varying vec3 objNormal;
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
	vec3 viewPos=vec3(0.0,0.0,0.0);
	vec4 abslightDir=vec4(0.6,-1.0,0.8, 0.0);
	vec4 absInvertedlightDir=vec4(-0.6,1.0,-0.8, 0.0);

	vec3 nView = normalize(viewPos - objPos);
	vec3 nLight = normalize(uViewMatrix * abslightDir).xyz;
	vec3 nInvLight = normalize(uViewMatrix * absInvertedlightDir).xyz;
	vec3 nNormal = normalize(objNormal);
	vec3 nRefl = reflect(-nLight, nNormal);
	
	float dotLN = dot(nLight, nNormal);
	float dotInvLN = dot(nInvLight, nNormal);
	
	vec3 veiledAmbientCol = vec3(0.1,0.1,0.1);
	vec3 veiledDiffuseCol = vec3(1.0,1.0,1.0);
	vec3 veiledSpecularCol = vec3(1.0,1.0,1.0);
	
	vec3 diffuse = veiledDiffuseCol * dotLN;
	vec3 specular = veiledSpecularCol * pow(max(0.0, dot(nView,nRefl)), 4.0);
	vec3 invDiffuse = veiledDiffuseCol * dotInvLN * 0.3;
	
	vec3 veiledColor = veiledAmbientCol + diffuse * min(getAttn(objPos.z / (uResolution.x * 0.25)), 1.0) + specular * 0.4 + invDiffuse;
	gl_FragColor = vec4(veiledColor, 1.0);
}
