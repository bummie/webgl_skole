function Camera()
{
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];

    this.fov = 45;
    this.zNear = 0.1;
    this.zFar = 100.0;

    this.projectionMatrix = mat4.create();

    /**
     * Updates the projection matrix with new translation, rotation, scale values
     */
    this.updateProjectionMatrix = function(gl)
    {
        const fieldOfView = this.fov * Math.PI / 180; // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

		mat4.perspective(this.projectionMatrix,fieldOfView, aspect, this.zNear, this.zFar);
        
        mat4.translate(this.projectionMatrix, this.projectionMatrix, this.position);
       
  /*X*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, this.rotation[0], [1, 0, 0]);
  /*Y*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, this.rotation[1], [0, 1, 0]);
  /*Z*/ mat4.rotate(this.projectionMatrix, this.projectionMatrix, this.rotation[2], [0, 0, 1]);

        mat4.scale(this.projectionMatrix, this.projectionMatrix, this.scale);
    }

}