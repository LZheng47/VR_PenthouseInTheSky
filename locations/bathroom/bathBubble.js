class BathBubble{
  constructor(){
    // Initial variables for bathBubble

    // (Originally) Random theta [140 deg, 420 deg] in radians
    // Original ellipse equation for vents: x^2 / (9*0.41) + y^2 / (5 * 0.41) = 1
    // r = sqrt( (cos^2(theta) / (0.41*9) + sin^2(theta) / (0.41*5))^-1 )
    // Equation below has been modified to fit the vents
    let theta1 = Math.random() * ((420 / 180 * Math.PI) - (140 / 180 * Math.PI)) + (215 / 180 * Math.PI);
    let R = ( 2* ((Math.cos(theta1))**2 / (0.41*16) + (Math.sin(theta1))**2 / (0.41*5))**(-1) )**(1/2);
    
    // x = Rcos(theta), z = Rsin(theta)
    // Spawn bubbles as random pt on circle, w/ center of circle being random pt on vent
    let r = 0.12;
    let theta2 = rnd(0, 360); // theta2 [0deg, 360deg]
        
    // for pos, refer back to variables above (R, theta1, r, theta2)
    this.x = R*Math.cos(theta1) + r*Math.cos(theta2);
    this.y = -0.59;
    this.z = R*Math.sin(theta1) + r*Math.sin(theta2);

    this.dy = Math.random() * (0.1 - 0.01) + 0.01;

    this.radius = (Math.random() * (0.07 - 0.02) + 0.02); // radius [0.02, 0.07]
    
    this.obj = document.createElement("a-sphere");
    this.obj.setAttribute("radius", this.radius);
    this.obj.setAttribute("position",{x:this.x, y:this.y, z:this.z});
    document.querySelector("#bathTub").append(this.obj);
  }

  float(){
    this.y += this.dy;
    this.obj.setAttribute("position",{x:this.x, y:this.y, z:this.z});

    if(this.y >= bubbleHeight - 0.5){
      let theta1 = Math.random() * ((420 / 180 * Math.PI) - (140 / 180 * Math.PI)) + (215 / 180 * Math.PI);
      let R = ( 2* ((Math.cos(theta1))**2 / (0.41*16) + (Math.sin(theta1))**2 / (0.41*5))**(-1) )**(1/2);
      
      // x = Rcos(theta), z = Rsin(theta)
      // Spawn bubbles as random pt on circle, w/ center of circle being random pt on vent
      let r = 0.12;
      let theta2 = rnd(0, 360); // theta2 [0deg, 360deg]
      
      // Randomize positions again
      this.x = R*Math.cos(theta1) + r*Math.cos(theta2);
      this.y = -1;
      this.z = R*Math.sin(theta1) + r*Math.sin(theta2);
      }
    
    
    if(waterHeight <= 0){
      this.obj.setAttribute("opacity", 0);
    }else{
      this.obj.setAttribute("opacity", 1);
    }
  }
}