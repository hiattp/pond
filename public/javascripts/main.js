var socket;

$(document).ready(function(){
  
  if(userId){
    socket = io.connect(socketURL); // socketURL definition in layout.ejs
    socket.on("connect", function(){
      socket.emit('user checkin', {userId : userId});
    });
  }
  
  socket.on("checkin successful", function(data){
    console.log(data);
  });

  socket.on("connections update", function(data){
    $("#connected-users").text(data.total);
  });
  
  socket.on("all objects", function(data){
    console.log(data);
  });
  
});