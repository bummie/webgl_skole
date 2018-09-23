function ObjModel(data)
{
	this.vertexList = data.vertexList;
	this.faceList = data.faceList;
    this.vertexNormalList = data.vertexNormalList;

    this.position = [ 0, 0, 0 ];
    this.rotation = [ 0, 0, 0 ];
    this.scale = [ 1, 1, 1 ];

    this.drawType = 4;
    this.faceCount = this.faceList.length;
	this.offset = 0;

    const modelViewMatrix = mat4.create();
    const normalMatrix = mat4.create();
    
    /**
     * TODO:: Clean up function
     * Draws the mesh to the canvas
     * @param {*} gl 
     * @param {*} programInfo 
     * @param {*} projectionMatrix 
     * @param {*} modelViewMatrix 
     */
    this.draw = function(gl, programInfo, projectionMatrix)
    {   
        mat4.identity(modelViewMatrix);

        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotation[2], [0, 0, 1]);
		mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
		mat4.translate(modelViewMatrix, modelViewMatrix, this.position); 

        mat4.invert(normalMatrix, modelViewMatrix);
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
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
        
        gl.drawElements(this.drawType, this.faceCount, gl.UNSIGNED_SHORT, this.offset);
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