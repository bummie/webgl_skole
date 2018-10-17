// Vertex shader program

const vertImageShader = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    
    void main(void) 
    {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;;
        gl_PointSize = 2.0;

        vTextureCoord = aTextureCoord;
    }
  `;