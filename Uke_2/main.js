
function loadScene()
{
	let scene = new SceneRenderer();
	scene.main();

	window.addEventListener('keydown', scene.input, false);
}

if (document.readyState === "loading") 
{
	document.addEventListener("DOMContentLoaded", loadScene);
} 
else
{  
	loadScene();
}