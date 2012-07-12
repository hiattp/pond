var GameMaster = require('../game_master')
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

module.exports = function(io){
  
  var numConnections = 0;
  var gameActive = false;
  var gameLoopInterval = 1000;
  var gameLoopTimeout;
  
  io.sockets.on('connection', function(socket){
    numConnections++;
    socket.on('user checkin', function(data){
      User.findById(data.userId, function(err,user){
        var newFish = {
          socketId : socket.id,
          fishDetails : user
        };
        GameMaster.addFish(newFish, function(){
          if(numConnections > 1){
            gameActive = true;
            gameLoop();
          }
        });
      });
    });
    
    io.sockets.emit("connections update", {total:numConnections});
    
    socket.on("disconnect", function(){
      numConnections--;
      if(numConnections < 1){
        clearTimeout(gameLoopTimeout);
        gameActive = false;
      }
      GameMaster.removeFish(socket.id);
    });
    
  });
  
  var gameLoop = function gameLoop(){
    io.sockets.emit("all objects", GameMaster.locationUpdate());
    if(gameActive) gameLoopTimeout = setTimeout(gameLoop, gameLoopInterval);
  }
  
}