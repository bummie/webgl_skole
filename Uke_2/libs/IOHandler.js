function IOHandler()
{
/**
 * Loads the given file and sends the data to the parser
 * @param {*} callback 
 */
  this.loadFile = function(modelPath, callback)
  {
      fetch(modelPath)
      .then(response => response.text())
      .then(data => callback(this.parseObj(data)));
  }

  /**
   * Parse the obj file text
   * TODO:: Check if file is valid
   */
  this.parseObj = function(objFile)
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
}