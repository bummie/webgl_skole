function Camera()
{
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];

    this.fov = 45;
    this.zNear = 0.1;
    this.zFar = 100.0;

    this.projectionMatrix = mat4.create();
    this.rotationDirection = vec3.create();

    /**
     * Updates the projection matrix with new translation, rotation, scale values
     */
    this.updateProjectionMatrix = function(gl)
    {
        const fieldOfView = glMatrix.toRadian(this.fov); 
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

        mat4.identity(this.projectionMatrix);
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, this.zNear, this.zFar);
        
        /*Z*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.rotation[2]), [0, 0, 1]);
        /*Y*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.rotation[1]), [0, 1, 0]);
        /*X*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, glMatrix.toRadian(this.rotation[0]), [1, 0, 0]);

        mat4.scale(this.projectionMatrix, this.projectionMatrix, this.scale);
        
        if(this.rotation[0] > 89) { this.rotation[0] =  89; }
        if(this.rotation[0] < -89) { this.rotation[0] = -89; }

        let pitch = glMatrix.toRadian(this.rotation[0]);
        let yaw = glMatrix.toRadian(this.rotation[1]);

        this.rotationDirection[0] = Math.cos(pitch) * Math.cos(yaw);
        this.rotationDirection[1] = Math.sin(pitch);
        this.rotationDirection[2] = Math.cos(pitch) * Math.sin(glMatrix.toRadian(yaw));
        vec3.normalize(this.rotationDirection, this.rotationDirection);

        let newPosition = [0, 0, 0];
        let posLength = vec3.squaredLength(this.position);
        vec3.scale(newPosition, this.rotationDirection, posLength);
        console.log(this.rotationDirection);
        mat4.translate(this.projectionMatrix, this.projectionMatrix, newPosition);
    }
}