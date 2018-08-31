// Fragment Shader Program
const fsSource = `
    varying lowp vec4 vColor;

	varying lowp float x;
	varying lowp float y;
	
	void main() 
	{
        gl_FragColor = vec4( 0.5 * x + 0.5, -0.5 * y + 0.5, 0.2, 1.0 );
    }
`;