class ChillRoomMusic{
  constructor(){
    this.play = false;
    this.shuffle = false;
    this.loop = false;
    
    // Array of JSON's with ID, URL (to mp3), name, img of songs
    this.songs = [{"ID":0, "URL":"#NDHsong", "name":"Nekozilla", "author":"Different Heaven", "img":"#NDHimg", "time":"2:45"},
                  {"ID":1, "URL":"#OAOCsong", "name":"On & On", "author":"Cartoon, Daniel Levi", "img":"#OAOCimg", "time":"3:27"},
                  {"ID":2, "URL":"#song2", "name":"Back One Day", "author":"NEFFEX x TheFatRat", "img":"#song2img", "time":"3:51"},
                  {"ID":3, "URL":"#song3", "name":"Murderer", "author":"NCARBIN, hayve, Emily Makis", "img":"#song3img", "time":"3:21"}];
                    
    this.volume = 1;
    this.maxVolume = 5;
    this.mute = false;
    this.songID = 0;
    this.time = 0;
    this.countTime = false;
    this.cooldown = 0;
    
    // Objects / Elements in a-scene
    this.obj = document.querySelector("#chillRoomMusic");
    this.musicImg = document.querySelector("#musicImg");
    this.pausePlayButton = document.querySelector("#pauseplay");
    this.skipFront = document.querySelector("#skipFront");
    this.skipFrontOutline = document.querySelector("#skipFrontOutline");
    this.skipBack = document.querySelector("#skipBack");
    this.skipBackOutline = document.querySelector("#skipBackOutline");
    this.loopButton = document.querySelector("#loopButton");
    this.loopButtonOutline = document.querySelector("#loopButtonOutline");
    this.shuffleButton = document.querySelector("#shuffleButton");
    this.shuffleButtonOutline = document.querySelector("#shuffleButtonOutline");
    this.songTitleTxt = document.querySelector("#songTitleTxt");
    this.songTimeBar = document.querySelector("#songTimeBar");
    this.timeTxt = document.querySelector("#songTimeBar");
    this.volumeButton = document.querySelector("#volumeButton");
    this.volumeBar = document.querySelector("#volumeBar");
    this.highlightedVolumeBar = document.querySelector("#highlightedVolumeBar");
    
    
    // ** Controls
    // Mute
    this.volumeButton.addEventListener("click", ()=>{
      if(distance(this.volumeButton) < distanceClickable){
        if(this.mute){
          this.mute = false;
          this.volumeButton.setAttribute("src", "#volumeOn");
        }else{
          this.mute = true;
          this.volumeButton.setAttribute("src", "#volumeOff");
        }
        this.updateVolume();
      }else{
        displayIntMsg("You're too far away!");
      }
    });

    // Change Volume
    this.volumeBar.addEventListener("click", ()=>{
      if(distance(this.volumeBar) < distanceClickable){
        let intersection = cursor.components.raycaster.getIntersection(this.volumeBar).point;
        let volumeBarPos = this.volumeBar.object3D.getWorldPosition(originPos);
        // console.log(intersection);
        // console.log(volumeBarPos);
        let volumeBarLength = parseFloat(this.volumeBar.getAttribute("height")) / 2 - (parseFloat(volumeBarPos.y) - parseFloat(intersection.y));
        // console.log(volumeBarLength);
        this.highlightedVolumeBar.setAttribute("height", volumeBarLength);
        this.highlightedVolumeBar.setAttribute("position", {x:0, y:-(parseFloat(this.volumeBar.getAttribute("height")) - volumeBarLength) / 2, z:0});
  
        let volumeBarScale = this.maxVolume / parseFloat(this.volumeBar.getAttribute("height"));
        this.volume = volumeBarLength * volumeBarScale;
        console.log(this.volume);
  
        this.updateVolume();
      }else{
        displayIntMsg("You're too far away!");
      }
    });
    
    // Pause / Play Button
    this.pausePlayButton.addEventListener("click", ()=>{
      if(distance(this.pausePlayButton) < distanceClickable){
        if(this.play){
          this.play = false;
          this.pausePlayButton.setAttribute("src", "#play");
          this.obj.components.sound.pauseSound();
          this.countTime = false;
        }else{
          this.playSong();
        }
      }else{
        displayIntMsg("You're too far away!");
      }
    });

    // Skip Fwd/Front
    this.skipFront.addEventListener("click", ()=>{
      if(distance(this.skipFront) < distanceClickable){
        if(this.cooldown == 0){
          this.time = 0;
          this.cooldown = 30;
          this.obj.components.sound.stopSound();
    
          if(!this.loop){
            if(this.shuffle){
              this.songID = rnd(0, this.songs.length - 1);
            }else{
              this.songID++;
              if(this.songID > this.songs.length - 1){
                this.songID = 0;
              }
            }
          }
        }
        
        this.obj.setAttribute("src", this.songs[this.songID].URL);
        this.musicImg.setAttribute("src", this.songs[this.songID].img);
        this.playSong();
      }else{
        displayIntMsg("You're too far away!");
      }
    });

    /*
    this.skipFrontOutline.addEventListener("mousedown", ()=>{
      this.skipFrontOutline.setAttribute("color", "rgb(7, 222, 172)");
    });*/

    // Skip Back
    this.skipBack.addEventListener("click", ()=>{
      if(distance(this.skipBack) < distanceClickable){
        if(this.cooldown == 0){
          this.time = 0;
          this.cooldown = 30;
          this.obj.components.sound.stopSound();
    
          if(!this.loop){
            if(this.shuffle){
              this.songID = rnd(0, this.songs.length - 1);
              // console.log(this.songID);
            }else{
              this.songID -= 1;
              if(this.songID < 0){
                this.songID = this.songs.length - 1;
              }
            }
          }
    
          
          this.obj.setAttribute("src", this.songs[this.songID].URL);
          this.musicImg.setAttribute("src", this.songs[this.songID].img);
          this.playSong();
        }
      }else{
        displayIntMsg("You're too far away!");
      }
    });

    // Repeat / Loop
    this.loopButton.addEventListener("click", ()=>{
      if(distance(this.loopButton) < distanceClickable){
        if(this.loop){
          this.loop = false;
          this.loopButtonOutline.setAttribute("color", "black");
          // console.log("loop off!");
        }else{
          this.loop = true;
          this.loopButtonOutline.setAttribute("color", "rgb(7, 222, 172)");
          // console.log("loop on!");
        }
      }else{
        displayIntMsg("You're too far away!");
      }
    });

    // Shuffle / Randomize
    this.shuffleButton.addEventListener("click", ()=>{
      if(distance(this.shuffleButton) < distanceClickable){
        if(this.shuffle){
          this.shuffle = false;
          this.shuffleButtonOutline.setAttribute("color", "black");
        }else{
          this.shuffle = true;
          this.shuffleButtonOutline.setAttribute("color", "rgb(7, 222, 172)");
        }
      }else{
        displayIntMsg("You're too far away!");
      }
    });
    
    // Once song loads / starts
    this.obj.addEventListener("sound-loaded", ()=>{
      this.time = 0;
    });
                              
    // Once song ends
    this.obj.addEventListener("sound-ended", ()=>{
      this.time = 0;
      this.obj.components.sound.stopSound();
      
      if(!this.loop){
        if(this.shuffle){
          this.songID = rnd(0, this.songs.length - 1);
          console.log(this.songID);
        }else{
          this.songID++;
          if(this.songID > this.songs.length - 1){
            this.songID = 0;
          }
        }
        this.obj.setAttribute("src", this.songs[this.songID].URL);
        this.musicImg.setAttribute("src", this.songs[this.songID].img);
      }

      this.playSong();
    });
  }

