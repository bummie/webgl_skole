// Fragment Shader Program

const fragShadowShader = `

	precision highp float;

	float LinearizeDepth()
	{
		float zNear = 0.1;    // TODO: Replace by the zNear of your perspective projection
		float zFar  = 100.0; // TODO: Replace by the zFar  of your perspective projection
		float depth = gl_FragCoord.z;
		return (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
	}

	void main() 
	{
		// gl_FragDepth = gl_FragCoord.z;
		//gl_FragColor = vec4(vec3(LinearizeDepth()), 1);
    }
`;