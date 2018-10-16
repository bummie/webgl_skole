// Vertex shader program

const vertShadowShader = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main(void) 
  {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
  `;