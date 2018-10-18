// Fragment Shader Program

const fragImageShader = `
    uniform sampler2D uTexture;

    varying highp vec2 vTextureCoord;

    precision highp float;

    float LinearizeDepth(in vec2 uv)
    {
        float zNear = 0.1;    // TODO: Replace by the zNear of your perspective projection
        float zFar  = 100.0; // TODO: Replace by the zFar  of your perspective projection
        float depth = texture2D(uTexture, uv).x;
        return (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
    }

    void main() 
    {
        float c = LinearizeDepth(vTextureCoord);
        gl_FragColor = vec4(c, c, c, 1.0);

        //gl_FragColor = vec4(vec3( texture2D( uTexture, vTextureCoord.xy ).z ), 1.0); //texture2D(uTexture, vTextureCoord); // vec4(1.0, 0, 0, 1.0); //
    }
`;