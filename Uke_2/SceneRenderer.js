function SceneRenderer()
{
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");
	const depthExt = gl.getExtension("WEBGL_depth_texture");

	let self = this;

	let ui;
	let shaderHandler = new ShaderHandler();
	let io = new IOHandler(this);
	let then = 0;
	let shaderProgram;
	let shadowShaderProgram;
	let shadowProgramInfo;
	let programInfo;

	self.nodeRoot = null;
	self.camera = new Camera();
	self.light = new Light(gl);

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

		shaderProgram = shaderHandler.initShaderProgram(gl, vertShader, fragShader);
		shadowShaderProgram = shaderHandler.initShaderProgram(gl, vertShadowShader, fragShadowShader);

		programInfo = self.initProgramInfo(gl, shaderProgram);
		shadowProgramInfo = self.initProgramInfo(gl, shadowShaderProgram);
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
		// Render to shadow map
		{			
			self.light.createShadowMap(gl);
			gl.bindFramebuffer(gl.FRAMEBUFFER, self.light.frameBufferObject);

			gl.clearColor(0.1, 0.1, 0.1, 1.0); // Clear to black, fully opaque
			gl.clearDepth(1.0); // Clear everything
			gl.enable(gl.DEPTH_TEST); // Enable depth testing
			gl.depthFunc(gl.LEQUAL); // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.useProgram(shadowProgramInfo.program);
			self.light.updateProjectionMatrix(gl);
			gl.viewport(0, 0, self.light.textureWidth, self.light.textureHeight);

			self.camera.updateProjectionMatrix(gl);
			gl.uniformMatrix4fv(shadowProgramInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
			self.updateLightData();		
			
			self.nodeRoot.draw(gl, shadowProgramInfo);
		}
		
		self.updateDebugCanvas(gl, self.light.textureWidth, self.light.textureHeight);

		// Render to canvas
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			gl.clearColor(0.1, 0.1, 0.1, 1.0); // Clear to black, fully opaque
			gl.clearDepth(1.0); // Clear everything
			gl.enable(gl.DEPTH_TEST); // Enable depth testing
			gl.depthFunc(gl.LEQUAL); // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			gl.useProgram(programInfo.program);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			self.camera.updateProjectionMatrix(gl);
			gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
			self.updateLightData();
			
			self.nodeRoot.draw(gl, programInfo);
		}

	}

	/**
	 * Updates the lighting data on the GPU
	 */
	self.updateLightData = function()
	{
		gl.uniform3fv(programInfo.uniformLocations.ambientLight, self.light.ambientLight);
		gl.uniform3fv(programInfo.uniformLocations.directionalLightColor, self.light.directionalLightColor);
		gl.uniform3fv(programInfo.uniformLocations.directionalVector, self.light.directionalVector);
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

	/**
	 * Updates the debugCanvas with framebuffer texture
	 * https://stackoverflow.com/a/18804083/6826158
	 * @param {*} gl 
	 * @param {*} width 
	 * @param {*} height 
	 */
	self.updateDebugCanvas = function(gl, width, height)
	{
		// Read the contents of the framebuffer
		var data = new Uint8Array(width * height * 4);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

		// Create a 2D canvas to store the result 
		var canvas = document.getElementById('debugCanvas');

		var context = canvas.getContext('2d');

		// Copy the pixels to a 2D canvas
		var imageData = context.createImageData(width, height);

		// Flip image
		Array.from({length: height}, (val, i) => data.slice(i * width * 4, (i + 1) * width * 4))
		.forEach((val, i) => data.set(val, (height - i - 1) * width * 4));
		imageData.data.set(data);

		context.putImageData(imageData, 0, 0);
		context.scale(1, -1);
	}

}