// Fragment Shader Program
const fragShader = `
    uniform sampler2D uTexture;

	varying lowp vec4 vColor;
	varying highp vec3 vLighting;
	varying highp vec2 vTextureCoord;

    void main() 
    {
        //gl_FragColor = texture2D(uTexture, vTextureCoord);
        gl_FragColor = vColor * vec4(vLighting, 1.0);
    }
`;