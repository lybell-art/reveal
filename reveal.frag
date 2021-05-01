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
uniform int lightCount; //the number of lights
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
	
	vec3 veiledAmbientCol = vec3(0.2,0.2,0.2);
	vec3 veiledDiffuseCol = vec3(1.0,1.0,1.0);
	vec3 veiledSpecularCol = vec3(1.0,1.0,1.0);
	
	vec3 diffuse = veiledDiffuseCol * max(0.0, dotLN);
	vec3 specular = veiledSpecularCol * pow(max(0.0, dot(nView,nRefl)), 4.0);
	vec3 invDiffuse = veiledAmbientCol * max(0.0, dotInvLN);
	
	vec3 veiledColor = veiledAmbientCol + diffuse  * min(getAttn(objPos.z / (uResolution.x * 0.25)), 1.0) * 0.5 + invDiffuse + specular * 0.4;
	vec3 maskedColor = 0.9 + veiledColor * 0.1;
	veiledColor *= 0.2;
	
	vec3 revealDiffuseCol = vec3(0.8,0.8,0.8);
	vec3 revealSpecularCol = vec3(1.0,1.0,1.0);
	vec3 revealColor = vec3(0.0, 0.0, 0.0);
	for(int i=0; i < lightCount; i++)
	{
		vec3 _lightPos = (uViewMatrix * vec4(lightPos[i], 1.0)).xyz;
		vec3 _nLight = normalize(_lightPos - objPos);
		vec3 _nRefl = reflect(-_nLight, nNormal);
		
		float _dotLN = dot(_nLight, nNormal);
		vec3 _diffuse = revealDiffuseCol * max(0.0, _dotLN);
		vec3 _specular = revealSpecularCol * pow(max(0.0, dot(nView,_nRefl)), 16.0);
		
		float dist = distance(_lightPos, objPos);
		float attn = getAttn(dist / (uResolution.x * 0.25)) ;
		revealColor += (_diffuse + _specular)*attn;
	}
	gl_FragColor = vec4(revealColor, 1.0);
}
