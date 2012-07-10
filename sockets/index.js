var GameMaster = require('../game_master')
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

var numConnections = 0;

module.exports = function(io){
  
  io.sockets.on('connection', function(socket){
    numConnections++;
    socket.on('user checkin', function(data){
      User.findById(data.userId, function(err,user){
        var newFish = {
          socketId : socket.id,
          fishDetails : user
        };
        GameMaster.addFish(newFish, function(){
          socket.emit('checkin successful', GameMaster.allFish());
        });
      });
    });
    
    io.sockets.emit("connections update", {total:numConnections});
    
    socket.on("disconnect", function(){
      numConnections--;
      io.sockets.emit("connections update", {total:numConnections});
    });
    
  });
  
}