// Fragment Shader Program
const fragShader = `
    uniform sampler2D uTexture;

	varying lowp vec4 vColor;
	varying highp vec3 vLighting;
	varying highp vec2 vTextureCoord;
    varying highp vec4 vShadowCoord;
    varying highp vec3 vAmbientLight;

    precision highp float;


    void main() 
    {
        float bias = 0.005;
        if ( texture2D(uTexture, vShadowCoord.xy).x < (vShadowCoord.z - bias) )
        {
            
            gl_FragColor = vec4(vAmbientLight, 1.0);
            return;
        }

        gl_FragColor =  vColor * vec4(vLighting, 1.0);    
    }
`;