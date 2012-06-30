$(document).ready(function(){
  
  io.connect(socketURL); // socketURL definition in layout.ejs
  
  socket.on("connections update", function(data){
    $("#connected-users").text(data.total);
  });
  
});