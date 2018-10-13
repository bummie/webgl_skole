// Fragment Shader Program
const fragShader = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

	void main() 
	{
        gl_FragColor = vColor * vec4(vLighting, 1.0);
    }
`;