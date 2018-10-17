// Fragment Shader Program

const fragImageShader = `
    uniform sampler2D uTexture;

    varying highp vec2 vTextureCoord;

    void main() 
    {
        gl_FragColor = vec4(1.0, 0, 0, 1.0); //texture2D(uTexture, vTextureCoord);
    }
`;