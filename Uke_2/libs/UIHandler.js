function UIHandler()
{
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

    this.scale = [
        document.getElementById("inScaleX"),
        document.getElementById("inScaleY"),
        document.getElementById("inScaleZ")
    ];
    
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