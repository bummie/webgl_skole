function IOHandler(scene)
{
/**
 * Loads the given file and sends the data to the parser
 * @param {*} callback 
 */
  this.loadFile = function(modelPath, callback)
  {
      fetch(modelPath)
      .then(response => response.text())
      .then(data => callback(parseObj(data)));
  }

  /**
   * Parse the obj file text
   * TODO:: Check if file is valid
   */
  function parseObj(objFile)
  {
    let objFileSplit = objFile.split(/\r?\n/g);
    let vList = [],
        vnList = [],
        fList = [];

    let vertexDataCount = 3;

    objFileSplit.forEach(line =>
    {
      let lineSplit = line.split(' ');
      
      switch(lineSplit[0] )
      {
        case 'v':

          for(let i = 1; i <= vertexDataCount; i++)
          {
            vList.push(parseFloat(lineSplit[i]));
          };

        break;

        case 'vn':
          for(let i = 1; i <= vertexDataCount; i++)
          {
            vnList.push(parseFloat(lineSplit[i]));
          };
        break;

        case 'f':
          for(let i = 1; i <= vertexDataCount; i++)
          {
			fList.push(parseInt(lineSplit[i].split('/')[0])-1);
			//TODO:: Load more face data
			//fList.push(parseInt(lineSplit[i].split('/')[1])-1);
			//fList.push(parseInt(lineSplit[i].split('/')[2])-1);

          };
        break;
      } 
    });
    
    return {
      vertexList: vList,
      vertexNormalList: vnList,
      faceList: fList
    }
  }

  /**
   * Handle loading of local .obj files
   * @param {*} evt 
   */
  this.handleFileSelect = function(evt)
  {
    let file = evt.target.files[0]; 

	if (file) 
	{
		let r = new FileReader();
		r.onload = function(e)
		{ 
			let contents = e.target.result;
			scene.loadModelFromFile(parseObj(contents), file.name);

		  	console.log( "Got the file.n" 
				+ "name: " + file.name + "n"
				+ "type: " + file.type + "n"
				+ "size: " + file.size + " bytesn"
		  	);  
		}
		r.readAsText(file);
	}
	else 
	{ 
		alert("Failed to load file");
	}
  }

  document.getElementById('files').addEventListener('change', this.handleFileSelect, false);
}