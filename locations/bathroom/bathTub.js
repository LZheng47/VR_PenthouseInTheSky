// y-value where bubbles will pop; bubbleHeight * 2 is height of water
let bubbleHeight = 0.625;
let waterHeight;
let smallestBubbleHeight = -bubbleHeight;

class BathTub{
  constructor(){
    this.water = document.querySelector("#bathtubWater");
    this.drainObj = document.querySelector("#bathtubDrain");
    this.drain = false;
    this.fill = false;
    this.maxBubbleHeight = bubbleHeight;
    this.bubbleHeight = bubbleHeight;
    this.waterHeight = bubbleHeight * 2;
    this.dy = 0.005;
    this.dy2 = 0.007;
    this.knob1 = document.querySelector("#bathtubKnob1");
    this.knob2 = document.querySelector("#bathtubKnob2");

    // If user clicks on drain
    this.drainObj.addEventListener("click", ()=>{
      if(this.drain){
        console.log("drain off!");
        this.drain = false;
      }else{
        this.drain = true;
        console.log("drain on!");
      }
    });

    // If user clicks on faucet knobs
    this.knob1.addEventListener("click", ()=>{
      if(this.fill){
        this.fill = false;
        console.log("fill off!");
      }else{
        this.fill = true;
        console.log("fill on!");
      }
    });

    this.knob2.addEventListener("click", ()=>{
      if(this.fill){
        this.fill = false;
        console.log("fill off!");
      }else{
        this.fill = true;
        console.log("fill on!");
      }
    });
    
    
  }
  
  drainWater(){
    if(this.drain){
      this.bubbleHeight -= this.dy;
      if(this.bubbleHeight < -this.maxBubbleHeight){
        this.bubbleHeight = -this.maxBubbleHeight;
      }
      if(this.waterHeight > 0){
        this.waterHeight = this.bubbleHeight * 2;
      }
      if(this.waterHeight < 0){
        this.waterHeight = 0;
      }
      bubbleHeight = this.bubbleHeight;
      // console.log(bubbleHeight);
      this.water.setAttribute("height", this.waterHeight);
      waterHeight = this.waterHeight;
      
      let newWaterPos = -(this.maxBubbleHeight*2 - this.waterHeight) / 2;
      this.water.setAttribute("position", {x:0, y:newWaterPos, z:0});
    }
  }

  
  fillWater(){
    if(this.fill){
      this.bubbleHeight += this.dy2; // bathtub fills up with water faster than water is drained
      this.waterHeight = this.bubbleHeight * 2;
      
      if(this.bubbleHeight > this.maxBubbleHeight){
        this.bubbleHeight = this.maxBubbleHeight;
      }
      if(this.waterHeight > this.maxBubbleHeight * 2){
        this.waterHeight = this.maxBubbleHeight * 2;
      }
      bubbleHeight = this.bubbleHeight;
      this.water.setAttribute("height", this.waterHeight);
      waterHeight = this.waterHeight;
      
      let newWaterPos = -(this.maxBubbleHeight*2 - this.waterHeight) / 2;
      this.water.setAttribute("position", {x:0, y:newWaterPos, z:0});
    }
  }
  
}