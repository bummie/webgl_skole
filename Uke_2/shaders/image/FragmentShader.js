// Fragment Shader Program

const fragImageShader = `
    uniform sampler2D uTexture;

    varying highp vec2 vTextureCoord;

    void main() 
    {
        gl_FragColor = texture2D(uTexture, vTextureCoord);
    }
`;