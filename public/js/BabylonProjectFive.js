const canvas = document.getElementById("renderCanvasProjectFive"); // Get the canvas element
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

      
      const music = new BABYLON.Sound("Music", "../assets/sounds/tunes.wav", scene, null, {
        loop: true,
        volume: 0.3
      });

      var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Start Game");
      button1.width = "150px"
      button1.height = "40px";
      button1.color = "white";
      button1.cornerRadius = 20;
      button1.background = "purple";
      button1.onPointerUpObservable.add(function() {
        music.play()
        currentScene = 2
      });
      advancedTexture.addControl(button1);   
      
      return scene;
  })();

  var scene2 = await (async function(){
      var scene = new BABYLON.Scene(engine);

      var camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(-17, 20, 5), scene);
      scene.activeCamera = camera1;
      scene.activeCamera.attachControl(canvas, true);
      camera1.lowerRadiusLimit = 16;
      camera1.upperRadiusLimit = 16;
      camera1.wheelDeltaPercentage = 0.01;
      camera1.upperBetaLimit = BABYLON.Angle.FromDegrees(15).radians();
      camera1.lowerBetaLimit = BABYLON.Angle.FromDegrees(15).radians();
      camera1.lowerAlphaLimit = BABYLON.Angle.FromDegrees(90).radians();
      camera1.upperAlphaLimit = BABYLON.Angle.FromDegrees(90).radians();

      const light1 = new BABYLON.DirectionalLight(
        "DirectionalLight",
        new BABYLON.Vector3(0, -50, 50)
      );
      const light2 = new BABYLON.HemisphericLight(
        "HemiLight",
        new BABYLON.Vector3(0, 1, 0)
      );
      light1.intensity = 0.8;
      light2.intensity = 0.75;

      const tracks = new BABYLON.Sound("tracks", "../assets/sounds/tracks.wav", scene, null, {
        volume: 0.1,
        loop: true
      });
      const tracksAI = new BABYLON.Sound("tracksAI", "../assets/sounds/tracks.wav", scene, null, {
        volume: 0.1,
        loop: true
      });

      const shot = new BABYLON.Sound("shot", "../assets/sounds/shot.wav", scene, null, {
        volume: 0.02,
        loop: false
      });
      const shotAI = new BABYLON.Sound("shotAI", "../assets/sounds/shot.wav", scene, null, {
        volume: 0.02,
        loop: false
      });


      var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      var instructions = new BABYLON.GUI.TextBlock();
      instructions.text = "W/S to Move, A/D to Turn, Space to Shoot";
      instructions.color = "black";
      instructions.fontSize = 16;
      instructions.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
      advancedTexture.addControl(instructions);

      var ground = BABYLON.MeshBuilder.CreateBox("box", {width:50, height :40, depth: 100}, scene)
      var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture("../assets/Textures/wood.jpg");
      groundMaterial.diffuseTexture.uScale = 30.0;
      groundMaterial.diffuseTexture.vScale = 30.0;
      ground.position.y = -15.5
      ground.position.x = -19
      ground.material = groundMaterial;
      ground.receiveShadows = true;

      var wall = BABYLON.MeshBuilder.CreateBox("wall", {width:50, height :20, depth: 100}, scene)
      var wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseTexture = new BABYLON.Texture("../assets/Textures/wood.jpg");
      wallMaterial.diffuseTexture.uScale = 30.0;
      wallMaterial.diffuseTexture.vScale = 30.0;
      wall.position.x = 30
      wall.checkCollisions = true
      wall.material = groundMaterial;
      wall.receiveShadows = true;

      var wall2 = wall.clone()
      wall2.position.x -= 94

      wall3 = wall.clone()
      wall3.position.x -= 47
      wall3.position.z -= 62

      wall4 = wall3.clone()
      wall4.position.z += 125

      
      var bulletPlayer = new BABYLON.MeshBuilder.CreateSphere("bulletPlayer", {diameter:0.75}, scene)
      var bulletPlayerMat = new BABYLON.StandardMaterial()
      bulletPlayerMat.diffuseTexture = new BABYLON.Texture("../assets/textures/metal.jpg")
      bulletPlayer.material = bulletPlayerMat
      bulletPlayer.position.y = -50
      bulletPlayer.checkCollisions = true

      var bulletAI = new BABYLON.MeshBuilder.CreateSphere("bulletAI", {diameter:0.75}, scene)
      var bulletAIMat = new BABYLON.StandardMaterial()
      bulletAIMat.diffuseTexture = new BABYLON.Texture("../assets/textures/metal.jpg")
      bulletAI.material = bulletAIMat
      bulletAI.position.y = -50
      bulletAI.checkCollisions = true

      var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/Textures/SkyBox/skybox", scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;	


      var obstacle = new BABYLON.MeshBuilder.CreateBox("box", {height:2, width: 2, depth:2}, scene)
      obstacle.position.x -= 20
      obstacle.position.y += 5
      var obstacleMat = new BABYLON.StandardMaterial()
      obstacleMat.diffuseColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random())
      obstacle.material = obstacleMat
      obstacle.checkCollisions = true
      

      var respawnPoint = new BABYLON.Vector3(0,5,0)
        
      var inputMap = {};
      scene.actionManager = new BABYLON.ActionManager(scene);
      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
          inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }));
      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
          inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }));

      //#region player
      var tank = new BABYLON.MeshBuilder.CreateBox("tankPlayer", {width:1,height:1,depth:2}, scene);
      tank.rotation = new BABYLON.Vector3(0,-0.5*3.14,0)
      tank.checkCollisions = true
      var cannonPart = new BABYLON.MeshBuilder.CreateBox("box", {width:0.75,height:0.5,depth:1}, scene);
      cannonPart.position = tank.position
      cannonPart.position.y += 1
      cannonPart.parent = tank;
      var cannon = new BABYLON.MeshBuilder.CreateCylinder("cyl", {width:0.75,height:2,diameter:0.5})
      cannon.parent = cannonPart;
      cannon.rotation.x += 0.5*3.14
      cannon.position.z += 0.5

      var tankCollisionMesh = new BABYLON.MeshBuilder.CreateBox("tankCollisionMeshPlayer", {width:1,height:5,depth:2}, scene)
      tankCollisionMesh.position = tank.position
      tankCollisionMesh.parent = tank
      tankCollisionMesh.visibility = 0
      tankCollisionMesh.checkCollisions = true

      var tankMat = new BABYLON.StandardMaterial()
      tankMat.diffuseColor = new BABYLON.Color3(0, 0.4, 0)
      tank.material = tankMat
      cannon.material = tankMat
      cannonPart.material = tankMat

      //tank character variables 
      var tankSpeed = 0.1;
      var canShoot = true

      tank.position = respawnPoint

        //Rendering loop (executed for everyframe)
        scene.onBeforeRenderObservable.add(async () => {
          var keydown = false
          //Manage the movements of the character (e.g. position, direction)
          if (inputMap["w"]) {
              tank.moveWithCollisions(tank.forward.scaleInPlace(tankSpeed));
              keydown = true;
          }
          if (inputMap["s"]) {
            tank.moveWithCollisions(tank.forward.scaleInPlace(-tankSpeed));
            keydown = true;
          }
          if (inputMap["a"]) {
              tank.rotation = new BABYLON.Vector3(0,tank.rotation.y-0.025,0);
              keydown = true;
          }
          if (inputMap["d"]) {
              tank.rotation = new BABYLON.Vector3(0,tank.rotation.y+0.025,0);
              keydown = true;
          }
          if (inputMap[" "] && canShoot){
            var bulletShot = bulletPlayer.clone()
            shot.play()
            bulletShot.position = tank.position
            bulletShot.rotation = tank.rotation
            bulletShot.checkCollisions = true
            canShoot = false
            tank.moveWithCollisions(tank.forward.scaleInPlace(-tankSpeed));
            //#region 
            let delta = 0;
            const linearSpeed = 20;
            const translation = new BABYLON.Vector3(0,0,0);
            const rotation = new BABYLON.Vector3(0,0,0);
            scene.registerBeforeRender((e)=>{
                delta = e.deltaTime ? e.deltaTime/1000 : 0;
                translation.set(0,0,0);
                rotation.set(0,0,0);
                translation.z = linearSpeed*delta;
                bulletShot.rotation.y += rotation.y;
                bulletShot.locallyTranslate(translation)
            })
            //#endregion
            await delay(1000)
            canShoot = true;
            await delay(300)
            bulletShot.dispose()
          }
          if(keydown && !tracks.isPlaying){
            tracks.play()
          }else if(!keydown){
            tracks.stop()
          }

          });
        //#endregion
        

      var AIrespawnPoint = new BABYLON.Vector3(-35,5,0)
      //#region Player2 AI
      var action = Math.floor(Math.random() * (4 - 1 + 1)) + 1

      var tankAI = new BABYLON.MeshBuilder.CreateBox("tankAI", {width:1,height:1,depth:2}, scene);
      tankAI.rotation = new BABYLON.Vector3(0,0.5*3.14,0)
      tankAI.checkCollisions = true;
      var cannonPartAI = new BABYLON.MeshBuilder.CreateBox("box", {width:0.75,height:0.5,depth:1}, scene);
      cannonPartAI.position = tankAI.position
      cannonPartAI.position.y +=1
      cannonPartAI.parent = tankAI;
      var cannonAI = new BABYLON.MeshBuilder.CreateCylinder("cyl", {width:0.75,height:2,diameter:0.5})
      cannonAI.parent = cannonPartAI;
      cannonAI.rotation.x += 0.5*3.14
      cannonAI.position.z = 0.5

      var tankCollisionMeshAI = new BABYLON.MeshBuilder.CreateBox("tankCollisionMeshAI", {width:1,height:5,depth:2}, scene)
      tankCollisionMeshAI.position = tankAI.position
      tankCollisionMeshAI.parent = tankAI
      tankCollisionMeshAI.visibility = 0
      tankCollisionMeshAI.checkCollisions = true

      var tankAIMat = new BABYLON.StandardMaterial()
      tankAIMat.diffuseColor = new BABYLON.Color3(0.4, 0, 0)
      tankAI.material = tankAIMat
      cannonAI.material = tankAIMat
      cannonPartAI.material = tankAIMat

      //tank character variables 
      var tankAISpeed = 0.1;
      var canShootAI = true
      var isMoving = true

      


      tankAI.position = AIrespawnPoint

        //Rendering loop (executed for everyframe)
        scene.onBeforeRenderObservable.add(async () => {
          //Manage the movements of the character (e.g. position, direction)
          if (action == 1) {
            tankAI.moveWithCollisions(tankAI.forward.scaleInPlace(tankAISpeed));
            isMoving = true
            await AIdelay(2000)
            shoot()
          }
          if (action == 2) {
            tankAI.moveWithCollisions(tankAI.forward.scaleInPlace(-tankAISpeed));
            isMoving = true 
            await AIdelay(2000)
            shoot()
          }
          if (action == 3) {
            tankAI.rotation = new BABYLON.Vector3(0,tankAI.rotation.y-0.025,0);
            isMoving = true
            await AIdelay(1000)
            shoot()
          }
          if (action == 4) {
            tankAI.rotation = new BABYLON.Vector3(0,tankAI.rotation.y+0.025,0);
            isMoving = true
            await AIdelay(1000)
            shoot()
          }
          async function shoot() {
            if(canShootAI){
              canShootAI = false
              shotAI.play()
              var bulletShotAI = bulletAI.clone()
              bulletShotAI.position = tankAI.position
              bulletShotAI.rotation = tankAI.rotation
              bulletShotAI.checkCollisions = true
              //#region bullet shit
              let AIdelta = 0;
              const AIlinearSpeed = 20;
              const AItranslation = new BABYLON.Vector3(0,0,0);
              const AIrotation = new BABYLON.Vector3(0,0,0);
              scene.registerBeforeRender((e)=>{
              AIdelta = e.deltaTime ? e.deltaTime/1000 : 0;
              AItranslation.set(0,0,0);
              AIrotation.set(0,0,0);
              AItranslation.z = AIlinearSpeed*AIdelta;
              bulletShotAI.rotation.y += AIrotation.y;
              bulletShotAI.locallyTranslate(AItranslation)
              })
              //#endregion
              await AIdelay(1300)
              bulletShotAI.dispose()
              action = Math.floor(Math.random() * (4 - 1 + 1)) + 1
              canShootAI = true
            }
            return
          }

          if(isMoving && !tracksAI.isPlaying){
            tracksAI.play()
          }else if(!isMoving){
            tracksAI.stop()
          }
          });

          
      //#endregion
      

      //#region fuck it i tried, it just bypasses the "if" statements despite no collisions and doesnt even change scene, im gonna kms istg

      // if(tankCollisionMesh.intersectsMesh(bulletAI, true)){
      //   tank.dispose()
      //   currentScene = 1
      // }
      // if(tankCollisionMeshAI.intersectsMesh(bulletPlayer, true)){
      //   tankAI.dispose()
      //   currentScene = 1
      // }

      //#endregion




      var shadowGenerator = new BABYLON.ShadowGenerator(1024, light1)
      shadowGenerator.addShadowCaster(tank);
      shadowGenerator.addShadowCaster(tankAI);
      shadowGenerator.addShadowCaster(wall);
      shadowGenerator.addShadowCaster(wall2);
      shadowGenerator.addShadowCaster(wall3);
      shadowGenerator.addShadowCaster(wall4);




      return scene;
  })();


    
    


  const delay = ms => new Promise(res => setTimeout(res, ms));

  const AIdelay = ms => new Promise(res => setTimeout(res, ms));

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
