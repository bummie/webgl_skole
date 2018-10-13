function UIHandler(scene)
{
	let self = this;

    // Object
    self.selectSpawn = document.getElementById("selectSpawn");
    self.selectObject = document.getElementById("selectObject");
    self.selectDrawType = document.getElementById("selectDrawType");

    self.btnSpawn = document.getElementById("btnSpawn");
    self.btnDelete = document.getElementById("btnDelete");

    self.position = [
        document.getElementById("inPosX"),
        document.getElementById("inPosY"),
        document.getElementById("inPosZ")
    ];

    self.rotation = [
        document.getElementById("inRotX"),
        document.getElementById("inRotY"),
        document.getElementById("inRotZ")
    ];

    self.shouldRotate = document.getElementById("shouldRotate");

    self.scale = [
        document.getElementById("inScaleX"),
        document.getElementById("inScaleY"),
        document.getElementById("inScaleZ")
    ];

    // Camera
    self.camPosition = document.getElementById("camPosition");
    self.camRotation = document.getElementById("camRotation");
    self.camScale = document.getElementById("camScale");

    self.fovValue = document.getElementById("fovValue");
    self.fovSlider = document.getElementById("fovSlider");
    
    //light
    self.ambientLight = [
        document.getElementById("ambientLightX"),
        document.getElementById("ambientLightY"),
        document.getElementById("ambientLightZ")
    ]

    self.directionalLightColor = [
        document.getElementById("directionalLightColorX"),
        document.getElementById("directionalLightColorY"),
        document.getElementById("directionalLightColorZ")
    ]

    self.directionalVector = [
        document.getElementById("directionalVectorX"),
        document.getElementById("directionalVectorY"),
        document.getElementById("directionalVectorZ")
    ]

    self.ambientValues = document.getElementById("ambientValues");
    self.directionalColorValues = document.getElementById("directionalColorValues");
    self.directionValues = document.getElementById("directionValues");


    // Functions

    /**
     * Adds object to the UI dropdown
     * @param {*} title 
     */
    self.addOption = function(title)
    {   
        let option = document.createElement("option");
        option.text = title;
        self.selectObject.add(option);
    }

	/**
	 * Add event listeners
	 */
	self.addListeners = function()
	{
		self.btnSpawn.addEventListener("click", scene.spawnModel);
		self.btnDelete.addEventListener("click", self.deleteModel);
		self.selectDrawType.addEventListener("change", self.updateDrawType);
		self.selectObject.addEventListener("change", self.updateObjectToUI);

		self.position[0].addEventListener("change", self.updateUIToObject);
		self.position[1].addEventListener("change", self.updateUIToObject);
		self.position[2].addEventListener("change", self.updateUIToObject);

		self.rotation[0].addEventListener("change", self.updateUIToObject);
		self.rotation[1].addEventListener("change", self.updateUIToObject);
		self.rotation[2].addEventListener("change", self.updateUIToObject);

		self.shouldRotate.addEventListener("change", self.updateUIToObject);

		self.scale[0].addEventListener("change", self.updateUIToObject);
		self.scale[1].addEventListener("change", self.updateUIToObject);
		self.scale[2].addEventListener("change", self.updateUIToObject);

		self.fovSlider.addEventListener("change", self.updateUIToObject);

		self.ambientLight[0].addEventListener("change", self.updateUIToObject);
		self.ambientLight[1].addEventListener("change", self.updateUIToObject);
		self.ambientLight[2].addEventListener("change", self.updateUIToObject);

		self.directionalLightColor[0].addEventListener("change", self.updateUIToObject);
		self.directionalLightColor[1].addEventListener("change", self.updateUIToObject);
		self.directionalLightColor[2].addEventListener("change", self.updateUIToObject);

		self.directionalVector[0].addEventListener("change", self.updateUIToObject);
		self.directionalVector[1].addEventListener("change", self.updateUIToObject);
		self.directionalVector[2].addEventListener("change", self.updateUIToObject);
	}	

	/**
	 * Callback on select drawType
	 */
	self.updateDrawType = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		scene.nodeRoot.Children[self.selectObject.selectedIndex].Object.drawType = self.selectDrawType.value;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	self.updateCameraUI = function()
	{
		self.camPosition.innerHTML = `${scene.camera.position}`;
		self.camRotation.innerHTML = `${scene.camera.rotation}`;
		self.camScale.innerHTML = `${scene.camera.scale}`;
		
		self.fovValue.innerHTML = `${scene.camera.fov}`;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	self.updateLightValuesUI = function()
	{
		self.ambientValues.innerHTML = `${scene.light.ambientLight}`;
		self.directionalColorValues.innerHTML = `${scene.light.directionalLightColor}`;
		self.directionValues.innerHTML = `${scene.light.directionalVector}`;
	}

	/**
	 * Updates the ui values on selected object change
	 */
	self.updateObjectToUI = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		let objectIndex = self.selectObject.selectedIndex;

		self.selectDrawType.value = scene.nodeRoot.Children[objectIndex].Object.drawType;

		self.position[0].value = scene.nodeRoot.Children[objectIndex].Object.position[0];
		self.position[1].value = scene.nodeRoot.Children[objectIndex].Object.position[1];
		self.position[2].value = scene.nodeRoot.Children[objectIndex].Object.position[2];
		
		self.rotation[0].value = scene.nodeRoot.Children[objectIndex].Object.rotation[0];
		self.rotation[1].value = scene.nodeRoot.Children[objectIndex].Object.rotation[1];
		self.rotation[2].value = scene.nodeRoot.Children[objectIndex].Object.rotation[2];
		
	 	self.shouldRotate.checked = scene.nodeRoot.Children[objectIndex].spin;

		self.scale[0].value = scene.nodeRoot.Children[objectIndex].Object.scale[0];
		self.scale[1].value = scene.nodeRoot.Children[objectIndex].Object.scale[1];
		self.scale[2].value = scene.nodeRoot.Children[objectIndex].Object.scale[2];
	}

	/**
	 * Updates the object with UI values
	 */
	self.updateUIToObject = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		let objectIndex = self.selectObject.selectedIndex;

		scene.nodeRoot.Children[objectIndex].Object.position = [Number(self.position[0].value), Number(self.position[1].value), Number(self.position[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.rotation = [Number(self.rotation[0].value), Number(self.rotation[1].value), Number(self.rotation[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.scale = [Number(self.scale[0].value), Number(self.scale[1].value), Number(self.scale[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.spin = self.shouldRotate.checked;

		scene.camera.fov = self.fovSlider.value;

		scene.light.ambientLight = [Number(self.ambientLight[0].value), Number(self.ambientLight[1].value), Number(self.ambientLight[2].value)];
		scene.light.directionalLightColor = [Number(self.directionalLightColor[0].value), Number(self.directionalLightColor[1].value), Number(self.directionalLightColor[2].value)];
		scene.light.directionalVector = [Number(self.directionalVector[0].value), Number(self.directionalVector[1].value), Number(self.directionalVector[2].value)];
	}

	/**
	 * Deletes the selected model
	 */
	self.deleteModel = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		console.log("Deleted object");
		let objectIndex = self.selectObject.selectedIndex;

		scene.nodeRoot.Children.splice(objectIndex, 1);
		self.selectObject.remove(objectIndex);
    }
    
    /**
     * Handles keyboard input
     * @param {*} event 
     */
    self.handleInput = function(event)
    {
        let moveAmount = 0.03;
		let rotateAmount = 1.5;

        switch(event.keyCode)
		{	
			// W
			case 87:
				scene.camera.position[2] += moveAmount;
			break;

			// A
			case 65:
				scene.camera.position[0] += moveAmount;

			break;

			// S
			case 83:
				scene.camera.position[2] -= moveAmount;
			break;

			// D
			case 68:
				scene.camera.position[0] -= moveAmount;
			break;
			
			// SPACE
			case 32:
				scene.camera.position[1] -= moveAmount;
			break;

			// CTRL
			case 17:
				scene.camera.position[1] += moveAmount;
			break;

			// UPUP
			case 38:
				scene.camera.rotation[0] += rotateAmount;
			break;

			// LEFT
			case 37:
				scene.camera.rotation[1] -= rotateAmount;
			break;

			// DOWN
			case 40:
				scene.camera.rotation[0] -= rotateAmount;
			break;

			// RIGHT
			case 39:
				scene.camera.rotation[1] += rotateAmount;
			break;

			// Z-Axis
			case 81:
				scene.camera.rotation[2] -= rotateAmount;
			break;

			// Z-Axis
			case 69:
				scene.camera.rotation[2] += rotateAmount;
			break;
			
		}
    }
}