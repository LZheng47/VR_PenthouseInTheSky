class WallLantern{
  constructor(x,y,z,clone){
    this.x = x;
    this.y = y;
    this.z = z;
    
    // Initialize default rotation states from 0 to 360 deg
    this.rotx = rnd(0, 360);
    this.roty = rnd(0, 360);
    this.rotz = rnd(0, 360);

    // Randomizes change in rotation for x, y, z from -2 to 2
    this.drotx = Math.random() * (4) - 2; 
    this.droty = Math.random() * (4) - 2;
    this.drotz = Math.random() * (4) - 2;

    // Takes in clone node and sets it as this.obj
    this.obj = clone;
    this.obj.setAttribute("position",{x:x,y:y,z:z});
    scene.append(this.obj);
  }
  
  rotate(){
    // change rot_ by drot_
    this.rotx += this.drotx;
    this.roty += this.droty;
    this.rotz += this.drotz;

    // Selects torus knot (lastElementChild)
    let lightbulb = this.obj.lastElementChild;
    lightbulb.setAttribute("rotation",{x:this.rotx,y:this.roty,z:this.rotz});
  }
}