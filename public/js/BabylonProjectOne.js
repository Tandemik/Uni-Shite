const canvas = document.getElementById("renderCanvasProjectOne"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    10,
    BABYLON.Vector3.Zero()
  );
  camera.attachControl(canvas, true);

  const light1 = new BABYLON.DirectionalLight(
    "DirectionalLight",
    new BABYLON.Vector3(3, -2, 1)
  );
  const light2 = new BABYLON.HemisphericLight(
    "HemiLight",
    new BABYLON.Vector3(0, 1, 0)
  );
  light1.intensity = 0.75;
  light2.intensity = 0.5;

  const box = BABYLON.MeshBuilder.CreateBox("box", {});
  box.position.x = 2;
  var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseTexture = new BABYLON.Texture(
    "../assets/textures/metal.jpg"
  );
  box.material = boxMaterial;

  const torus = BABYLON.MeshBuilder.CreateTorus("torus", {});
  torus.position.y = 2;
  var torusMaterial = new BABYLON.StandardMaterial("torusMaterial", scene);
  torusMaterial.diffuseTexture = new BABYLON.Texture(
    "../assets/textures/metal.jpg"
  );
  torus.material = torusMaterial;

  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  ground.position.y = -0.5;
  groundMaterial.diffuseTexture = new BABYLON.Texture(
    "../assets/textures/wood.jpg"
  );
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
  shadowGenerator.addShadowCaster(box);
  shadowGenerator.addShadowCaster(torus);

  const frameRate = 10;

  const xSlide = new BABYLON.Animation(
    "xSlide",
    "position.x",
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 2,
  });

  keyFrames.push({
    frame: frameRate,
    value: -2,
  });

  keyFrames.push({
    frame: 2 * frameRate,
    value: 2,
  });

  xSlide.setKeys(keyFrames);

  scene.beginDirectAnimation(box, [xSlide], 0, 2 * frameRate, true);

  scene.registerBeforeRender(function () {
    torus.rotation.x += 0.01;
    torus.rotation.z += 0.02;
  });

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
