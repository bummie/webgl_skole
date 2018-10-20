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
	let debugShaderProgram;

	let shadowProgramInfo;
	let debugProgramInfo;
	let programInfo;

	self.nodeRoot = null;
	self.camera = new Camera();
	self.light = new Light(gl);
	
	let debugQuad;

	self.main = function() 
	{
		if (gl === null) 
		{
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		shaderProgram = shaderHandler.initShaderProgram(gl, vertShader, fragShader);
		shadowShaderProgram = shaderHandler.initShaderProgram(gl, vertShadowShader, fragShadowShader);
		debugShaderProgram = shaderHandler.initShaderProgram(gl, vertImageShader, fragImageShader);

		programInfo = self.initProgramInfo(gl, shaderProgram);
		shadowProgramInfo = self.initProgramInfo(gl, shadowShaderProgram);
		debugProgramInfo = self.initProgramInfo(gl, debugShaderProgram);

		self.nodeRoot = new Node(new NoMesh(), null);

		ui = new UIHandler(this);
		ui.addListeners();

		for(let i = 0; i < 3; i++)
		{
			self.spawnRobot();
		}
		
		self.spawnLightDemoScene();

		debugQuad = Quad();
		debugQuad.position = [0, 0, -2.5];

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
				vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
				textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
				normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
				shadowMatrix: gl.getUniformLocation(shaderProgram, 'uShadowMatrix'),
				ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
				directionalLightColor: gl.getUniformLocation(shaderProgram, 'uDirectionalLightColor'),
				directionalVector: gl.getUniformLocation(shaderProgram, 'uDirectionalVector'),
				color: gl.getUniformLocation(shaderProgram, 'uColor'),
				texture: gl.getUniformLocation(shaderProgram, 'uTexture')
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
			self.light.createShadowMap(gl, depthExt);
			gl.bindFramebuffer(gl.FRAMEBUFFER, self.light.frameBufferObject);

			gl.useProgram(shadowProgramInfo.program);

			gl.clearColor(0.1, 0.1, 0.1, 1.0); // Clear to black, fully opaque
			gl.clearDepth(1.0); // Clear everything
			gl.enable(gl.DEPTH_TEST); // Enable depth testing
			gl.depthFunc(gl.LEQUAL); // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			self.light.updateProjectionMatrix(gl);
			gl.viewport(0, 0, self.light.textureWidth, self.light.textureHeight);

			gl.uniformMatrix4fv(shadowProgramInfo.uniformLocations.projectionMatrix, false, self.light.projectionMatrix);
			
			self.nodeRoot.draw(gl, shadowProgramInfo);
		}
		
		//self.updateDebugCanvas(gl, 256, 256);

		// Render to canvas
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.useProgram(programInfo.program);
			gl.bindTexture(gl.TEXTURE_2D, self.light.shadowMap);

			gl.clearColor(0.1, 0.1, 0.1, 1.0); // Clear to black, fully opaque
			gl.clearDepth(1.0); // Clear everything
			gl.enable(gl.DEPTH_TEST); // Enable depth testing
			gl.depthFunc(gl.LEQUAL); // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			self.updateLightData();

			self.camera.updateProjectionMatrix(gl);
			gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
			gl.uniformMatrix4fv(programInfo.uniformLocations.shadowMatrix, false, self.light.projectionMatrix);
			gl.uniform1i(programInfo.uniformLocations.texture, 0);
			
			self.nodeRoot.draw(gl, programInfo);
		}

		// Draw debug
		{
			gl.useProgram(debugProgramInfo.program);
			gl.uniformMatrix4fv(debugProgramInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
			gl.uniform1i(debugProgramInfo.uniformLocations.texture, 0);

			debugQuad.draw(self.nodeRoot, gl, debugProgramInfo);
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
		torso.Object.position = [randomRange(-8, 9), 0, randomRange(-35, -2)];

		// Head
		head.Object.position[1] = 3;
		head.Object.scale[0] = .5;
		head.Object.scale[1] = .5;
		head.Object.color = [.8, 0, .2, 1];

		// Legs
		leg1.Object.position[0] = -2;
		leg1.Object.position[1] = -2;
		leg1.Object.scale[0] = .25;
		leg1.Object.scale[2] = .25;
		leg1.Object.color = [0.0, 0.3, 1.0, 1]

		leg2.Object.position[0] = 2;
		leg2.Object.position[1] = -2;
		leg2.Object.scale[0] = .25;
		leg2.Object.scale[2] = .25;
		leg2.Object.color = [0.0, 0.3, 0.9, 1]

		// Arms
		arm1.Object.position[1] = -2;
		arm1.Object.rotation[2] = 90;
		arm1.Object.scale[0] = .25;
		arm1.Object.scale[2] = .25;
		arm1.Object.color = [0.0, 1.0, 0.0, 1]

		arm2.Object.position[1] = 2;
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
	 * Spawns objects to scene
	 * Room yo
	 */
	self.spawnLightDemoScene = function()
	{
		let floor = new Node(Cube(), self.nodeRoot);
		floor.Object.scale = [10, .1, 10];
		floor.Object.position = [0, -30, -1];
		floor.Object.color = [0.3, 0.3, 0.3, 1.0];

		let wallRight = new Node(Cube(), self.nodeRoot);
		wallRight.Object.scale = [10, .1, 10];
		wallRight.Object.position = [0.7, -100, -1];
		wallRight.Object.rotation = [0, 0, 90];
		wallRight.Object.color = [0.0, 0.3, 0.6, 1.0];

		let wallLeft = new Node(Cube(), self.nodeRoot);
		wallLeft.Object.scale = [10, .1, 10];
		wallLeft.Object.position = [0.7, 100, -1];
		wallLeft.Object.rotation = [0, 0, 90];
		wallLeft.Object.color = [0.0, 0.3, 0.6, 1.0];

		let wallBack = new Node(Cube(), self.nodeRoot);
		wallBack.Object.scale = [10, .1, 10];
		wallBack.Object.position = [0.7, -200, 0];
		wallBack.Object.rotation = [0, 90, 90];
		wallBack.Object.color = [0.0, 0.3, 0.6, 1.0];


		spawnObject(floor, "Floor");
		//spawnObject(wallRight, "wallRight");
		//spawnObject(wallLeft, "wallLeft");
		spawnObject(wallBack, "wallBack");
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

	function randomRange(min, max) 
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}