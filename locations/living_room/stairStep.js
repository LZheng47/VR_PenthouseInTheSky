rnd = (l,u) => Math.floor(Math.random()*(u-l+1) + l);

class StairStepColor{
  constructor(){
    this.value = rnd(0, 255); 
    this.increase = (this.value < 255);
    this.dValue = rnd(1,2);
  }

  changeValue(){
    if(this.increase){
      this.value += this.dValue; // Increase color value
      if(this.value >= 255){ // When color value reaches 255
        this.value = 255;
        this.increase = false;
      }
    }else{
      this.value -= this.dValue; // Decrease color value
      if(this.value <= 0){ // When color value reaches 0
        this.value = 0;
        this.increase = true;
      }
    }
  }
}

// Global stair color
let stairStepColors = {"r": new StairStepColor(), "g": new StairStepColor(), "b": new StairStepColor()};


class StairStep{
  constructor(x,y,z,clone){
    this.x = x;
    this.y = y;
    this.z = z;

    // Takes in clone node and sets it as this.obj
    this.obj = clone;
    this.obj.setAttribute("position",{x:x,y:y,z:z});

    // Gets stairs via query selector
    let stairs = document.querySelector("#stairs");
    // Append each stair step into stairs
    stairs.append(this.obj);
  }
  
  changeColor(){
    // Get stairstep lights (stairStep children [1, 16])
    for(let i = 1; i < this.obj.children.length; i++){
      // Change color of each light
      this.obj.children[i].setAttribute("color", `rgb(${stairStepColors.r.value}, ${stairStepColors.g.value}, ${stairStepColors.b.value})`);
    }
  }
}