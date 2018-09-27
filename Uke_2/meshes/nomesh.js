function NoMesh()
{
    this.position = [ 0, 0, 0 ];
    this.rotation = [ 0, 0, 0 ];
    this.scale = [ 0.1, 0.1, 0.1 ];
    
    this.spin = false;
    this.spinIncrement = 0.01;

    this.modelViewMatrix = mat4.create();

    /**
     * Draws the mesh to the canvas
     * @param {*} gl 
     * @param {*} programInfo 
     */
    this.draw = function(parent, gl, programInfo)
    {   
        if(this.rotation[0] >= 360 || this.rotation[0] <= -360 ) { this.rotation[0] = 0; }
        if(this.rotation[1] >= 360 || this.rotation[1] <= -360 ) { this.rotation[1] = 0; }
        if(this.rotation[2] >= 360 || this.rotation[2] <= -360 ) { this.rotation[2] = 0; }

        if(this.spin)
        {   
            this.rotation[0] += this.spinIncrement;
            this.rotation[2] += this.spinIncrement;
        }

        this.getTransformMatrix();
    }

        /**
     * Returns the transformmatrix
     */
    this.getTransformMatrix = function()
    {
        mat4.identity(this.modelViewMatrix);

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.rotation[2], [0, 0, 1]);
		mat4.scale(this.modelViewMatrix, this.modelViewMatrix, this.scale);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.position); 
        
        return this.modelViewMatrix;
    }
}