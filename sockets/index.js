var numConnections = 0;

module.exports = function(io){
  
  io.sockets.on('connection', function(socket){
    
    numConnections++;
    
    io.sockets.emit("connections update", {total:numConnections});
    
    socket.on("disconnect", function(){
      numConnections--;
      io.sockets.emit("connections update", {total:numConnections});
    });
    
  });
  
}