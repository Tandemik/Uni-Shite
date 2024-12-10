const canvas = document.getElementById("renderCanvasProjectFour"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
var createScene = async function () {
  var currentScene = 1;

  var scene1 = await (async function(){
      var scene = new BABYLON.Scene(engine);
      
      const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        -Math.PI / 2,
        Math.PI / 4,
        10,
        BABYLON.Vector3.Zero()
      );
      camera.attachControl(canvas, true);

      var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Start");
      button1.width = "150px"
      button1.height = "40px";
      button1.color = "white";
      button1.cornerRadius = 20;
      button1.background = "purple";
      button1.onPointerUpObservable.add(function() {
          currentScene = 2
      });
      advancedTexture.addControl(button1);   
      
      return scene;
  })();

  var scene2 = await (async function(){
      var scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        -Math.PI / 2,
        Math.PI / 4,
        10,
        BABYLON.Vector3.Zero()
      );
      camera.attachControl(canvas, true);

      const box = BABYLON.MeshBuilder.CreateBox("box", scene2)
      box.position.x = 5
      var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
      boxMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
      box.material = boxMaterial;

      const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", scene2)
      sphere.position.x = -5
      var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
      sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sphere.material = sphereMaterial;

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

      const sfx = new BABYLON.Sound("sfx", "../assets/sounds/boing_poing.wav", scene);

      const music = new BABYLON.Sound("Music", "../assets/sounds/rain.wav", scene, null, {
        loop: true,
        autoplay: false,
      });

      var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play Sound");
      button1.width = "150px"
      button1.height = "40px";
      button1.color = "white";
      button1.cornerRadius = 20;
      button1.background = "purple";
      button1.top = 25
      button1.onPointerUpObservable.add(function() {
          sfx.play()
      });
      advancedTexture.addControl(button1); 

      var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Play Ambient Rain");
      button2.width = "150px"
      button2.height = "40px";
      button2.color = "white";
      button2.cornerRadius = 20;
      button2.background = "purple";
      button2.top = -25
      button2.onPointerUpObservable.add(function() {
        if(music.isPlaying == false)
          music.play()
      });
      advancedTexture2.addControl(button2); 

      scene.onPointerDown = function castRay() {
        var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);

        var hit = scene.pickWithRay(ray);
        if (hit.pickedMesh == box) {
            button1.background = "green";
            button2.background = "green";
        }else if (hit.pickedMesh == sphere) {
            button1.background = "red";
            button2.background = "red";
        }

      
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var instructions = new BABYLON.GUI.TextBlock();
        instructions.text = "Click The Shapes To Change Button Colours";
        instructions.color = "white";
        instructions.fontSize = 16;
        instructions.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        advancedTexture.addControl(instructions);
    }

      return scene;
  })();


  setTimeout(function() {
      engine.stopRenderLoop();

      engine.runRenderLoop(function () {
      if (currentScene == 1) {
          scene1.render();
      } else {
          scene2.render();
      }
      });
  }, 500);

  

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
