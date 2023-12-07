class Toilet{
  constructor(){
    this.obj = document.querySelector("#toilet");
    this.handle = document.querySelector("#toiletHandle");
    this.water = document.querySelector("#toiletWater");
    this.maxWaterY = document.querySelector("#toiletWater").getAttribute("height");
    this.waterY = document.querySelector("#toiletWater").getAttribute("height");
    this.flushAudio = document.querySelector("#toiletFlushAudio");
    
    this.waterDY = 0.015;
    this.flush = false;
    this.flushCooldown = 0;
    
    this.handle.addEventListener("click", ()=>{
      if(this.flush == false && this.flushCooldown == 0){
        this.flush = true;
        this.flushCooldown = 40;
        this.flushAudio.components.sound.stopSound();
        this.flushAudio.components.sound.playSound();
      }
    });
    
  }
  
  update(){
    if(this.flush){
      if(this.flushCooldown > 0){
        this.flushCooldown -= 1;
      }else{
        this.flush = false;
      }
      
      if(this.flushCooldown > 15){
        this.waterY -= this.waterDY;
        if(this.waterY < 0.05){
          this.waterY = 0.05;
        }
      }
    }else{
      this.waterY += this.waterDY;
      if(this.waterY > this.maxWaterY){
        this.waterY = this.maxWaterY;
      }
    }
    this.water.setAttribute("height", this.waterY);
    // console.log(`Flush: ${this.flush}, CD: ${this.flushCooldown}, Water Level ${this.waterY}`);
    
  }
}