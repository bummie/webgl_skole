// Fragment Shader Program
const fragShader = `
    uniform sampler2D uTexture;

	varying lowp vec4 vColor;
	varying highp vec3 vLighting;
	varying highp vec2 vTextureCoord;
    varying highp vec4 vShadowCoord;

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
        float linValue = LinearizeDepth(vShadowCoord.xy);
        if (  linValue < vShadowCoord.z)//if ( vShadowCoord.z  < -0.88) //
        {
            gl_FragColor = vec4(0.0, 0.6, 0.9, 1.0);
            return;
        }

        //gl_FragColor = vec4(vec3(texture2D(uTexture, vTextureCoord).x), 1.0);
        gl_FragColor = vec4(vec3(linValue), 1.0); //vec4(0.9, 0.3, 0.0, 1.0); //vColor * vec4(vLighting, 1.0);
    
        //gl_FragColor = vec4(vec3(vShadowCoord.z, vShadowCoord.z, vShadowCoord.z), 1.0); // Under 0.0 over -1.0
        //gl_FragColor = vec4(vec3(texture2D( uTexture, vShadowCoord.xy ).z, texture2D( uTexture, vShadowCoord.xy ).z, texture2D( uTexture, vShadowCoord.xy ).z), 1.0); // == 0.0
    }
`;