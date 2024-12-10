const canvas = document.getElementById("renderCanvasProjectTwo"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    5,
    BABYLON.Vector3.Zero()
  );
  camera.attachControl(canvas, true);
  camera.setPosition(new BABYLON.Vector3(0, 10, 20));
  camera.upperBetaLimit = BABYLON.Angle.FromDegrees(70).radians();
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 15

  const light1 = new BABYLON.DirectionalLight(
    "DirectionalLight",
    new BABYLON.Vector3(3, -2, 1)
  );
  const light2 = new BABYLON.HemisphericLight(
    "HemiLight",
    new BABYLON.Vector3(0, 1, 0)
  );
  light1.intensity = 0.75;
  light2.intensity = 0.2;

  var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gfhm", "../assets/Textures/heightmap.png", {width:20, height :20, subdivisions: 1000, maxHeight: 5}, scene)
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("../assets/Textures/grass.jpg");
  groundMaterial.diffuseTexture.uScale = 3.0;
  groundMaterial.diffuseTexture.vScale = 3.0;
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  // Skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/Textures/SkyBox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;	

  

    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;
    boxMaterial = new BABYLON.StandardMaterial("houseMaterial", scene)
    boxMaterial.diffuseTexture = new BABYLON.Texture("../assets/textures/wood.jpg")
    box.material = boxMaterial
    box.receiveShadows = true;
    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 0.72;
    roof.parent = box;
    roofMaterial = new BABYLON.StandardMaterial("roofMaterial", scene)
    roofMaterial.diffuseTexture = new BABYLON.Texture("../assets/textures/metal.jpg")
    roof.material = roofMaterial
    roof.receiveShadows = true;
  

    const box2 = box.clone("box2");
    box2.position.x = 3;
    box2.position.z = 1;

    const box3 = box.clone("box3");
    box3.position.x = -1;
    box3.position.z = 2;

    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
    shadowGenerator.addShadowCaster(ground);
    shadowGenerator.addShadowCaster(box);
    shadowGenerator.addShadowCaster(box2);
    shadowGenerator.addShadowCaster(box3);

  return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
