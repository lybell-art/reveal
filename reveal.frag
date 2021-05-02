#define MAX_LIGHTS 10

precision mediump float;

varying vec3 objPos; //camera-relative object position
varying vec3 objNormal; //camera-relative normal vector
varying vec2 vTexCoord; //texture map coord

uniform mat4 uProjectionMatrix; //camera->viewpoint transformation matrix
uniform mat4 uModelViewMatrix; //local->camera-relative transformation matrix
uniform mat4 uViewMatrix; //absolute->camera-relative transformation matrix
uniform vec2 uResolution; //screen width&height
uniform vec3 lightPos[MAX_LIGHTS]; //lights position
uniform int lightCount; //the number of lights
uniform sampler2D video; //video textures

float getAttn(float dist)
{
	return 1.0/(1.0 + 0.1*dist + 0.01*dist*dist);
}

void main()
{
	vec3 viewPos=vec3(0.0,0.0,0.0); //camera position
	vec4 abslightDir=vec4(0.6,-1.0,0.8, 0.0); //background light
	vec4 absInvertedlightDir=vec4(-0.6,1.0,-0.8, 0.0); //background backlight-to enhance a 3D effect

	vec3 nView = normalize(viewPos - objPos);
	vec3 nLight = normalize(uViewMatrix * abslightDir).xyz;
	vec3 nInvLight = normalize(uViewMatrix * absInvertedlightDir).xyz;
	vec3 nNormal = normalize(objNormal);
	vec3 nRefl = reflect(-nLight, nNormal);
	
	//get veiled color(not revealed)
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
	
	//calculate enlightning lights
	vec3 revealDiffuseCol = vec3(0.8,0.8,0.8);
	vec3 revealSpecularCol = vec3(1.0,1.0,1.0);
	vec3 revealColor = vec3(0.0, 0.0, 0.0);
	float revealAmount = 0.0;
	for(int i=0; i < MAX_LIGHTS; i++)
	{
		if (i >= lightCount){break;}
		vec3 _lightPos = (uViewMatrix * vec4(lightPos[i], 1.0)).xyz; //change light position to camera-relative
		vec3 _nLight = normalize(_lightPos - objPos); //obj->light direction
		vec3 _nRefl = reflect(-_nLight, nNormal); //reflected light
		
		float _dotLN = dot(_nLight, nNormal); //angle(cosine) of light vector and normal vector
		float _diffuseAmount=max(0.0, _dotLN);
		float _specularAmount=pow(max(0.0, dot(nView,_nRefl)), 16.0); //angle of position vector and reflected light vector
		vec3 _diffuse = revealDiffuseCol * _diffuseAmount;
		vec3 _specular = revealSpecularCol * _specularAmount;
		
		float dist = distance(_lightPos, objPos);
		float attn = getAttn(dist / (uResolution.x * 0.1)) ; //decay light
		revealColor += (_diffuse + _specular)*attn *0.75;
		revealAmount += (_diffuseAmount * 0.8 + _specularAmount)*attn * 0.75;
	}
	revealColor = clamp(revealColor, 0.0, 1.0);
	revealAmount = clamp(revealAmount, 0.0, 1.0);
	
	//Video is revealed in proportion to the enlightning light
	vec2 uv = (gl_FragCoord.xy/uResolution) / 2.0;
	uv.y = 1.0 - uv.y;
	vec4 tex = texture2D(video, uv) * vec4(revealColor, 1.0) * vec4(maskedColor, 1.0);
	
	gl_FragColor = mix(vec4(veiledColor, 1.0), tex, revealAmount);
}
