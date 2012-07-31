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
	var key = event.which;
	if((key == 37 || key == 38 || key == 39 || key == 40 || key == 32) && keysPressed.indexOf(key) < 0){
		keysPressed.push(key);
		sendInstruction(key,"pressed");
	}
});

$(document).keyup(function(event){
	var key = event.which;
	if(key == 37 || key == 38 || key == 39 || key == 40 || key == 32){
		var indexOfKey = keysPressed.indexOf(key);
		if(indexOfKey != -1) keysPressed.splice(indexOfKey,1);
		sendInstruction(key,"released");
	}
});

function sendInstruction(keynum,action){
  var timestamp = Date.now();
	switch(keynum){
		case 37:
		  socket.emit(action, {dir : 'l', at : timestamp});
			break;
		case 38:
		  socket.emit(action, {dir : 'u', at : timestamp});
			break;
		case 39:
		  socket.emit(action, {dir : 'r', at : timestamp});
			break;
		case 40:
		  socket.emit(action, {dir : 'd', at : timestamp});
			break;
		case 32:
      // spacebar
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