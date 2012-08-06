var socket, canvas, context;
var keysPressed = []
  , locationUpdates = []
  , animationOn = false;

$(document).ready(function(){
  // loadSprites();
  if(userId){
    
    socket = io.connect(socketURL); // socketURL definition in layout.ejs
    
    socket.on("connect", function(){
      socket.emit('user checkin', {userId : userId});
    });
    
    // socket.on("checkin successful", function(data){
    //   console.log("animate!");
    //   animate();
    // });

    socket.on("connections update", function(data){
      $("#connected-users").text(data.total);
    });

    socket.on("all objects", function(data){
      console.log("RECEIVED LOCATION UPDATE");
      if(!animationOn && locationUpdates.length == 2){
        animationOn = true;
        animate();
      }
      if(locationUpdates.length > 2){
        locationUpdates.pop();
        locationUpdates.unshift(data);
      } else locationUpdates.unshift(data);
      if(logsNum < 25){
        console.log(locationUpdates.map(function(u){return u.number}));
        if(locationUpdates.length >=2) console.log("time between: "+(locationUpdates[0].timestamp-locationUpdates[1].timestamp));
        logsNum++;
      }
    });
    
  }
  
  (function() {
      canvas = document.getElementById('pond-canvas')
      context = canvas.getContext('2d');

      // resize the canvas to fill browser window dynamically
      window.addEventListener('resize', resizeCanvas, false);
      
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // drawAll(); NEED TO PUT THIS BACK IN?
      }
      resizeCanvas();
  })();
  
});

$(document).keydown(function(event){
	var key = event.which
	  , available = keysPressed.indexOf(key) < 0
	  , contradicting = false;
	switch(key){
	  case 37:
	    if(keysPressed.indexOf(39) >= 0) contradicting = true;
	    break;
	  case 39:
	    if(keysPressed.indexOf(37) >= 0) contradicting = true;
	    break;
	  case 38:
	    if(keysPressed.indexOf(40) >= 0) contradicting = true;
	    break;
	  case 40:
	    if(keysPressed.indexOf(38) >= 0) contradicting = true;
	    break;
	}
	if(available && !contradicting){
	  keysPressed.push(key);
    // 'p' means 'press'
		sendInstruction(key,"p");
	}
});

$(document).keyup(function(event){
	var key = event.which;
	if((key == 37 || key == 38 || key == 39 || key == 40) && keysPressed.indexOf(key) >= 0){
		var indexOfKey = keysPressed.indexOf(key);
		if(indexOfKey != -1) keysPressed.splice(indexOfKey,1);
		// 'r' means 'release'
		sendInstruction(key,"r");
	}
});

function sendInstruction(keynum,action){
  var timestamp = Date.now();
	switch(keynum){
		case 37:
		  socket.emit("register command", {dir : 'l', act : action, at : timestamp});
			break;
		case 38:
		  socket.emit("register command", {dir : 'u', act : action, at : timestamp});
			break;
		case 39:
		  socket.emit("register command", {dir : 'r', act : action, at : timestamp});
			break;
		case 40:
		  socket.emit("register command", {dir : 'd', act : action, at : timestamp});
			break;
	}
}

window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame || 
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

// temporarily assume no potential for packet loss
// locationUpdates = []
var logsNum = 0
function animate(){
  var fishToDraw = [];
  var interpolationBuffer = 150;
  var targetTime = Date.now() - interpolationBuffer;
  // update
  var leadingIndex, laggingIndex;
  if(locationUpdates.length >= 2){
    for(i=1;i<locationUpdates.length;i++){
      if(locationUpdates[i].timestamp <= targetTime){
        leadingIndex = i-1;
        laggingIndex = i;
        break;
      }
    }
    var timeBetweenUpdates = locationUpdates[leadingIndex].timestamp - locationUpdates[laggingIndex].timestamp;
    var fractionBetween = (targetTime - locationUpdates[laggingIndex].timestamp) / timeBetweenUpdates;
    // if(logsNum < 25){
    //   console.log("lagging index: "+laggingIndex);
    //   console.log("leading index: "+leadingIndex);
    //   console.log("lag using: "+locationUpdates[laggingIndex].number);
    //   console.log("lead using: "+locationUpdates[leadingIndex].number);
    //   console.log("lag time: "+locationUpdates[laggingIndex].timestamp);
    //   console.log("target time: "+targetTime);      
    //   console.log("lead time: "+locationUpdates[leadingIndex].timestamp);      
    //   console.log("fraction: "+fractionBetween);
    //   // console.log(locationUpdates[laggingIndex].timestamp);
    //   logsNum++;
    // }
    Object.keys(locationUpdates[leadingIndex].fishUpdate).forEach(function(fid){
      var newFishData = locationUpdates[leadingIndex].fishUpdate[fid];
      var prevFishData = locationUpdates[laggingIndex].fishUpdate[fid];
      if(newFishData && prevFishData){
        fishToDraw.push({
          locX : (newFishData.locX - prevFishData.locX) * fractionBetween + prevFishData.locX,
          locY : (newFishData.locY - prevFishData.locY) * fractionBetween + prevFishData.locY,
          dir : newFishData.dir
        });
      }
    });
    // clear
    context.clearRect(0,0,canvas.width, canvas.height);
    // draw
    drawAll(fishToDraw);
    // request new frame
    requestAnimFrame(function(){
      animate();
    });
  } else animate();
};

function drawAll(allFish) {
  allFish.forEach(function(fish){
    drawFish(fish);
  });
  // drawFish('x')
}

var start = 0;
var sprites = {};
function drawFish(fish){
  context.beginPath();
  context.rect(fish.locX, fish.locY, 100, 50);
  context.fillStyle = '#EF7C00';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = 'black';
  context.stroke();
  context.beginPath();
  if(fish.dir == 0) context.rect(fish.locX, fish.locY, 15, 50);
  else context.rect(fish.locX+85, fish.locY, 15, 50);
  context.fillStyle = 'black';
  context.fill();
  // context.drawImage(sprites.test,fish.locX,fish.locY, 50, 50);
}

// function loadSprites(){
//  var loadedSprites = 0;
//  var numSprites = 0;
//  
//  var sources = {
//    test: "/images/sprite.png"
//  };
//  // get num of sources
//  for(var src in sources){
//    numSprites++;
//  }
//  for(var src in sources){
//    sprites[src] = new Image();
//    sprites[src].onload = function(){
//      if (++loadedSprites >= numSprites){
//        drawFish();
//      }
//    };
//    sprites[src].src = sources[src];
//  }
// }