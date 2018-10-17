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
        float visibility = 1.0;
        if ( texture2D( uTexture, vShadowCoord.xy ).z  ==  vShadowCoord.z){
            visibility = 0.1;
            gl_FragColor = vec4(vec3(0.1), 1.0);
            return;
        }

        //gl_FragColor = texture2D(uTexture, vTextureCoord);
        gl_FragColor = vColor * vec4(vLighting, 1.0);
    
        //gl_FragColor = vec4(vec3(0, vShadowCoord.z, 0), 1.0); // Black Begge verdiene er nesten 0 ?!
        //gl_FragColor = vec4(vec3(0, texture2D( uTexture, vShadowCoord.xy ).z + 1.0, 0), 1.0); //BLACK
    }
`;