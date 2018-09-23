// Vertex shader program

const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    uniform highp vec3 uAmbientLight;
    uniform highp vec3 uDirectionalLightColor;
    uniform highp vec3 uDirectionalVector;

	varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    
    void main(void) 
    {
		vec4 position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

        gl_Position = position;
        gl_PointSize = 2.0;
        vColor = vec4(aVertexNormal, 1.0);

        // Apply lighting effect
        highp vec3 directionalVectorNormalized = normalize(uDirectionalVector);
  
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
        highp float directional = max(dot(transformedNormal.xyz, directionalVectorNormalized), 0.0);
        vLighting = uAmbientLight + (uDirectionalLightColor * directional);
    }
  `;