function Quad()
{
	vList = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0
	  ];

  fList = [
		0,  1,  2, 
		0,  2,  3    
	  ];
	
	vnList = null;

  tCoords = [
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];

  let data = {
    vertexList: vList,
    vertexNormalList: vnList,
    faceList: fList,
    textureCoords: tCoords
  }

  return new ObjModel(data);
}