function SceneRenderer()
{
	let shaderHandler = new ShaderHandler();
	let ui = new UIHandler();
	let io = new IOHandler(this);
	let camera = new Camera();

	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");

	let shaderProgram;
	let programInfo;

	let sceneObjects = [];
	let then = 0;

	let lighting = {
		AmbientLight: [0.3, 0.3, 0.3],
		DirectionalLightColor: [1, 1, 1],
		DirectionalVector: [0.85, 0.8, 0.75]
	};

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
		requestAnimationFrame(this.render.bind(this));
	}

	/**
	 * Handle keyboard input
	 */
	this.input = function(event)
	{
		//alert(event.keyCode);
		let moveAmount = 0.03;
		let rotateAmount = 1.5;

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
				camera.rotation[0] += rotateAmount;
			break;

			// LEFT
			case 37:
				camera.rotation[1] -= rotateAmount;
			break;

			// DOWN
			case 40:
				camera.rotation[0] -= rotateAmount;
			break;

			// RIGHT
			case 39:
				camera.rotation[1] += rotateAmount;
			break;

			// Z-Axis
			case 81:
				camera.rotation[2] -= rotateAmount;
			break;

			// Z-Axis
			case 69:
				camera.rotation[2] += rotateAmount;
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
		
		this.updateCameraUI();
		this.updateLightValuesUI();
		this.draw(gl, programInfo, deltaTime);

		requestAnimationFrame(this.render.bind(this));
	}

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
				vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
				vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal')
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
				normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
				ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
				directionalLightColor: gl.getUniformLocation(shaderProgram, 'uDirectionalLightColor'),
				directionalVector: gl.getUniformLocation(shaderProgram, 'uDirectionalVector')
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

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram(programInfo.program);

		camera.updateProjectionMatrix(gl);
		this.updateLightData();

		sceneObjects.forEach(function(object) 
		{
			object.draw(gl, programInfo, camera.projectionMatrix);
		});	
	}

	/**
	 * Updates the lighting data on the GPU
	 */
	this.updateLightData = function()
	{
		gl.uniform3fv(programInfo.uniformLocations.ambientLight, lighting.AmbientLight);
		gl.uniform3fv(programInfo.uniformLocations.directionalLightColor, lighting.DirectionalLightColor);
		gl.uniform3fv(programInfo.uniformLocations.directionalVector, lighting.DirectionalVector);
	}

	/**
	 * Add event listeners
	 */
	this.addListeners = function()
	{
		ui.btnSpawn.addEventListener("click", this.spawnModel);
		ui.btnDelete.addEventListener("click", this.deleteModel);
		ui.selectDrawType.addEventListener("change", this.updateDrawType);
		ui.selectObject.addEventListener("change", updateObjectToUI);

		ui.position[0].addEventListener("change", this.updateUIToObject);
		ui.position[1].addEventListener("change", this.updateUIToObject);
		ui.position[2].addEventListener("change", this.updateUIToObject);

		ui.rotation[0].addEventListener("change", this.updateUIToObject);
		ui.rotation[1].addEventListener("change", this.updateUIToObject);
		ui.rotation[2].addEventListener("change", this.updateUIToObject);

		ui.scale[0].addEventListener("change", this.updateUIToObject);
		ui.scale[1].addEventListener("change", this.updateUIToObject);
		ui.scale[2].addEventListener("change", this.updateUIToObject);

		ui.fovSlider.addEventListener("change", this.updateUIToObject);

		ui.ambientLight[0].addEventListener("change", this.updateUIToObject);
		ui.ambientLight[1].addEventListener("change", this.updateUIToObject);
		ui.ambientLight[2].addEventListener("change", this.updateUIToObject);

		ui.directionalLightColor[0].addEventListener("change", this.updateUIToObject);
		ui.directionalLightColor[1].addEventListener("change", this.updateUIToObject);
		ui.directionalLightColor[2].addEventListener("change", this.updateUIToObject);

		ui.directionalVector[0].addEventListener("change", this.updateUIToObject);
		ui.directionalVector[1].addEventListener("change", this.updateUIToObject);
		ui.directionalVector[2].addEventListener("change", this.updateUIToObject);
	}	

	/**
	 * Callback on select drawType
	 */
	this.updateDrawType = function()
	{
		if(sceneObjects.length <= 0) { return; }

		sceneObjects[ui.selectObject.selectedIndex].drawType = ui.selectDrawType.value;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	this.updateCameraUI = function()
	{
		ui.camPosition.innerHTML = `${camera.position}`;
		ui.camRotation.innerHTML = `${camera.rotation}`;
		ui.camScale.innerHTML = `${camera.scale}`;
		
		ui.fovValue.innerHTML = `${camera.fov}`;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	this.updateLightValuesUI = function()
	{
		ui.ambientValues.innerHTML = `${lighting.AmbientLight}`;
		ui.directionalColorValues.innerHTML = `${lighting.DirectionalLightColor}`;
		ui.directionValues.innerHTML = `${lighting.DirectionalVector}`;
	}

	/**
	 * Updates the ui values on selected object change
	 */
	let updateObjectToUI = function()
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
		if(sceneObjects.length <= 0) { return; }

		let objectIndex = ui.selectObject.selectedIndex;

		sceneObjects[objectIndex].position = [ui.position[0].value, ui.position[1].value, ui.position[2].value];
		sceneObjects[objectIndex].rotation = [ui.rotation[0].value, ui.rotation[1].value, ui.rotation[2].value];
		sceneObjects[objectIndex].scale = [ui.scale[0].value, ui.scale[1].value, ui.scale[2].value];
		
		camera.fov = ui.fovSlider.value;

		lighting.AmbientLight = [ui.ambientLight[0].value, ui.ambientLight[1].value, ui.ambientLight[2].value];
		lighting.DirectionalLightColor = [ui.directionalLightColor[0].value, ui.directionalLightColor[1].value, ui.directionalLightColor[2].value];
		lighting.DirectionalVector = [ui.directionalVector[0].value, ui.directionalVector[1].value, ui.directionalVector[2].value];

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
			updateObjectToUI();
		});
	}

	/**
	 * Loads data from file
	 * @param {*} data 
	 */
	this.loadModelFromFile = function(data, title)
	{
		sceneObjects.push(new ObjModel(data));
		ui.addOption(title);
		updateObjectToUI();
	}

	/**
	 * Deletes the selected model
	 */
	this.deleteModel = function()
	{
		if(sceneObjects.length <= 0) { return; }

		console.log("Deleted object");
		let objectIndex = ui.selectObject.selectedIndex;

		sceneObjects.splice(objectIndex, 1);
		ui.selectObject.remove(objectIndex);
	}
}