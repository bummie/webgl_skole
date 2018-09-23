// Fragment Shader Program
const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

	void main() 
	{
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * vec4(vLighting, 1.0);
    }
`;