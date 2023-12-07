class SinkAudio{
  constructor(sinkAudioID){
    this.obj = document.querySelector(sinkAudioID);
    this.playSound = false;
    this.preload = 80;
    this.currOn = false;
    
    this.obj.addEventListener("sound-ended", ()=>{
      this.currOn = false;
    });
  }
  playAudio(){
    this.preload -= 1;
    if(this.preload < 0){
      if(this.playSound){
        if(this.currOn == false){
          this.currOn = true;
          this.obj.components.sound.playSound();
        }
      }else{
        this.obj.components.sound.stopSound();
        this.currOn = false;
        // console.log("stop");
      }
    }
  }
}