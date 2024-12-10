const canvas = document.getElementById("renderCanvasProjectThree"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function () {

  // Low Poly Character with Blender Tutorial of Grant Abbitt: https://www.youtube.com/user/mediagabbitt
  // Character animations by Mixamo: https://www.mixamo.com/

  engine.enableOfflineSupport = false;

  // Scene and Camera
  var scene = new BABYLON.Scene(engine);

  var camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, -5, 0), scene);
  scene.activeCamera = camera1;
  scene.activeCamera.attachControl(canvas, true);
  camera1.lowerRadiusLimit = 2;
  camera1.upperRadiusLimit = 10;
  camera1.wheelDeltaPercentage = 0.01;

  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = BABYLON.Color3.Black();

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // Skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/textures/SkyBox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = BABYLON.Color3.Black()
  skyboxMaterial.specularColor = BABYLON.Color3.Black();
  skybox.material = skyboxMaterial;

  //  Box
  var box = BABYLON.MeshBuilder.CreateBox("box", {height:5, width:15},scene)
  box.position.z = -4
  box.position.y = 2.5
  box.checkCollisions = true;

  // GUI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var instructions = new BABYLON.GUI.TextBlock();
  instructions.text = "Move w/ WASD keys, look with the mouse";
  instructions.color = "white";
  instructions.fontSize = 16;
  instructions.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  instructions.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  advancedTexture.addControl(instructions);

  // Ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 50, width: 50, subdivisions: 4 }, scene);
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("../assets/textures/wood.jpg", scene);
  groundMaterial.diffuseTexture.uScale = 30;
  groundMaterial.diffuseTexture.vScale = 30;
  groundMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
  ground.material = groundMaterial;

  // Keyboard events
  var inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));


  // Load hero character
  BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
      var hero = newMeshes[0];

      //Scale the model down        
      hero.scaling.scaleInPlace(0.1);

      //Lock camera on the character 
      camera1.target = hero;

      //Hero character variables 
      var heroSpeed = 0.1;
      var heroSpeedBackwards = 0.05;
      var heroRotationSpeed = 0.1;

      var animating = true;

      const walkAnim = scene.getAnimationGroupByName("Walking");
      const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
      const idleAnim = scene.getAnimationGroupByName("Idle");

      

      //Rendering loop (executed for everyframe)
      scene.onBeforeRenderObservable.add(() => {
          var keydown = false;
          //Manage the movements of the character (e.g. position, direction)
          if (inputMap["w"]) {
              hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
              keydown = true;
          }
          if (inputMap["s"]) {
              hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
              keydown = true;
          }
          if (inputMap["a"]) {
              hero.rotate(BABYLON.Vector3.Up(), -heroRotationSpeed);
              keydown = true;
          }
          if (inputMap["d"]) {
              hero.rotate(BABYLON.Vector3.Up(), heroRotationSpeed);
              keydown = true;
          }

          //Manage animations to be played  
          if (keydown) {
              if (!animating) {
                  animating = true;
                  if (inputMap["s"]) {
                      //Walk backwards
                      walkBackAnim.start(true, 1.0, walkBackAnim.from, walkBackAnim.to, false);
                  }
                  else {
                      //Walk
                      walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
                  }
              }
          }
          else {

              if (animating) {
                  //Default animation is idle when no key is down     
                  idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

                  //Stop all animations besides Idle Anim when no key is down
                  walkAnim.stop();
                  walkBackAnim.stop();

                  //Ensure animation are played only once per rendering loop
                  animating = false;
              }
          }
      });
  });

  // const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
  // shadowGenerator.addShadowCaster(Hero);


  return scene;
}



const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
