function UIHandler(scene)
{
    // Object
    this.selectSpawn = document.getElementById("selectSpawn");
    this.selectObject = document.getElementById("selectObject");
    this.selectDrawType = document.getElementById("selectDrawType");

    this.btnSpawn = document.getElementById("btnSpawn");
    this.btnDelete = document.getElementById("btnDelete");

    this.position = [
        document.getElementById("inPosX"),
        document.getElementById("inPosY"),
        document.getElementById("inPosZ")
    ];

    this.rotation = [
        document.getElementById("inRotX"),
        document.getElementById("inRotY"),
        document.getElementById("inRotZ")
    ];

    this.shouldRotate = document.getElementById("shouldRotate");

    this.scale = [
        document.getElementById("inScaleX"),
        document.getElementById("inScaleY"),
        document.getElementById("inScaleZ")
    ];

    // Camera
    this.camPosition = document.getElementById("camPosition");
    this.camRotation = document.getElementById("camRotation");
    this.camScale = document.getElementById("camScale");

    this.fovValue = document.getElementById("fovValue");
    this.fovSlider = document.getElementById("fovSlider");
    
    //Lighting
    this.ambientLight = [
        document.getElementById("ambientLightX"),
        document.getElementById("ambientLightY"),
        document.getElementById("ambientLightZ")
    ]

    this.directionalLightColor = [
        document.getElementById("directionalLightColorX"),
        document.getElementById("directionalLightColorY"),
        document.getElementById("directionalLightColorZ")
    ]

    this.directionalVector = [
        document.getElementById("directionalVectorX"),
        document.getElementById("directionalVectorY"),
        document.getElementById("directionalVectorZ")
    ]

    this.ambientValues = document.getElementById("ambientValues");
    this.directionalColorValues = document.getElementById("directionalColorValues");
    this.directionValues = document.getElementById("directionValues");


    // Functions

    /**
     * Adds object to the UI dropdown
     * @param {*} title 
     */
    this.addOption = function(title)
    {   
        let option = document.createElement("option");
        option.text = title;
        this.selectObject.add(option);
    }

	/**
	 * Add event listeners
	 */
	this.addListeners = function()
	{
		this.btnSpawn.addEventListener("click", scene.spawnModel);
		this.btnDelete.addEventListener("click", this.deleteModel);
		this.selectDrawType.addEventListener("change", this.updateDrawType);
		this.selectObject.addEventListener("change", this.updateObjectToUI);

		this.position[0].addEventListener("change", this.updateUIToObject);
		this.position[1].addEventListener("change", this.updateUIToObject);
		this.position[2].addEventListener("change", this.updateUIToObject);

		this.rotation[0].addEventListener("change", this.updateUIToObject);
		this.rotation[1].addEventListener("change", this.updateUIToObject);
		this.rotation[2].addEventListener("change", this.updateUIToObject);

		this.shouldRotate.addEventListener("change", this.updateUIToObject);

		this.scale[0].addEventListener("change", this.updateUIToObject);
		this.scale[1].addEventListener("change", this.updateUIToObject);
		this.scale[2].addEventListener("change", this.updateUIToObject);

		this.fovSlider.addEventListener("change", this.updateUIToObject);

		this.ambientLight[0].addEventListener("change", this.updateUIToObject);
		this.ambientLight[1].addEventListener("change", this.updateUIToObject);
		this.ambientLight[2].addEventListener("change", this.updateUIToObject);

		this.directionalLightColor[0].addEventListener("change", this.updateUIToObject);
		this.directionalLightColor[1].addEventListener("change", this.updateUIToObject);
		this.directionalLightColor[2].addEventListener("change", this.updateUIToObject);

		this.directionalVector[0].addEventListener("change", this.updateUIToObject);
		this.directionalVector[1].addEventListener("change", this.updateUIToObject);
		this.directionalVector[2].addEventListener("change", this.updateUIToObject);
	}	

	/**
	 * Callback on select drawType
	 */
	this.updateDrawType = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		scene.nodeRoot.Children[this.selectObject.selectedIndex].Object.drawType = this.selectDrawType.value;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	this.updateCameraUI = function()
	{
		this.camPosition.innerHTML = `${scene.camera.position}`;
		this.camRotation.innerHTML = `${scene.camera.rotation}`;
		this.camScale.innerHTML = `${scene.camera.scale}`;
		
		this.fovValue.innerHTML = `${scene.camera.fov}`;
	}

	/**
	 * Updates the UI with data from the camera object
	 */
	this.updateLightValuesUI = function()
	{
		this.ambientValues.innerHTML = `${scene.lighting.AmbientLight}`;
		this.directionalColorValues.innerHTML = `${scene.lighting.DirectionalLightColor}`;
		this.directionValues.innerHTML = `${scene.lighting.DirectionalVector}`;
	}

	/**
	 * Updates the ui values on selected object change
	 */
	this.updateObjectToUI = function()
	{
        console.log(scene);
		if(scene.nodeRoot.Children.length <= 0) { return; }

		let objectIndex = this.selectObject.selectedIndex;

		this.selectDrawType.value = scene.nodeRoot.Children[objectIndex].Object.drawType;

		this.position[0].value = scene.nodeRoot.Children[objectIndex].Object.position[0];
		this.position[1].value = scene.nodeRoot.Children[objectIndex].Object.position[1];
		this.position[2].value = scene.nodeRoot.Children[objectIndex].Object.position[2];
		
		this.rotation[0].value = scene.nodeRoot.Children[objectIndex].Object.rotation[0];
		this.rotation[1].value = scene.nodeRoot.Children[objectIndex].Object.rotation[1];
		this.rotation[2].value = scene.nodeRoot.Children[objectIndex].Object.rotation[2];
		
	 	this.shouldRotate.checked = scene.nodeRoot.Children[objectIndex].spin;

		this.scale[0].value = scene.nodeRoot.Children[objectIndex].Object.scale[0];
		this.scale[1].value = scene.nodeRoot.Children[objectIndex].Object.scale[1];
		this.scale[2].value = scene.nodeRoot.Children[objectIndex].Object.scale[2];
	}

	/**
	 * Updates the object with UI values
	 */
	this.updateUIToObject = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		let objectIndex = this.selectObject.selectedIndex;

		scene.nodeRoot.Children[objectIndex].Object.position = [Number(this.position[0].value), Number(this.position[1].value), Number(this.position[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.rotation = [Number(this.rotation[0].value), Number(this.rotation[1].value), Number(this.rotation[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.scale = [Number(this.scale[0].value), Number(this.scale[1].value), Number(this.scale[2].value)];
		scene.nodeRoot.Children[objectIndex].Object.spin = this.shouldRotate.checked;

		scene.camera.fov = this.fovSlider.value;

		scene.lighting.AmbientLight = [Number(this.ambientLight[0].value), Number(this.ambientLight[1].value), Number(this.ambientLight[2].value)];
		scene.lighting.DirectionalLightColor = [Number(this.directionalLightColor[0].value), Number(this.directionalLightColor[1].value), Number(this.directionalLightColor[2].value)];
		scene.lighting.DirectionalVector = [Number(this.directionalVector[0].value), Number(this.directionalVector[1].value), Number(this.directionalVector[2].value)];
	}

	/**
	 * Deletes the selected model
	 */
	this.deleteModel = function()
	{
		if(scene.nodeRoot.Children.length <= 0) { return; }

		console.log("Deleted object");
		let objectIndex = this.selectObject.selectedIndex;

		scene.nodeRoot.Children.splice(objectIndex, 1);
		this.selectObject.remove(objectIndex);
    }
    
    /**
     * Handles keyboard input
     * @param {*} event 
     */
    this.handleInput = function(event)
    {
        let moveAmount = 0.03;
		let rotateAmount = 1.5;
		console.log(this);
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