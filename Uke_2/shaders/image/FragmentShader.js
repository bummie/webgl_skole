// Fragment Shader Program

const fragImageShader = `
    uniform sampler2D uTexture;

    varying highp vec2 vTextureCoord;

    precision highp float;

    void main() 
    {
        gl_FragColor = vec4(vec3( texture2D( uTexture, vTextureCoord).x ), 1.0);
    }
`;