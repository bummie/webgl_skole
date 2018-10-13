// Fragment Shader Program
const fragImageShader = `
    precision mediump float;

    varying vec2 v_texcoord;

    uniform sampler2D u_texture;

    void main() 
    {
        gl_FragColor = vec4(1, 1, 1, 1); //texture2D(u_texture, v_texcoord);
    }
`;