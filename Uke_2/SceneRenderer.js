function SceneRenderer()
{
	let shaderHandler = new ShaderHandler();
	let ui = new UIHandler();
	let io = new IOHandler();
	let camera = new Camera();

	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");

	let shaderProgram;
	let programInfo;

	let sceneObjects = [];
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

		this.addListeners();
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
			// Draw our objects
			object.draw(gl, programInfo, camera.projectionMatrix);
		});	
	}

	/**
	 * Add event listeners
	 */
	this.addListeners = function()
	{
		ui.btnSpawn.addEventListener("click", this.spawnModel);
		ui.selectDrawType.addEventListener("change", this.updateDrawType);
		ui.selectObject.addEventListener("change", this.updateObjectToUI);

		ui.position[0].addEventListener("change", this.updateUIToObject);
		ui.position[1].addEventListener("change", this.updateUIToObject);
		ui.position[2].addEventListener("change", this.updateUIToObject);

		ui.rotation[0].addEventListener("change", this.updateUIToObject);
		ui.rotation[1].addEventListener("change", this.updateUIToObject);
		ui.rotation[2].addEventListener("change", this.updateUIToObject);

		ui.scale[0].addEventListener("change", this.updateUIToObject);
		ui.scale[1].addEventListener("change", this.updateUIToObject);
		ui.scale[2].addEventListener("change", this.updateUIToObject);
	}	

	/**
	 * Callback on select drawType
	 */
	this.updateDrawType = function()
	{
		if(sceneObjects.length <= 0) { return; }

		console.log("Index: " + ui.selectObject.selectedIndex + " Tpye: " + ui.selectDrawType.value);
		sceneObjects[ui.selectObject.selectedIndex].drawType = ui.selectDrawType.value;
	}

	/**
	 * Updates the ui values on selected object change
	 */
	this.updateObjectToUI = function()
	{
		if(sceneObjects.length <= 0) { return; }

		let objectIndex = ui.selectObject.selectedIndex;

		ui.selectDrawType.value = sceneObjects[objectIndex].drawType;

		ui.position[0].value = sceneObjects[objectIndex].position[0];
		ui.position[1].value = sceneObjects[objectIndex].position[1];
		ui.position[2].value = sceneObjects[objectIndex].position[2];

		ui.rotation[0].value = sceneObjects[objectIndex].rotation[0];
		ui.rotation[1].value = sceneObjects[objectIndex].rotation[1];
		ui.rotation[2].value = sceneObjects[objectIndex].rotation[2];

		ui.scale[0].value = sceneObjects[objectIndex].scale[0];
		ui.scale[1].value = sceneObjects[objectIndex].scale[1];
		ui.scale[2].value = sceneObjects[objectIndex].scale[2];
	}

	/**
	 * Updates the object with UI values
	 */
	this.updateUIToObject = function()
	{
		let objectIndex = ui.selectObject.selectedIndex;

		sceneObjects[objectIndex].position[0] = ui.position[0].value;
		sceneObjects[objectIndex].position[1] = ui.position[1].value;
		sceneObjects[objectIndex].position[2] = ui.position[2].value;

		sceneObjects[objectIndex].rotation[0] = ui.rotation[0].value;
		sceneObjects[objectIndex].rotation[1] = ui.rotation[1].value;
		sceneObjects[objectIndex].rotation[2] = ui.rotation[2].value;

		sceneObjects[objectIndex].scale[0] = ui.scale[0].value;
		sceneObjects[objectIndex].scale[1] = ui.scale[1].value;
		sceneObjects[objectIndex].scale[2] = ui.scale[2].value;
	}

	/**
	 * Spawns a given model
	 */
	this.spawnModel = function()
	{	
		let title = ui.selectSpawn[ui.selectSpawn.selectedIndex].text;
		let modelPath = './models/' + ui.selectSpawn.value;
		//alert(modelPath);
		io.loadFile(modelPath, (obj) => 
		{
			sceneObjects.push(new ObjModel(obj));
			ui.addOption(title);
		});
	}
}