function ObjModel(data)
{
	this.vertexList = data.vertexList;
	this.faceList = data.faceList;
    this.vertexNormalList = data.vertexNormalList;

    this.position = [ 0, 0, 0 ];
    this.rotation = [ 0, 0, 0 ];
    this.scale = [ 1, 1, 1 ];

    this.spin = false;
    this.spinIncrement = 1;

    this.drawType = 4;
    this.faceCount = this.faceList.length;
	this.offset = 0;

    this.modelViewMatrix = mat4.create();
    const normalMatrix = mat4.create();
    
    /**
     * TODO:: Clean up function
     * Draws the mesh to the canvas
     * @param {*} gl 
     * @param {*} programInfo 
     * @param {*} modelViewMatrix 
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

        this.getTransformMatrix(parent); 

        mat4.invert(normalMatrix, this.modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        buffers = this.initBuffer(gl);

		{
            const numComponents = 3; // pull out 3 values per iteration
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from
    
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexNormalBuffer);
    
            gl.vertexAttribPointer( programInfo.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
		}

        {
            const numComponents = 3; // pull out 3 values per iteration
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from
    
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
    
            gl.vertexAttribPointer( programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faceBuffer);

        // Set the shader uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
        
        gl.drawElements(this.drawType, this.faceCount, gl.UNSIGNED_SHORT, this.offset);
    }


    /**
     * Returns the transformmatrix
     */
    this.getTransformMatrix = function(parent)
    {
        mat4.identity(this.modelViewMatrix);

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, glMatrix.toRadian(this.rotation[0]), [1, 0, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, glMatrix.toRadian(this.rotation[1]), [0, 1, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, glMatrix.toRadian(this.rotation[2]), [0, 0, 1]);
		mat4.scale(this.modelViewMatrix, this.modelViewMatrix, this.scale);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.position); 
       
        mat4.multiply(this.modelViewMatrix, parent.Object.getTransformMatrix(parent.Parent), this.modelViewMatrix);

        return this.modelViewMatrix;
    }

    /**
     * Init the buffer containing data ment for the GPU yo
     * @param {*} gl 
     */
    this.initBuffer = function(gl)
    {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexList), gl.STATIC_DRAW);
		
		const positionNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormalList), gl.STATIC_DRAW);

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceList), gl.STATIC_DRAW);

        return {
			vertexBuffer: positionBuffer,
			vertexNormalBuffer: positionNormalBuffer,
			faceBuffer: indexBuffer
        };
    }
}