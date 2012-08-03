var socket, canvas, context;
var allFish = {}
  , keysPressed = [];

$(document).ready(function(){
  
  if(userId){
    
    socket = io.connect(socketURL); // socketURL definition in layout.ejs
    
    socket.on("connect", function(){
      socket.emit('user checkin', {userId : userId});
    });
    
    socket.on("checkin successful", function(data){
      console.log(data);
    });

    socket.on("connections update", function(data){
      $("#connected-users").text(data.total);
    });

    socket.on("all objects", function(data){
      allFish = data;
      drawAll();
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
        drawAll();
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

function drawAll() {
  for(fish in allFish){
    drawFish(allFish[fish]);
  }
}

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
}