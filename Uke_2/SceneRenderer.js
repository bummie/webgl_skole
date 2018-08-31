function SceneRenderer()
{
	let shaderHandler = new ShaderHandler();
	let camera = new Camera();
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	let shaderProgram = null;
	let programInfo = null;

	let sceneObjects = [];
	let then = 0;
	const armadilloLocation = './models/Armadillo.obj';
	const treeLocation = './models/lowpolytree.obj';
	const legoLocation = './models/lego.obj';
	const diceLocation = './models/terning.obj';

	this.main = function() 
	{
		if (gl === null) 
		{
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		shaderProgram = shaderHandler.initShaderProgram(gl);
		programInfo = this.initProgramInfo(gl, shaderProgram);

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
		let moveAmount = 0.03;
		switch(event.keyCode)
		{	
			// W
			case 87:
				camera.position[2] += moveAmount;
			break;

			// A
			case 65:
				camera.position[0] += moveAmount;

			break;

			// S
			case 83:
				camera.position[2] -= moveAmount;
			break;

			// D
			case 68:
				camera.position[0] -= moveAmount;
			break;
			
			// SPACE
			case 32:
				camera.position[1] -= moveAmount;
			break;

			// CTRL
			case 17:
				camera.position[1] += moveAmount;
			break;

			// UP
			case 38:
				camera.rotation[0] += moveAmount;
			break;

			// LEFT
			case 37:
				camera.rotation[1] -= moveAmount;
			break;

			// DOWN
			case 40:
				camera.rotation[0] -= moveAmount;
			break;

			// RIGHT
			case 39:
				camera.rotation[1] += moveAmount;
			break;
			
		}
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
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
				zColor: gl.getUniformLocation(shaderProgram, 'zColor')
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
			object.rotation[1] += deltatime;

			// Draw our objects
			object.draw(gl, programInfo, camera.projectionMatrix);
		});	
	}
}