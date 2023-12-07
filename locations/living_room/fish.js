let maxTankX = 0.6; // -0.15
let maxTankY = 0.45;
let maxTankZ = 1.85;

let fishDMax = .05;
let fishDMin = .005;

class Fish{
  constructor(x,y,z,scale){
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = Math.random() * (fishDMax - fishDMin) + fishDMin;
    this.dy = Math.random() * (fishDMax - fishDMin) + fishDMin;
    this.dz = Math.random() * (fishDMax - fishDMin) + fishDMin;
    this.angle = 0;
    this.dAngle = 0;
    this.nextMoveCD = rnd(10, 75);

    // Randomize direction
    for(let d_ of [this.dx, this.dy, this.dz]){
      if(rnd(0,1) == 0){
        d_ = -d_;
      }
    }
    
    this.obj = document.createElement("a-sphere");
    this.model = document.createElement("a-gltf-model");

    this.model.setAttribute("src", "#fish");
    this.model.setAttribute("animation-mixer", "");
    
    this.obj.setAttribute("radius", 0.01);
    this.obj.setAttribute("opacity" , 1);
    this.obj.setAttribute("position", {x:this.x, y:this.y, z:this.z});

    // Set initial angle/rot
    if(this.dz > 0){
      this.angle = Math.atan(this.dx / this.dz) * 180 / Math.PI + 180;
    }else{
      this.angle = (Math.atan(this.dx / this.dz) * 180 / Math.PI);
    }
    this.obj.setAttribute("angle", {x:0, y:this.angle, z:0});

    this.model.setAttribute("scale", {x:scale, y:scale, z:scale});
    
    this.obj.append(this.model);
    document.querySelector("#fishTank").append(this.obj);
  }
  
  move(){
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;

    if(this.x > maxTankX){
      this.dx = - (Math.random() * (fishDMax - fishDMin) + fishDMin);
      this.x = maxTankX;
      this.calcNewAngle();
    }else if(this.x < -maxTankX){
      this.dx = Math.random() * (fishDMax - fishDMin) + fishDMin;
      this.x = -maxTankX;
      this.calcNewAngle();
    }

    if(this.y > maxTankY){
      this.dy = - (Math.random() * (fishDMax - fishDMin) + fishDMin);
    }else if(this.y < -maxTankY){
      this.dy = Math.random() * (fishDMax - fishDMin) + fishDMin;
    }

    if(this.z > maxTankZ){
      this.dz = - (Math.random() * (fishDMax - fishDMin) + fishDMin);
      this.z = maxTankZ;
      this.calcNewAngle();
    }else if(this.z < -maxTankZ){
      this.dz = Math.random() * (fishDMax - fishDMin) + fishDMin;
      this.z = -maxTankZ;
      this.calcNewAngle();
    }
    this.obj.setAttribute("position", {x:this.x, y:this.y, z:this.z});
    

    if(this.angleRotCount > 0){
      this.angleRotCount -= 1;
      this.model.object3D.rotation.y += this.dAngle;
    }

    this.nextMoveCD -= 1;
    // console.log(this.nextMoveCD);
    if(this.nextMoveCD <= 0){
      // console.log("NEW MOVE!");
      this.dx = Math.random() * (fishDMax - fishDMin) + fishDMin;
      this.dy = Math.random() * (fishDMax - fishDMin) + fishDMin;
      this.dz = Math.random() * (fishDMax - fishDMin) + fishDMin;
      
      // Randomize direction
      for(let d_ of [this.dx, this.dy, this.dz]){
        if(rnd(0,1) == 0){
          d_ = -d_;
        }
      }
      
      this.calcNewAngle();
    }
  }

  calcNewAngle(){
    this.nextMoveCD = rnd(10, 75);
    // NOTE: .object3D.rotation is in RADIANS
    // .setAttribute("rotation", ...) is in DEGREES
    if(this.dz > 0){
      this.angle = Math.atan(this.dx / this.dz) * 180 / Math.PI + 180;
    }else{
      this.angle = (Math.atan(this.dx / this.dz) * 180 / Math.PI);
    }
    
    this.angleRotCount = rnd(5,7);

    this.dAngle = (this.angle * (Math.PI / 180) - this.model.object3D.rotation.y) / this.angleRotCount; // IN RADIANS
    // console.log(`Desired Angle: ${this.angle}, Curr Angle: ${this.model.object3D.rotation.y}, dAngle ${this.dAngle}`);
  }

}