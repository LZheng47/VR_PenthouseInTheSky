class PFColor{
  constructor(){
    this.dvalue = rnd(1,2);
    this.space = rnd(15, 18);
    // console.log(this.space);
    this.value = rnd(this.dvalue * this.space*4, 255);
    this.consecutive = [];
    this.dConsecutive = [];
    for(let i = 0; i < 4; i++){
      this.dConsecutive.push(this.dvalue);
      this.consecutive.push(this.value - (this.space * i * this.dvalue));
    }
  }
  
  changeValue(){
    for(let i = 0; i < 4; i++){
      this.consecutive[i] += this.dConsecutive[i];
      if(this.consecutive[i] >= 255){
        this.consecutive[i] = 255;
        this.dConsecutive[i] = -this.dConsecutive[i];
      }else if(this.consecutive[i] <= 0){
        this.consecutive[i] = 0;
        this.dConsecutive[i] = -this.dConsecutive[i];
      }
      // console.log(`Frame #: ${i}, Value ${this.consecutive[i]}, dValue: ${this.dConsecutive[i]}`);
    }
  }
}

PFColors = {"r":new PFColor(), "g":new PFColor(), "b":new PFColor()};



class Painting{
  constructor(x,y,z,width,height,yrot,paintingID){
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;

    this.obj = document.createElement("a-entity");

    // Painting Frame
    this.frames = [];
    for(let i = 0; i < 4; i++){
      this.frames[i] = document.createElement("a-box");
      this.frames[i].setAttribute("width", 0.1);
      this.frames[i].setAttribute("depth", 0.25);
      this.frames[i].setAttribute("color", "black");
      this.frames[i].setAttribute("opacity", 0.9);
      this.obj.append(this.frames[i]);
    }

    // Left & Right Frame Parts
    for(let i = 0; i < 2; i++){
      this.frames[i].setAttribute("height", this.height);
    }
    this.frames[0].setAttribute("position", {x:this.width/2, y:0, z:0});
    this.frames[1].setAttribute("position", {x:-this.width/2, y:0, z:0});

    // Top & Bottom Frame Parts
    for(let i = 2; i < 4; i++){
      this.frames[i].setAttribute("rotation", {x:0, y:0, z:90});
      this.frames[i].setAttribute("height", this.width);
    }
    this.frames[2].setAttribute("position", {x:0, y:this.height/2, z:0});
    this.frames[3].setAttribute("position", {x:0, y:-this.height/2, z:0});

    // Painting / image itself
    this.canvas = document.createElement("a-box");
    this.canvas.setAttribute("height", this.height);
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("depth", 0.2);
    this.canvas.setAttribute("src", paintingID);
    this.obj.append(this.canvas);

    // Rotate & set pos of entire painting
    this.obj.setAttribute("rotation", {x:0, y:yrot, z:0});
    this.obj.setAttribute("position", {x:this.x, y:this.y, z:this.z});

    // Reorder frames in this.frames for purpose of color change happening in clockwise pattern
    let tempFrames = [this.frames[0], this.frames[3], this.frames[1], this.frames[2]];
    this.frames = tempFrames;
    scene.append(this.obj);
  }

  changeColor(){
    for(let i = 0; i < 4; i++){
      this.frames[i].setAttribute("color", `rgb(${PFColors.r.consecutive[i]}, ${PFColors.g.consecutive[i]}, ${PFColors.b.consecutive[i]})`);
    }
  }
}


// Universal Colors
/*
PF_dColors = {"r":rnd(1,3), "g":rnd(1,3), "b":rnd(1,3)};
PF_Colors = {};
for(let color in PF_dColors){
  PF_Colors[color] = rnd(PF_dColors[color] * 4, 255 - PF_dColors[color] * 4);
  console.log(PF_Colors[color]);
}
*/