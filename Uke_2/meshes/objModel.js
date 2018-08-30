function ObjModel()
{
    this.position = [ 0, 0, 0 ];
    this.rotation = [ 0, 0, 0 ];
    this.scale = [ 1, 1, 0 ];

    this.color = [ 1, 0, 0, 1];

    this.vertexCount = 4;
    this.offset = 0;

    /**
     * Draws the Quad to the canvas
     * @param {*} gl 
     * @param {*} programInfo 
     * @param {*} projectionMatrix 
     * @param {*} modelViewMatrix 
     */
    this.draw = function(gl, programInfo, projectionMatrix, modelViewMatrix)
    {

        buffers = this.initBuffer(gl);
        {
            const numComponents = 2; // pull out 2 values per iteration
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from
    
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
    
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
    
        // Draw color
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }
    

    
        // Set the shader uniforms
    
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
    
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        
        // Apply translation to the MESH yo
        gl.uniform4f(programInfo.uniformLocations.translate, this.position[0], this.position[1], this.position[2], 0);
       
        gl.drawArrays(gl.TRIANGLE_STRIP, this.offset, this.vertexCount);
    }

    /**
     * Init the buffer containing data ment for the GPU yo
     * @param {*} gl 
     */
    this.initBuffer = function(gl)
    {
        // Create a buffer for the square's positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.

        const positions =
        [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW);

        const colors = 
        [
            1.0,  1.0,  1.0,  1.0,    // white
            1.0,  0.0,  0.0,  1.0,    // red
            0.0,  1.0,  0.0,  1.0,    // green
            0.0,  0.0,  1.0,  1.0,    // blue
        ];
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return {
        position: positionBuffer,
        color: colorBuffer,
        };
    }
}