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

	let nodeRoot = null;
	let then = 0;

	let lighting = {
		AmbientLight: [0.3, 0.3, 0.3],
		DirectionalLightColor: [1, 1, 1],
		DirectionalVector: [0.85, 0.8, 0.75]
	}

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

		nodeRoot = new Node(new NoMesh());
		
		this.spawnRobot();
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
				directionalVector: gl.getUniformLocation(shaderProgram, 'uDirectionalVector'),
				time: gl.getUniformLocation(shaderProgram, 'uTime')

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
		gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix);
		this.updateLightData();

		nodeRoot.draw(gl, programInfo);
	}

	/**
	 * Updates the lighting data on the GPU
	 */
	this.updateLightData = function()
	{
		gl.uniform3fv(programInfo.uniformLocations.ambientLight, lighting.AmbientLight);
		gl.uniform3fv(programInfo.uniformLocations.directionalLightColor, lighting.DirectionalLightColor);
		gl.uniform3fv(programInfo.uniformLocations.directionalVector, lighting.DirectionalVector);
		gl.uniform1f(programInfo.uniformLocations.time, new Date().getTime());
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

		ui.shouldRotate.addEventListener("change", this.updateUIToObject);

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
		if(nodeRoot.Children.length <= 0) { return; }

		nodeRoot.Children[ui.selectObject.selectedIndex].Object.drawType = ui.selectDrawType.value;
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
		if(nodeRoot.Children.length <= 0) { return; }

		let objectIndex = ui.selectObject.selectedIndex;

		ui.selectDrawType.value = nodeRoot.Children[objectIndex].Object.drawType;

		ui.position[0].value = nodeRoot.Children[objectIndex].Object.position[0];
		ui.position[1].value = nodeRoot.Children[objectIndex].Object.position[1];
		ui.position[2].value = nodeRoot.Children[objectIndex].Object.position[2];
		
		ui.rotation[0].value = nodeRoot.Children[objectIndex].Object.rotation[0];
		ui.rotation[1].value = nodeRoot.Children[objectIndex].Object.rotation[1];
		ui.rotation[2].value = nodeRoot.Children[objectIndex].Object.rotation[2];
		
	 	ui.shouldRotate.checked = nodeRoot.Children[objectIndex].spin;

		ui.scale[0].value = nodeRoot.Children[objectIndex].Object.scale[0];
		ui.scale[1].value = nodeRoot.Children[objectIndex].Object.scale[1];
		ui.scale[2].value = nodeRoot.Children[objectIndex].Object.scale[2];
	}

	/**
	 * Updates the object with UI values
	 */
	this.updateUIToObject = function()
	{
		if(nodeRoot.Children.length <= 0) { return; }

		let objectIndex = ui.selectObject.selectedIndex;

		nodeRoot.Children[objectIndex].Object.position = [Number(ui.position[0].value), Number(ui.position[1].value), Number(ui.position[2].value)];
		nodeRoot.Children[objectIndex].Object.rotation = [Number(ui.rotation[0].value), Number(ui.rotation[1].value), Number(ui.rotation[2].value)];
		nodeRoot.Children[objectIndex].Object.scale = [Number(ui.scale[0].value), Number(ui.scale[1].value), Number(ui.scale[2].value)];
		nodeRoot.Children[objectIndex].Object.spin = ui.shouldRotate.checked;

		camera.fov = ui.fovSlider.value;

		lighting.AmbientLight = [Number(ui.ambientLight[0].value), Number(ui.ambientLight[1].value), Number(ui.ambientLight[2].value)];
		lighting.DirectionalLightColor = [Number(ui.directionalLightColor[0].value), Number(ui.directionalLightColor[1].value), Number(ui.directionalLightColor[2].value)];
		lighting.DirectionalVector = [Number(ui.directionalVector[0].value), Number(ui.directionalVector[1].value), Number(ui.directionalVector[2].value)];
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
			spawnObject(new Node(new ObjModel(obj), nodeRoot), title);
		});
	}

	/**
	 * Spawns object given
	 */
	function spawnObject(node, title)
	{
		node.Parent.Children.push(node);
		if(node.Parent === nodeRoot) 
		{
			ui.addOption(title);
			updateObjectToUI();
		}
	}

	/**
	 * Loads data from file
	 * @param {*} data 
	 */
	this.loadModelFromFile = function(data, title)
	{
		nodeRoot.Children.push(new Node(new ObjModel(data), nodeRoot));
		ui.addOption(title);
		updateObjectToUI();
	}

	/**
	 * Deletes the selected model
	 */
	this.deleteModel = function()
	{
		if(nodeRoot.Children.length <= 0) { return; }

		console.log("Deleted object");
		let objectIndex = ui.selectObject.selectedIndex;

		nodeRoot.Children.splice(objectIndex, 1);
		ui.selectObject.remove(objectIndex);
	}

	/**
	 * Spawns robot
	 */
	this.spawnRobot = function()
	{
		let torso = new Node(Cube(), nodeRoot);
		let head = new Node(Cube(), torso);
		let leg1 = new Node(Cube(), torso);
		let leg2 = new Node(Cube(), torso);
		let arm1 = new Node(Cube(), torso);
		let arm2 = new Node(Cube(), torso);

		// Torso
		torso.Object.scale[2] = .5;

		// Head
		head.Object.position[1] = 2.5;
		head.Object.scale[0] = .5;
		head.Object.scale[1] = .5;

		// Legs
		leg1.Object.position[0] = -2;
		leg1.Object.position[1] = -2;
		leg1.Object.scale[0] = .25;
		leg1.Object.scale[2] = .25;

		leg2.Object.position[0] = 2;
		leg2.Object.position[1] = -2;
		leg2.Object.scale[0] = .25;
		leg2.Object.scale[2] = .25;

		// Arms
		arm1.Object.position[1] = -2;
		//arm1.Object.position[1] = -2;
		arm1.Object.rotation[2] = 90;
		arm1.Object.scale[0] = .25;
		arm1.Object.scale[2] = .25;

		arm2.Object.position[1] = 2;
		//arm2.Object.position[1] = -2;
		arm2.Object.rotation[2] = 90;
		arm2.Object.scale[0] = .25;
		arm2.Object.scale[2] = .25;

		// Spawn to scene
		spawnObject(torso, "Robot");
		spawnObject(head, "Cube");
		spawnObject(leg1, "Cube");
		spawnObject(leg2, "Cube");
		spawnObject(arm1, "Cube");
		spawnObject(arm2, "Cube");
	}
}