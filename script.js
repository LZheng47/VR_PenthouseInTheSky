// cursor.components.raycaster.getIntersection(target);
// https://stackoverflow.com/questions/54261209/aframe-get-cursor-position-and-set-entity-on-that-postion
// Dealing with distance of cursor & interactable obj


// rnd => random integer from l to u, inclusive
let rnd = (l,u) => Math.floor(Math.random()*(u-l+1) + l);
let scene, wallLanterns = [], clone, stairSteps = [], flowers = [], bathBubbles = [], toilet, paintings = [], chillRoomMusic, toiletObj, doors = [], fishes = [], bathroomShowerWall;
let sinkAudio1, sinkAudio2;
let camera, cameraX, cameraZ;
let updateSongTime = 1, distanceClickable = 5;
let cursor;



let originPos = new THREE.Vector3();

let reloadButton;

window.onload = function(){
  scene = document.querySelector("a-scene");

  reloadButton = document.querySelector("#reload");
  reloadButton.addEventListener("click", ()=>{
    document.querySelector("#cameraRig").setAttribute("position", {x:0, y:3, z:0});
    document.querySelector("#camera").setAttribute("position", {x:0, y:0, z:0});
  });

  let boxes = scene.getElementsByTagName("a-box");
  for(let i = 0; i < boxes.length; i++){
    boxes[i].setAttribute("static-body", "");
  }

  // Initialize camera & cursor variables
  camera = document.querySelector("#camera");
  cursor = document.querySelector("a-cursor");
  
  // Clones wall lantern & push into wallLanterns array
  let wallLanternSample = document.querySelector("#wallLantern"); // Original wall lantern
  
  clone = wallLanternSample.cloneNode(true); // Cloned wall lantern
  wallLanterns.push(new WallLantern(-7, 3.5, -0.7, clone));

  clone = wallLanternSample.cloneNode(true);
  wallLanterns.push(new WallLantern(8.75, 3.5, -0.7, clone));

  
  // Make each step for the stairs
  let stairStep = document.querySelector("#stairStep"); // Original stair step
  // Original stairStep pos: -1.75, -3.8, -5.5
  // dy = 0.4; dz = 0.5
  for(let i = 0; i < 11; i++){
    // First flight of stairs
    clone = stairStep.cloneNode(true);
    stairSteps.push(new StairStep(-1.75, -3.8 + 0.38 * i, -5.27 + 0.5 * i, clone));
    
    // Second flight of stairs
    clone = stairStep.cloneNode(true);
    stairSteps.push(new StairStep(1.75, 0.2 + 0.38 * i, 0.23 - 0.5 * (i + 1), clone));
  }
  // Stair semi circle
  let stairStepSC = document.querySelector("#stairStepSC");
  stairSteps.push(new StairStep(0, 0, 0, stairStepSC.cloneNode(true)));

  
  // Flowers
  let flowerVase = document.querySelector("#flowerVase");
  let flower = document.querySelector("#flower");
  let numOfFlowers = 7;
  for(let i = 0; i < numOfFlowers; i++){
    let theta = 2 * Math.PI / numOfFlowers * i;
    clone = flower.cloneNode(true);
    clone.setAttribute("rotation", {x:rnd(-5, 5), y:rnd(0, 360), z:rnd(-5, 5)} );  // Random rotation
    clone.setAttribute("position", {x:0.125 * Math.cos(theta), y:Math.random() * (0.47 - 0.35) + 0.35, z:0.125 * Math.sin(theta)});  // Random position within the vase
    clone.querySelector("a-torus-knot").setAttribute("color", `rgb(${rnd(0, 255)}, ${rnd(0, 255)}, ${rnd(0, 255)})`) // Random flower color
    flowerVase.append(clone);
  }

  // Bath Bubbles (Spawn on top of "vents")
  for(let i = 0; i < 25; i++){
    bathBubbles.push(new BathBubble());
  }

  // Initial variables for toilet
  toilet = document.querySelector("#toilet");
  toiletRange = 2.5; 
  toiletSeatRot = 0;
  dtoiletSeatRot = 1;
  toiletCooldown = 15;

  // Initial variables for bathroom sinks
  bathroomSinks = document.querySelector("#bathroomSinks");
  bathroomSinksWater = document.querySelectorAll(".bathroomSinksWater");
  
  bathroomSinksWater[0].y = 0;
  bathroomSinksWater[0].dy = 0.01;
  bathroomSinksWater[1].y = 0;
  bathroomSinksWater[1].dy = 0.01;

  // Initial variables for kitchen fridge
  fridge = document.querySelector("#fridge");
  fridgeDoors = document.querySelectorAll(".fridgeDoor");
  fridgeDoors[0].cooldown = 20;
  fridgeDoors[0].rot = 0;
    
  fridgeDoors[1].cooldown = 20;
  fridgeDoors[1].rot = 0;

  // Initialize paintings (x,y,z,width,height,yrot,paintingID);
  paintings.push(new Painting(-14.25, 3.9, -3, 4.5, 4.5, 90, "#painting1"));
  paintings.push(new Painting(-14.25, 3.9, -9.5, 4.5, 4.5, 90, "#painting2"));
  paintings.push(new Painting(-14.25, 3.9, -16, 4.5, 4.5, 90, "#painting3"));
  paintings.push(new Painting(-11, 3.9, 0.75, 4.5, 4.5, 0, "#painting4"));
  paintings.push(new Painting(21.25, 4.5, -16, 12, 4.5, 90, "#painting5"));
  paintings.push(new Painting(0.75, 3.75, -26.75, 14.4, 4, 0, "#painting6"));
  paintings.push(new Painting(-15, 3.75, -26.75, 14.4, 4, 0, "#painting7"));

  // Initialize Chill Room Music
  chillRoomMusic = new ChillRoomMusic();

  // Initialize toiletObj
  toiletObj = new Toilet();

  // Sink Audio
  sinkAudio1 = new SinkAudio("#sinkAudio1");
  sinkAudio2 = new SinkAudio("#sinkAudio2");

  // Bathroom Doors
  let rotSpeed = 2.5;
  doors.push(new Door(-90, rotSpeed, document.querySelector("#bathroomDoor1")));
  doors.push(new Door(79, rotSpeed, document.querySelector("#bathroomDoor2")));

  // BathTub
  bathTub = new BathTub();

  /*
  // Select all data-raycastable objects
  data_raycastable = document.querySelectorAll("[data-raycastable]");
  */

  // initiate list of fishes in tank
  for(let i = 0; i < 10; i++){
    let x = Math.random() * (1.5) - 0.75; 
    let y = Math.random() * (1) - 0.5; // max: .5, min: -.5
    let z = Math.random() * (4) - 2;
    let scale = Math.random() * (0.07 - 0.02) + 0.02 ; // max 0.07, min 0.02
    
    fishes.push(new Fish(x, y, z, 0.05));
  }

  // add rocks to fish tank
  let fishTank = document.querySelector("#fishTank");
  let rockTypes = ["a-dodecahedron", "a-icosahedron"];
  let rockColors = ["#696f78", "#7c857b", "#ab9da1"];
  
  for(let i = 0; i < 400; i++){
    let rndInt = rnd(0, rockTypes.length - 1);
    let rock = document.createElement(rockTypes[rndInt]);
    let c;
    
    rndInt = rnd(0, rockColors.length);
    if(rndInt == rockColors.length){
      let rndColorValue = rnd(80, 200);
      c = `rgb(${rndColorValue}, ${rndColorValue}, ${rndColorValue})`;
    }else{
      c = rockColors[rndInt];
    }
    rock.setAttribute("color", c);
    
    let x = Math.random() * (1.3) - 0.65;
    let y = Math.random() * (-0.4 + .5) - 0.5;
    let z = Math.random() * (3.8) - 1.9;
    let s = Math.random() * (0.1 - 0.05) + 0.05; 
    
    rock.setAttribute("position", {x:x, y:y, z:z});
    rock.setAttribute("scale", {x:s, y:s, z:s});
    rock.setAttribute("rotation", {x:rnd(0, 360), y:rnd(0, 360), z:rnd(0,360)});
    
    fishTank.append(rock);
  }


  showerSlide = false;
  bathroomShowerWall = document.querySelector("#bathroomShowerWall");
  for(let part of bathroomShowerWall.children){
    part.setAttribute("data-raycastable", "");
    part.addEventListener("click", ()=>{
      if(showerSlide){
        showerSlide = false;
      }else{
        showerSlide = true;
      }
    });
  }

  for(let part of bathroomShowerWall.children[bathroomShowerWall.children.length - 1].children){
    part.setAttribute("data-raycastable", "");
    part.addEventListener("click", ()=>{
      if(showerSlide){
        showerSlide = false;
      }else{
        showerSlide = true;
      }
    });
  }
  
  bathroomShowerWall.dx = .2;
  
  loop();
  loop2();
  loop3();
}

