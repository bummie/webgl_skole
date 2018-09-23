function UIHandler()
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
}