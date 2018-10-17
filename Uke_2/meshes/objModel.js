function ObjModel(data)
{
    let self = this;

	self.vertexList = data.vertexList;
	self.faceList = data.faceList;
    self.vertexNormalList = data.vertexNormalList;
    self.textureCoords = data.textureCoords;

    self.position = [ 0, 0, 0 ];
    self.rotation = [ 0, 0, 0 ];
    self.scale = [ 1, 1, 1 ];

    self.color = [ 1, 0.5, 1, 1];
    self.spin = false;
    self.spinIncrement = 1;

    self.texture = null;

    self.drawType = 4;
    self.faceCount = self.faceList.length;
	self.offset = 0;

    self.modelViewMatrix = mat4.create();
    const normalMatrix = mat4.create();
    
    let positionBuffer = null;
    let positionNormalBuffer = null;
    let indexBuffer = null;
    let textureCoordBuffer = null;

    /**
     * TODO:: Clean up function
     * Draws the mesh to the canvas
     * @param {*} gl 
     * @param {*} programInfo 
     * @param {*} modelViewMatrix 
     */
    self.draw = function(parent, gl, programInfo)
    {   
        if(self.rotation[0] >= 360 || self.rotation[0] <= -360 ) { self.rotation[0] = 0; }
        if(self.rotation[1] >= 360 || self.rotation[1] <= -360 ) { self.rotation[1] = 0; }
        if(self.rotation[2] >= 360 || self.rotation[2] <= -360 ) { self.rotation[2] = 0; }

        if(self.spin)
        {   
            self.rotation[0] += self.spinIncrement;
            self.rotation[2] += self.spinIncrement;
        }

        self.getTransformMatrix(parent); 

        mat4.invert(normalMatrix, self.modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
       
        buffers = self.initBuffer(gl);

        console.log(self);
		if(self.vertexNormalList != null){
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

        if(self.textureCoords != null && self.texture != null)
        {
            // Tell the shader we bound the texture to texture unit 0
            gl.uniform1i(programInfo.uniformLocations.texture, gl.TEXTURE0);
            
			const num = 2; // every coordinate composed of 2 values
			const type = gl.FLOAT; // the data in the buffer is 32 bit float
			const normalize = false; // don't normalize
			const stride = 0; // how many bytes to get from one set to the next
			const offset = 0; // how many bytes inside the buffer to start from
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoordBuffer);
			gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
		}

        // Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faceBuffer);

        // Set the shader uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, self.modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
        gl.uniform4fv(programInfo.uniformLocations.color, self.color);

        gl.drawElements(self.drawType, self.faceCount, gl.UNSIGNED_SHORT, self.offset);
    }


    /**
     * Returns the transformmatrix
     */
    self.getTransformMatrix = function(parent)
    {
        mat4.identity(self.modelViewMatrix);

        mat4.rotate(self.modelViewMatrix, self.modelViewMatrix, glMatrix.toRadian(self.rotation[0]), [1, 0, 0]);
        mat4.rotate(self.modelViewMatrix, self.modelViewMatrix, glMatrix.toRadian(self.rotation[1]), [0, 1, 0]);
        mat4.rotate(self.modelViewMatrix, self.modelViewMatrix, glMatrix.toRadian(self.rotation[2]), [0, 0, 1]);
		mat4.scale(self.modelViewMatrix, self.modelViewMatrix, self.scale);
        mat4.translate(self.modelViewMatrix, self.modelViewMatrix, self.position); 
       
        mat4.multiply(self.modelViewMatrix, parent.Object.getTransformMatrix(parent.Parent), self.modelViewMatrix);

        return self.modelViewMatrix;
    }

    /**
     * Init the buffer containing data ment for the GPU yo
     * @param {*} gl 
     */
    self.initBuffer = function(gl)
    {
        if(positionBuffer == null)
        {
            positionBuffer = gl.createBuffer();
            positionNormalBuffer = gl.createBuffer();
            indexBuffer = gl.createBuffer();
            textureCoordBuffer = gl.createBuffer();
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.vertexList), gl.STATIC_DRAW);
		
        gl.bindBuffer(gl.ARRAY_BUFFER, positionNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.vertexNormalList), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(self.faceList), gl.STATIC_DRAW);
        
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.textureCoords), gl.STATIC_DRAW);

        return {
			vertexBuffer: positionBuffer,
			vertexNormalBuffer: positionNormalBuffer,
            faceBuffer: indexBuffer,
            texCoordBuffer: textureCoordBuffer
        };
    }
}