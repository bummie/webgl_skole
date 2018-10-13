function Light()
{
    this.position = [0, 1, 1];
    //this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];

    this.fov = 45;
    this.zNear = 0.1;
    this.zFar = 100.0;

    this.ambientLight = [0.3, 0.3, 0.3];
    this.directionalVector = [0.85, 0.8, 0.75];
    this.directionalLightColor = [1, 1, 1];

    this.projectionMatrix = mat4.create();
    this.rotationDirection = [0, 0, -1];

    this.textureWidth = 256;
    this.textureHeight = 256;
    this.shadowmMap = null;

    this.frameBufferObject = null;

    /**
     * Updates the projection matrix with new translation, rotation, scale values
     */
    this.updateProjectionMatrix = function(gl)
    {
        const fieldOfView = glMatrix.toRadian(this.fov); 
		const aspect = this.textureWidth / this.textureHeight;

        mat4.identity(this.projectionMatrix);
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, this.zNear, this.zFar);
       
        /*X*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.directionalVector[0]), [1, 0, 0]);
        /*Y*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.directionalVector[1]), [0, 1, 0]);
        /*Z*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.directionalVector[2]), [0, 0, 1]);

        mat4.scale(this.projectionMatrix, this.projectionMatrix, this.scale);

        mat4.translate(this.projectionMatrix, this.projectionMatrix, this.position);
    }

    /**
     * Creates the shadowmap texture in shadowMap
     */
    this.createShadowMap = function(gl)
    {
        this.shadowmMap = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.shadowmMap);
 
        {
            // define size and format of level 0
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        this.textureWidth, this.textureHeight, border,
                        format, type, data);

            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    

            // Create and bind the framebuffer
            this.frameBufferObject = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferObject);
            
            // attach the texture as the first color attachment
            const attachmentPoint = gl.COLOR_ATTACHMENT0;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.shadowmMap, level);
        }
    }
}