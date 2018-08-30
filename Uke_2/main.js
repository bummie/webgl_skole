let scene = new SceneRenderer();
scene.main();

const objLocation = './models/Armadillo.obj';
let ioTest = new IOHandler();
ioTest.loadFile(objLocation, loadVertices );

function loadVertices(obj)
{
	console.log(obj);
}