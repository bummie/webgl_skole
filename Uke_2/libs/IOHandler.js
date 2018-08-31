function IOHandler()
{
/**
 * 
 * @param {*} callback 
 */
  this.loadFile = function(modelPath, callback)
  {
      fetch(modelPath)
      .then(response => response.text())
      .then(text => callback(this.parseObj(text)));
  }

  /**
   * Parse the obj file text
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
            fList.push(parseInt(lineSplit[i].split('//')[0])-1);
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