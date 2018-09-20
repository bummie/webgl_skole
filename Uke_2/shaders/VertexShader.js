// Vertex shader program

const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

	varying lowp vec4 vColor;
	
	varying float x;
    varying float y;
    
    void main(void) 
    {
		vec4 v = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		x = v.x / v.z;
		y = v.y / v.z;
		
        gl_Position = v;
        gl_PointSize = 2.0;
        vColor = aVertexNormal;
    }
  `;