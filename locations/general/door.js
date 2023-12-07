class Door{
  constructor(maxRot, rotSpeed, clone){
    this.obj = clone;
    this.open = false;
    this.roty = 0;
    this.maxRot = maxRot;
    if(this.maxRot > 0){
      this.droty = rotSpeed;
    }else{
      this.droty = -rotSpeed;
    }
    
    this.doorKnobs = this.obj.querySelectorAll(".doorKnob");

    for(let i = 0; i < 2; i++){
      let doorHandle = this.doorKnobs[i].querySelector("a-cylinder");
      doorHandle.setAttribute("data-raycastable", "");
      doorHandle.addEventListener("click", () =>{
        if(this.open){
          this.open = false;
        }else{
          this.open = true;
        }
      });
    }
  }
  update(){
    //console.log(this.roty);
    if(this.open){
      if(this.roty < this.maxRot && this.droty > 0){
        this.roty += this.droty;
        if(this.roty > this.maxRot){
          this.roty = this.maxRot;
        }
      }else if(this.roty > this.maxRot && this.droty < 0){
        this.roty += this.droty;
        if(this.roty < this.maxRot){
          this.roty = this.maxRot;
        }
      }
    }else{
      if(this.roty > 0 && this.droty > 0){
        this.roty -= this.droty;
        if(this.roty < 0){
          this.roty = 0;
        }
      }else if(this.roty < 0 && this.droty < 0){
        this.roty -= this.droty;
        if(this.roty > 0){
          this.roty = 0;
        }
      }
    }
    this.obj.setAttribute("rotation", {x:0, y:this.roty, z:0});
  }
}