  playSong(){
    this.updateVolume();
    this.songTitleTxt.setAttribute("value", `${this.songs[this.songID].author} - ${this.songs[this.songID].name}`);
    this.obj.setAttribute("autoplay", true);
    this.play = true;
    this.pausePlayButton.setAttribute("src", "#pause");
    this.obj.components.sound.playSound();
    this.countTime = true;
  }

  updateTime(){
    // Updates Time of Song
    if(this.countTime){
      this.time += updateSongTime;
    }
  }

  updateVolume(){
    // Mutes song if user presses mute
    if(this.mute){
      this.obj.setAttribute("volume", 0);
    }else{
      this.obj.setAttribute("volume", this.volume);
    }
  }
  
  update(){
    // Updates Time Bar
    let originalBar = this.songTimeBar.querySelectorAll("a-box")[0];
    let highlightBar = this.songTimeBar.querySelectorAll("a-box")[1];
    let songLength = this.songs[this.songID].time.split(":"); // [min, sec]
    let scale = this.time / (parseFloat(songLength[0])*60 + parseFloat(songLength[1]));
    let newLength = parseFloat(originalBar.getAttribute("width")) * scale;
    // New Length (to scale with current song time out of total song time)
    highlightBar.setAttribute("width", newLength);
    // New Position (Dependent on current width of highlightBar)
    highlightBar.setAttribute("position", {x:-newLength/2 + parseFloat(originalBar.getAttribute("width"))/2, y:0, z:0});

    let sec = Math.floor(this.time - Math.floor(this.time/60) * 60).toString();
    if(sec.length == 1){
      sec = "0" + sec;
    }
    
    this.timeTxt.querySelectorAll("a-text")[0].setAttribute("value", `${Math.floor(this.time / 60)}:${sec}`);
    this.timeTxt.querySelectorAll("a-text")[1].setAttribute("value", this.songs[this.songID].time);
    // console.log("seconds:" + Math.floor(this.time));
    if(this.cooldown > 0){
      this.cooldown -= 1;
    }
  }
}