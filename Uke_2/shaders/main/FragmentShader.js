// Fragment Shader Program
const fragShader = `
    uniform sampler2D uTexture;

	varying lowp vec4 vColor;
	varying highp vec3 vLighting;
	varying highp vec2 vTextureCoord;
    varying highp vec4 vShadowCoord;

    precision highp float;

    void main() 
    {
        if ( texture2D( uTexture, vShadowCoord.xy ).z  >  vShadowCoord.z)//if ( vShadowCoord.z  < -0.88) //
        {
            gl_FragColor = vec4(0.0, 0.6, 0.9, 1.0);
            return;
        }

        //gl_FragColor = texture2D(uTexture, vTextureCoord);
        gl_FragColor = vec4(0.9, 0.3, 0.0, 1.0); //vColor * vec4(vLighting, 1.0);
    
        //gl_FragColor = vec4(vec3(0, vShadowCoord.z, 0), 1.0); // Under 0.0 over -1.0
        //gl_FragColor = vec4(vec3(0, texture2D( uTexture, vShadowCoord.xy ).z + 1.0, 0), 1.0); // == 0.0
    }
`;