function loop(){
    
  cameraX = camera.getAttribute("position").x;
  cameraZ = camera.getAttribute("position").z;
  bathroomSinksX = bathroomSinks.getAttribute("position").x;
  bathroomSinksZ = bathroomSinks.getAttribute("position").z;
  fridgeX = fridge.getAttribute("position").x;
  fridgeZ = fridge.getAttribute("position").z;
  toiletX = toilet.getAttribute("position").x;
  toiletZ = toilet.getAttribute("position").z;
  
  for(let wallLantern of wallLanterns){
    wallLantern.rotate();
  }

  // Universal stair light color change (Stair light variables declared in stairStep.js)
  for(let key in stairStepColors){ // for each stair step color, change color value
    color = stairStepColors[key];
    color.changeValue();
  }
  
  for(let stairStep of stairSteps){
    stairStep.changeColor();
  }

  for(let bubble of bathBubbles){
    bubble.float();
  }
  
  // If user is within a 5x5 rect of toilet
  if((cameraX >= toiletX - toiletRange) && (cameraX <= toiletX + toiletRange) && (cameraZ >= toiletZ - toiletRange) && (cameraZ <= toiletZ + toiletRange)){
    toiletCooldown = 15;
    if(toiletSeatRot < 90){
      toiletSeatRot += dtoiletSeatRot;
      document.querySelector("#toiletLid").setAttribute("rotation", {x:0, y:0, z:toiletSeatRot});
    }
  }else{
    toiletCooldown -= 1;
    if(toiletCooldown < 0 && toiletSeatRot >= 0){
      toiletSeatRot -= dtoiletSeatRot;
      document.querySelector("#toiletLid").setAttribute("rotation", {x:0, y:0, z:toiletSeatRot});
    }
  }

  // If user is directly in front of bathroomSink1
  bathroomSinksWater[0].setAttribute("height", bathroomSinksWater[0].y);
  bathroomSinksWater[0].setAttribute("position", {x:0.875, y:-0.2 + bathroomSinksWater[0].y/2, z:0});
  if((cameraX >= bathroomSinksX - 1.3) && (cameraX <= bathroomSinksX + 1.3) && (cameraZ >= bathroomSinksZ - 0.9) && (cameraZ <= bathroomSinksZ + 0.9)){
    sinkAudio1.playSound = true;
    if(bathroomSinksWater[0].y < 0.32){
      bathroomSinksWater[0].y += bathroomSinksWater[0].dy;
    }
  }else{
    sinkAudio1.playSound = false;
    if(bathroomSinksWater[0].y > 0){
      bathroomSinksWater[0].y -= bathroomSinksWater[0].dy;
    }
  }

  // If user is directly in front of bathroomSink2
  bathroomSinksWater[1].setAttribute("height", bathroomSinksWater[1].y);
  bathroomSinksWater[1].setAttribute("position", {x:0.875, y:-0.2 + bathroomSinksWater[1].y/2, z:0});
  if((cameraX >= bathroomSinksX - 1.3) && (cameraX <= bathroomSinksX + 1.3) && (cameraZ >= bathroomSinksZ - 0.9 + 2.2) && (cameraZ <= bathroomSinksZ + 0.9 + 2.2)){
    sinkAudio2.playSound = true;
    if(bathroomSinksWater[1].y < 0.32){
      bathroomSinksWater[1].y += bathroomSinksWater[1].dy;
      
    }
  }else{
    sinkAudio2.playSound = false;
    if(bathroomSinksWater[1].y > 0){
      bathroomSinksWater[1].y -= bathroomSinksWater[1].dy;
    }
  }

  // If user is directly in front of left fridge door
  fridgeDoors[0].setAttribute("rotation", {x:0, y:fridgeDoors[0].rot, z:0});
  if((cameraX >= fridgeX - 1.5/2 - 1.25) && (cameraX <= fridgeX + 1.5/2 - 1.25 + 0.3) && (cameraZ >= fridgeZ - 3/2 + 2) && (cameraZ <= fridgeZ + 3/2 + 2)){
    fridgeDoors[0].cooldown = 20;
    if(fridgeDoors[0].rot > -90){
      fridgeDoors[0].rot -= 2;
    }
  }else{
    fridgeDoors[0].cooldown -= 1;
    if(fridgeDoors[0].cooldown < 0 && fridgeDoors[0].rot < 0){
      fridgeDoors[0].rot += 2;
    }
  }

  // If user is directly in front of right fridge door
  fridgeDoors[1].setAttribute("rotation", {x:0, y:fridgeDoors[1].rot, z:0});
  if((cameraX >= fridgeX - 2.5/2 + 0.75 - 0.3) && (cameraX <= fridgeX + 2.5/2 + 0.75) && (cameraZ >= fridgeZ - 3/2 + 2) && (cameraZ <= fridgeZ + 3/2 + 2)){
    fridgeDoors[1].cooldown = 20;
    if(fridgeDoors[1].rot < 90){
      fridgeDoors[1].rot += 2;
    }
  }else{
    fridgeDoors[1].cooldown -= 1;
    if(fridgeDoors[1].cooldown < 0 && fridgeDoors[1].rot > 0){
      fridgeDoors[1].rot -= 2;
    }
  }

  // Universal painting frame color change (PFColors declared in painting.js)
  for(let key in PFColors){ // For each rgb in PFColors, change value
    color = PFColors[key];
    color.changeValue();
  }
  
  for(let painting of paintings){
    painting.changeColor();
  }

  // Update Chill Room Music Display / TV
  chillRoomMusic.update();

  // Update toilet flushing
  toiletObj.update();

  // Update sink audio
  sinkAudio1.playAudio();
  sinkAudio2.playAudio();

  // If doors are opened
  for(let door of doors){
    door.update();
  }

  // Drains bathTub
  bathTub.drainWater();
  bathTub.fillWater();

  // slides bathroom glass wall
  if(showerSlide){
    if(bathroomShowerWall.object3D.position.x > -3){
      bathroomShowerWall.object3D.position.x -= bathroomShowerWall.dx;
      if(bathroomShowerWall.object3D.position.x < -3){
        bathroomShowerWall.object3D.position.x = -3;
      }
    }
  }else{
    if(bathroomShowerWall.object3D.position.x < 0){
      bathroomShowerWall.object3D.position.x += bathroomShowerWall.dx;
      if(bathroomShowerWall.object3D.position.x > 0){
        bathroomShowerWall.object3D.position.x = 0;
      }
    }
  }
  
  setTimeout(loop, 30);
}


// Separate recursive loop to keep track of time
function loop2(){
  chillRoomMusic.updateTime();
  setTimeout(loop2, updateSongTime * 1000);
}

function loop3(){
  // Moves fishes in tank
  for(let fish of fishes){
    fish.move();
  }
  setTimeout(loop3, 100);
  }

// Returns distance between the user & the data-raycastable obj
function distance(target){
  return cursor.components.raycaster.getIntersection(target).distance;
}


// Display interactive msg on screen
function displayIntMsg(msg){
  document.querySelector("#interactTxt").setAttribute("value", msg);
  
  // After 5 seconds, text disappears
  setTimeout(()=>{
    document.querySelector("#interactTxt").setAttribute("value", "");
  }, 2000);
}