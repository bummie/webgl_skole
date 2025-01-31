// Vertex shader program

const vertShader = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
	attribute vec2 aTextureCoord;
	
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uShadowMatrix;

    uniform highp vec3 uAmbientLight;
    uniform highp vec3 uDirectionalLightColor;
	uniform highp vec3 uDirectionalVector;
	uniform highp vec4 uColor;

	varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec3 vAmbientLight;
    varying highp vec2 vTextureCoord;
    varying highp vec4 vShadowCoord;
    
    const mat4 worldToTextureCoords = mat4(
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.5, 0.5, 0.5, 1.0
    );

    void main(void) 
    {
		vec4 position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

        gl_Position = position;
        gl_PointSize = 2.0;
        vColor = uColor;

        // Apply lighting effect
        highp vec3 directionalVectorNormalized = normalize(uDirectionalVector);
  
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
        highp float directional = max(dot(transformedNormal.xyz, directionalVectorNormalized), 0.0);
        vLighting = uAmbientLight + (uDirectionalLightColor * directional);
        vAmbientLight = uAmbientLight;

        vTextureCoord = aTextureCoord;
        vShadowCoord = worldToTextureCoords * (uShadowMatrix * uModelViewMatrix * aVertexPosition);
    }
  `;