// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec4 uTranslate;
    uniform vec4 uScale;
    uniform vec4 uRotate;

    varying lowp vec4 vColor;
    
    void main(void) 
    {
        gl_Position = uProjectionMatrix * uModelViewMatrix * (aVertexPosition + uTranslate);
        vColor = aVertexColor;
    }
  `;