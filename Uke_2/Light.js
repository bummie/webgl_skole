function Light(gl)
{
    let self = this;
    self.position = [0, 1, 1];
    //self.rotation = [0, 0, 0];
    self.scale = [1, 1, 1];

    self.fov = 45;
    self.zNear = 0.1;
    self.zFar = 100.0;

    self.ambientLight = [0.3, 0.3, 0.3];
    self.directionalVector = [0.85, 0.8, 0.75];
    self.directionalLightColor = [1, 1, 1];

    self.projectionMatrix = mat4.create();
    self.rotationDirection = [0, 0, -1];

    self.textureWidth = 256;
    self.textureHeight = 256;
    self.shadowMap = gl.createTexture();
    self.frameBufferObject = gl.createFramebuffer();

    /**
     * Updates the projection matrix with new translation, rotation, scale values
     */
    self.updateProjectionMatrix = function(gl)
    {
        const fieldOfView = glMatrix.toRadian(self.fov); 
		const aspect = self.textureWidth / self.textureHeight;

        mat4.identity(self.projectionMatrix);
		mat4.perspective(self.projectionMatrix, fieldOfView, aspect, self.zNear, self.zFar);
       
        /*X*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, glMatrix.toRadian(self.directionalVector[0]), [1, 0, 0]);
        /*Y*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, glMatrix.toRadian(self.directionalVector[1]), [0, 1, 0]);
        /*Z*/ mat4.rotate(self.projectionMatrix, self.projectionMatrix, glMatrix.toRadian(self.directionalVector[2]), [0, 0, 1]);

        mat4.scale(self.projectionMatrix, self.projectionMatrix, self.scale);

        mat4.translate(self.projectionMatrix, self.projectionMatrix, self.position);
    }

    /**
     * Creates the shadowmap texture in shadowMap
     */
    self.createShadowMap = function(gl)
    {
        gl.bindTexture(gl.TEXTURE_2D, self.shadowMap);
 
        {
            // define size and format of level 0
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        self.textureWidth, self.textureHeight, border,
                        format, type, data);

            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    
        }

        // Create and bind the framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, self.frameBufferObject);
            
        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, self.shadowMap, 0);
    }
}