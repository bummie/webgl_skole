// Fragment Shader Program

const fragImageShader = `
    uniform sampler2D uTexture;

    varying highp vec2 vTextureCoord;

    precision highp float;

    void main() 
    {
        float n = 1.0;
        float f = 10.0;
        float z = texture2D(uTexture, vTextureCoord.st).x;
        float grey = (2.0 * n) / (f + n - z*(f-n));
        vec4 color = vec4(grey, grey, grey, 1.0);
        gl_FragColor = color;

        //gl_FragColor = texture2D(uTexture, vTextureCoord); // vec4(1.0, 0, 0, 1.0); //
    }
`;