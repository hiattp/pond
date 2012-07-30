var GameMaster = require('../game_master')
  , gameMaster = new GameMaster
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

module.exports = function(io){
  
  var numConnections = 0
    , gameActive = false
    , gameLoopInterval = 1000
    , gameLoopTimeout;
  
  var gameLoop = function gameLoop(){
    io.sockets.emit("all objects", gameMaster.locationUpdate());
    console.dir(gameMaster.locationUpdate());
    if(gameActive) gameLoopTimeout = setTimeout(gameLoop, gameLoopInterval);
  }
  
  io.sockets.on('connection', function(socket){
    numConnections++;
    socket.on('user checkin', function(data){
      User.findById(data.userId, function(err,user){
        var newFish = {
          socketId : socket.id,
          fishDetails : user
        };
        gameMaster.addFish(newFish, function(){
          if(numConnections > 0){
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
      gameMaster.removeFish(socket.id);
    });
    
  });
    
}