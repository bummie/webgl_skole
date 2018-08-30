function IOHandler()
{
    const objLocation = './models/Armadillo.obj';

    this.loadFile = function()
    {
       fetch(objLocation)
       .then(response => response.text())
       .then(text => this.parseObj(text));
    }

    /**
     * Parse the obj file text
     */
    this.parseObj = function(objFile)
    {
      let objFileSplit = objFile.split(/\r?\n/g);
      let vList = [];
      let fList = [];

      let vertexDataCount = 3;

      objFileSplit.forEach(line =>
      {
        let lineSplit = line.split(' ');
        
        switch(lineSplit[0] )
        {
          case 'v':

            for(let i = 1; i <= vertexDataCount; i++)
            {
              vList.push(lineSplit[i]);
            };

          break;

          case 'f':

          break;
        } 
      });

      console.log(vList[0] + " " + vList[1] + " " + vList[2]);
      
      return {
        vertexList: vList,
        faceList: fList
      }
    }
}