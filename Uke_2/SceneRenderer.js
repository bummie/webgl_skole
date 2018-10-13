function SceneRenderer()
{
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	let self = this;

	let ui;
	let shaderHandler = new ShaderHandler();
	let io = new IOHandler(this);
	let then = 0;
	let shaderProgram;
	let programInfo;
	let self = this;

	self.nodeRoot = null;
	self.camera = new Camera();
	self.light = new Light();

	self.lighting = {
		AmbientLight: [0.3, 0.3, 0.3],
		DirectionalLightColor: [1, 1, 1],
		DirectionalVector: [0.85, 0.8, 0.75]
	}

	self.main = function() 
	{
		if (gl === null) 
		{
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		shaderProgram = shaderHandler.initShaderProgram(gl);
		programInfo = self.initProgramInfo(gl, shaderProgram);
		self.nodeRoot = new Node(new NoMesh(), null);

		ui = new UIHandler(this);
		ui.addListeners();

		self.spawnRobot();
		requestAnimationFrame(self.update.bind(this));
	}

	/**
	 * Renderloop
	 * @param {*} now 
	 */
	self.update = function(now) 
	{
		now *= 0.001;  // convert to seconds
		const deltaTime = now - then;
		then = now;
		
		ui.updateCameraUI();
		ui.updateLightValuesUI();
		self.draw(gl, programInfo, deltaTime);

		requestAnimationFrame(self.update.bind(this));
	}

	/**
	 * Initiates Program Info
	 * @param {*} gl 
	 */
	self.initProgramInfo = function(gl, shaderProgram) 
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
				color: gl.getUniformLocation(shaderProgram, 'uColor')
			}
		};
	}

	/**
	 * Draws the scene to the canvas
	 * @param {*} gl 
	 * @param {*} programInfo 
	 */
	self.draw = function(gl, programInfo, deltatime)
	{
		gl.clearColor(0.0, 0.0, 0.1, 1.0); // Clear to black, fully opaque
		gl.clearDepth(1.0); // Clear everything
		gl.enable(gl.DEPTH_TEST); // Enable depth testing
		gl.depthFunc(gl.LEQUAL); // Near things obscure far things

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram(programInfo.program);

		self.camera.updateProjectionMatrix(gl);
		gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
		self.updateLightData();

		self.nodeRoot.draw(gl, programInfo);
	}

	/**
	 * Updates the lighting data on the GPU
	 */
	self.updateLightData = function()
	{
		gl.uniform3fv(programInfo.uniformLocations.ambientLight, self.light.AmbientLight);
		gl.uniform3fv(programInfo.uniformLocations.directionalLightColor, self.light.DirectionalLightColor);
		gl.uniform3fv(programInfo.uniformLocations.directionalVector, self.light.DirectionalVector);
		gl.uniform1f(programInfo.uniformLocations.time, new Date().getTime());
	}
	
	/**
	 * Spawns a given model
	 */
	self.spawnModel = function()
	{	
		let title = ui.selectSpawn[ui.selectSpawn.selectedIndex].text;
		let modelPath = './models/' + ui.selectSpawn.value;
		//alert(modelPath);
		io.loadFile(modelPath, (obj) =>
		{
			spawnObject(new Node(new ObjModel(obj), self.nodeRoot), title);
		});
	}

	/**
	 * Spawns object given
	 */
	function spawnObject(node, title)
	{
		console.log(node.Parent);
		node.Parent.Children.push(node);
		if(node.Parent === self.nodeRoot) 
		{
			ui.addOption(title);
			ui.updateObjectToUI();
		}
	}

	/**
	 * Loads data from file
	 * @param {*} data 
	 */
	self.loadModelFromFile = function(data, title)
	{
		self.nodeRoot.Children.push(new Node(new ObjModel(data), self.nodeRoot));
		ui.addOption(title);
		ui.updateObjectToUI();
	}

	/**
	 * Receive keyboard input and pass it on
	 * to the UIHandler
	 */
	self.input = function(event)
	{
		ui.handleInput(event);
	}

	/**
	 * Spawns robot
	 */
	self.spawnRobot = function()
	{
		let torso = new Node(Cube(), self.nodeRoot);
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
		head.Object.color = [.8, 0, .2, 1];

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
		arm2.Object.color = [0.0, 1.0, 0.0, 1]
		// Spawn to scene
		spawnObject(torso, "Robot");
		spawnObject(head, "Cube");
		spawnObject(leg1, "Cube");
		spawnObject(leg2, "Cube");
		spawnObject(arm1, "Cube");
		spawnObject(arm2, "Cube");
	}
}