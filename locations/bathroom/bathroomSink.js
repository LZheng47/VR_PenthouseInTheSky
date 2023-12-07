// Implement afterwards, still in progress 
class BathroomSink{
  constructor(x,y,z,offSetZ,clone){
    this.x = x;
    this.y = y;
    this.z = z;
    
    // Initialize default dy (increase in water level)
    this.dy = 0.0025;

    // Takes in clone node and sets it as this.obj
    this.obj = clone;
    this.obj.setAttribute("position",{x:x,y:y,z:z});
  }
  
  sink(){
    // change y by dy (water height) & pos by y + dy/2 (water pos)
    this.y += this.dy;

    // If user is directly in front of bathroomSink1
    if((cameraX >= bathroomSinksX - 1.1) && (cameraX <= bathroomSinksX + 1.1) && (cameraZ >= bathroomSinksZ - 0.9 + offSetZ) && (cameraZ <= bathroomSinksZ + 0.9 + offSetZ)){
      if(this.y < 0.32){
        this.obj.y += this.obj.dy;
        this.obj.setAttribute("height", this.obj.y);
        this.obj.setAttribute("position", {x:0.875, y:-0.2 + this.obj.y/2, z:0});
      }
    }else{
      if(this.obj.y > 0){
        this.obj.y -= this.obj.dy;
        this.obj.setAttribute("height", this.obj.y);
        this.obj.setAttribute("position", {x:0.875, y:-0.2 - this.obj.y/2, z:0});
      }
    }
  }
}