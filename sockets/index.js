var GameMaster = require('../game_master')
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

var numConnections = 0;

module.exports = function(io){
  
  io.sockets.on('connection', function(socket){
    numConnections++;

    console.dir(socket);
    
    socket.on('user checkin', function(data){
      console.log("new checkin with data:");
      console.dir(data);
    });
    
    io.sockets.emit("connections update", {total:numConnections});
    
    socket.on("disconnect", function(){
      numConnections--;
      io.sockets.emit("connections update", {total:numConnections});
    });
    
  });
  
}