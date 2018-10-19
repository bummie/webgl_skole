function Light(gl)
{
    let self = this;
    self.position = [0, -2, 1];
    //self.rotation = [0, 0, 0];
    self.scale = [1, 1, 1];

    self.fov = 45;
    self.zNear = 0.1;
    self.zFar = 100.0;

    self.ambientLight = [0.3, 0.3, 0.3];
    self.directionalVector = [0.4, 0.2, 0];
    self.directionalLightColor = [1, 1, 1];

    self.projectionMatrix = mat4.create();
    self.rotationDirection = [0, 0, -1];

    self.textureWidth = 512;
    self.textureHeight = 512;
    self.shadowMap = null; 
    self.frameBufferObject = null; 

    self.scaleOrtho = 4;

    /**
     * Updates the projection matrix with new translation, rotation, scale values
     */
    self.updateProjectionMatrix = function(gl)
    {
        const fieldOfView = glMatrix.toRadian(self.fov); 
		const aspect = self.textureWidth / self.textureHeight;

        mat4.identity(self.projectionMatrix);
		//mat4.perspective(self.projectionMatrix, fieldOfView, aspect, self.zNear, self.zFar);
        mat4.ortho(self.projectionMatrix, -self.scaleOrtho, self.scaleOrtho, -self.scaleOrtho, self.scaleOrtho, self.zNear, self.zFar);

        /*X*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, self.directionalVector[0], [1, 0, 0]);
        /*Y*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, self.directionalVector[1], [0, 1, 0]);
        /*Z*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, self.directionalVector[2], [0, 0, 1]);

        mat4.scale(self.projectionMatrix, self.projectionMatrix, self.scale);

        mat4.translate(self.projectionMatrix, self.projectionMatrix, self.position);
    }

    /**
     * Creates the shadowmap texture in shadowMap
     */
    self.createShadowMap = function(gl, ext)
    {
        if(self.shadowMap != null) { return; }

        self.shadowMap = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, self.shadowMap);
 
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  self.textureWidth, self.textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,  self.textureWidth, self.textureHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        self.frameBufferObject = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, self.frameBufferObject);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, self.shadowMap, 0);
		//gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, self.shadowMap, 0);
    }
}