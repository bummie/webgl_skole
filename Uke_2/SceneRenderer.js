function SceneRenderer()
{
	let shaderHandler = new ShaderHandler();
	let camera = new Camera();
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	let shaderProgram = null;
	let programInfo = null;

	let sceneObjects;
	let then = 0;
	//const objLocation = './models/Armadillo.obj';
	const treeLocation = './models/lowpolytree.obj';
	const legoLocation = './models/lego.obj';
	//const objLocation = './models/terning.obj';

	this.main = function() 
	{
		if (gl === null) 
		{
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		shaderProgram = shaderHandler.initShaderProgram(gl);
		programInfo = this.initProgramInfo(gl, shaderProgram);
		sceneObjects = [];

		let ioTest = new IOHandler();
		ioTest.loadFile(treeLocation, loadModel );
		ioTest.loadFile(legoLocation, loadModel );
	}

	/**
	 * Handle keyboard input
	 */
	this.input = function(event)
	{
		//alert(event.keyCode);
	}


	/**
	 * Callback
	 * @param {*} obj 
	 */
	var i = 0;
	function loadModel(obj)
	{
		sceneObjects.push(new ObjModel(obj));
		if(i == 1)
		{
			sceneObjects[i].scale = [.01, .01, .01];
			sceneObjects[i].position = [0, -.3, -1];
		}
		
		i++;
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
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
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

		camera.updateProjectionMatrix(gl);

        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);

		// Draw objects in array
		sceneObjects.forEach(function(object) 
		{
			object.rotation[0] += deltatime;
			// Draw our objects
			object.draw(gl, programInfo, camera.projectionMatrix);
		});	
	}
}