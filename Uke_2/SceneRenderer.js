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
	let imageShaderProgram;
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
		imageShaderProgram = shaderHandler.initShaderProgram(gl, vertImageShader, fragImageShader);

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
		// Render to shadow map
		{			
			self.light.createShadowMap(gl);
			gl.bindFramebuffer(gl.FRAMEBUFFER, self.light.frameBufferObject);

			gl.clearColor(0.1, 0.1, 0.1, 1.0); // Clear to black, fully opaque
			gl.clearDepth(1.0); // Clear everything
			gl.enable(gl.DEPTH_TEST); // Enable depth testing
			gl.depthFunc(gl.LEQUAL); // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.useProgram(programInfo.program);
			
			self.light.updateProjectionMatrix(gl);
			//console.log(self.light);

			gl.viewport(0, 0, self.light.textureWidth, self.light.textureHeight);
			gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, self.camera.projectionMatrix);
		
			self.nodeRoot.draw(gl, programInfo);
		}
		
		self.updateDebugCanvas(gl, self.light.textureWidth, self.light.textureHeight);
		//self.drawImage(gl, self.light.shadowMap, self.light.textureWidth, self.light.textureHeight, 0, 0);

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
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);
}


var positionBuffer = gl.createBuffer();
var texcoordBuffer = gl.createBuffer();

/**
 * https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html
 * @param {*} tex 
 * @param {*} texWidth 
 * @param {*} texHeight 
 * @param {*} dstX 
 * @param {*} dstY 
 */
self.drawImage = function(gl, tex, texWidth, texHeight, dstX, dstY)
{
	if(tex == null ) { console.log("Texture is null"); return; }

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	  // look up where the vertex data needs to go.
	  var positionLocation = gl.getAttribLocation(imageShaderProgram, "a_position");
	  var texcoordLocation = gl.getAttribLocation(imageShaderProgram, "a_texcoord");
	
	  // lookup uniforms
	  var matrixLocation = gl.getUniformLocation(imageShaderProgram, "u_matrix");
	  var textureLocation = gl.getUniformLocation(imageShaderProgram, "u_texture");
	
	  // Create a buffer.
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	  // Put a unit quad in the buffer
	  var positions = [
		0, 0,
		0, 1,
		1, 0,
		1, 0,
		0, 1,
		1, 1,
	  ]
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	  // Create a buffer for texture coords
	  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	
	  // Put texcoords in the buffer
	  var texcoords = [
		0, 0,
		0, 1,
		1, 0,
		1, 0,
		0, 1,
		1, 1,
	  ]
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);


	gl.bindTexture(gl.TEXTURE_2D, tex);
   
	// Tell WebGL to use our shader program pair
	gl.useProgram(imageShaderProgram);
   
	// Setup the attributes to pull data from our buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.enableVertexAttribArray(texcoordLocation);
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
   
	// this matirx will convert from pixels to clip space
	var matrix = mat4.create(); 
    mat4.ortho(matrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);

	// this matrix will translate our quad to dstX, dstY
	matrix = mat4.translate(matrix, dstX, dstY, 0);
   
	// this matrix will scale our 1 unit quad
	// from 1 unit to texWidth, texHeight units
	matrix = mat4.scale(matrix, texWidth, texHeight, 1);
   
	// Set the matrix.
	gl.uniformMatrix4fv(matrixLocation, false, matrix);
   
	// Tell the shader to get the texture from texture unit 0
	gl.uniform1i(textureLocation, 0);
   
	// draw the quad (2 triangles, 6 vertices)
	gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}