// Fragment Shader Program
const fsSource = `
    varying lowp vec4 vColor;

	varying lowp float x;
	varying lowp float y;
	
	void main() 
	{
        gl_FragColor = vColor; //vec4(sin(0.5 * x + 0.5), sin(-0.5 * y + 0.5), sin(x), 1.0 );
    }
`;