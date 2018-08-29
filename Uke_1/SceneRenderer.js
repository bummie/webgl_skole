function SceneRenderer()
{
	let quadObjects;
	let shaderHandler = new ShaderHandler();
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	let shaderProgram = null;
	let programInfo = null;

	let then = 0;

	this.main = function() 
	{
		if (gl === null) 
		{
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		shaderProgram = shaderHandler.initShaderProgram(gl);
		programInfo = this.initProgramInfo(gl, shaderProgram);
		quadObjects = [ new Quad(), new Quad(), new Quad(), new Quad(), new Quad(), new Quad(), new Quad(), new Quad(), new Quad(), new Quad() ]; 
	}

	/**
	 * Renderloop
	 * @param {*} now 
	 */
	this.render = function(now) 
	{
		now *= 0.001;  // convert to seconds
		const deltaTime = now - then;
		then = now;

		this.draw(gl, programInfo, deltaTime);

		requestAnimationFrame(this.render.bind(this));
	}
	requestAnimationFrame(this.render.bind(this));


	/**
	 * Initiates Program Info
	 * @param {*} gl 
	 */
	this.initProgramInfo = function(gl, shaderProgram) 
	{
		return {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
				vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
				translate: gl.getUniformLocation(shaderProgram, 'uTranslate'),
				rotate: gl.getUniformLocation(shaderProgram, 'uRotate'),
				scale: gl.getUniformLocation(shaderProgram, 'uScale')
			}
		};
	}

	/**
	 * Draws the scene to the canvas
	 * @param {*} gl 
	 * @param {*} programInfo 
	 */
	this.draw = function(gl, programInfo, deltatime)
	{
		gl.clearColor(0.0, 0.0, 0.1, 1.0); // Clear to black, fully opaque
		gl.clearDepth(1.0); // Clear everything
		gl.enable(gl.DEPTH_TEST); // Enable depth testing
		gl.depthFunc(gl.LEQUAL); // Near things obscure far things

		// Clear the canvas before we start drawing on it.

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = 45 * Math.PI / 180; // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.perspective(projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.

		mat4.translate(modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to translate
			[-0.0, 0.0, -6.0]); // amount to translate
		
		// Draw objects in array
		let i = 0;
		quadObjects.forEach(function(quad) 
		{
			let frequency = 0.006,
				amplitude = 4,
				delay = 50;
				
			// Change position of object
			let x = (Math.sin((Date.now() - i * delay) * frequency/6) * amplitude);
			let y = -(Math.sin((Date.now() - i * delay) * frequency) * amplitude);
			
			quad.position = [ x,  y, -5 ];

			// Draw our objects
			quad.draw(gl, programInfo, projectionMatrix, modelViewMatrix);
			i++;
		});	
	}
}