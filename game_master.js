var fishList = {};

var GameMaster = module.exports = function GameMaster(){
  this.fishList = {};
  this.locationArray = [];
};

GameMaster.prototype.addFish = function addFish(newFish,callback){
  var fishDetails = {
    name : newFish.name,
    locX : 500,
    locY : 300,
    dir : 0,
    velX: 0,
    velY: 0,
    aLeft : [],
    aRight : [],
    aUp : [],
    aDown : []
  };
  this.fishList[newFish.socketId] = fishDetails;
  callback();
};

GameMaster.prototype.removeFish = function removeFish(socketId){
  delete this.fishList[socketId];
};

GameMaster.prototype.allFish = function allFish(){
  return this.fishList;
}

GameMaster.prototype.locationUpdate = function locationUpdate(){
  var fishUpdate = [];
  for(fishId in this.fishList){
    var fish = this.fishList[fishId]
      , timeNow = Date.now()
      , locationX = calculateDistance(fish.aLeft, fish.aRight, fish.velX, timeNow);
      , locationY = calcaulateDistance(fish.aUp, fish.aDown, fish.velY, timeNow);
  }
  return this.fishList;
};

GameMaster.prototype.registerCommand = function registerCommand(socketId,c){
  var fish = this.fishList[socketId];
  switch(c.dir){
    case "l":
      // check for missed command
      if(c.act == "p" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.at - 1); // missed key release on same direction
      if(c.act == "r" && fish.aLeft.length % 2 == 0) fish.aLeft.unshift(c.at - 200); // missed key press on same direction
      if(c.act == "p" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.at - 1); // missed key release on opposing direction
      if(c.act == "r" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.at - 1); // missed release on opposing dir & press on same
      else fish.aLeft.unshift(c.at);
      break;
    case "r":
      if(c.act == "p" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.at - 1);
      if(c.act == "r" && fish.aRight.length % 2 == 0) fish.aRight.unshift(c.at - 200);
      if(c.act == "p" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.at - 1);
      if(c.act == "r" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.at - 1);
      else fish.aRight.unshift(c.at);
      break;
    case "u":
      if(c.act == "p" && fish.aUp.length % 2 == 1) fish.aUp.unshift(c.at - 1);
      if(c.act == "r" && fish.aUp.length % 2 == 0) fish.aUp.unshift(c.at - 200);
      if(c.act == "p" && fish.aDown.length % 2 == 1) fish.aDown.unshift(c.at - 1);
      if(c.act == "r" && fish.aDown.length % 2 == 1) fish.aDown.unshift(c.at - 1);
      else fish.aUp.unshift(c.at);
      break;
    case "d":
      if(c.act == "p" && fish.aDown.length % 2 == 1) fish.aDown.unshift(c.at - 1);
      if(c.act == "r" && fish.aDown.length % 2 == 0) fish.aDown.unshift(c.at - 200);
      if(c.act == "p" && fish.aUp.length % 2 == 1) fish.aUp.unshift(c.at - 1);
      if(c.act == "r" && fish.aUp.length % 2 == 1) fish.aUp.unshift(c.at - 1);
      else fish.aDown.unshift(c.at);
      break;
  }
};

// HELPER FUNCTIONS

function calculateDistance(proForce, antiForce, currentVelocity, stopTime){
  // This function takes arrays of timestamps representing starts and stops 
  // of acceleration being applied to the fish to get the resulting distance traveled.
  var universalKeypressAcceleration = 10;
  var universalFriction = 5;
  var displacement = 0;
  if(proForce.length % 2 == 1) proForce.unshift(stopTime);
  if(antiForce.length % 2 == 1) antiForce.unshift(stopTime);
  var proForceChunk = proForce.length > 0 ? proForce.splice(proForce.length-2,2) : false;
  var antiForceChunk = antiForce.length > 0 ? antiForce.splice(antiForce.length-2,2) : false;
  // account for current vel going into it
  // assuming for now we are starting from rest
  while(proForceChunk || antiForceChunk){
    if(proForceChunk && (!antiForceChunk || proForceChunk[1] < antiForceChunk[1])){
      var duration = proForceChunk[0] - proForceChunk[1];
      displacement += universalKeypressAcceleration*(duration*duration) / 2 + currentVelocity*duration;
      currentVelocity += duration*universalKeypressAcceleration;
      var chunkEnd = proForceChunk[0];
      proForceChunk = proForce.length > 0 ? proForce.splice(proForce.length-2,2) : false;
      if(proForceChunk || antiForceChunk) downtime(chunkEnd);
    } else if(antiForceChunk) {
      var duration = antiForceChunk[0] - antiForceChunk[1];
      displacement += (-1*universalKeypressAcceleration)*(duration*duration) / 2 + currentVelocity*duration;
      currentVelocity += (-1*universalKeypressAcceleration)*duration;
      var chunkEnd = antiForceChunk[0];
      antiForceChunk = antiForce.length > 0 ? antiForce.splice(antiForce.length-2,2) : false;
      if(proForceChunk || antiForceChunk) downtime(chunkEnd);
    }
  }
  //what if they haven't given a command in a while?
  function downtime(formerChunkEnd){
    var nextChunkBegin;
    if(!antiForceChunk) nextChunkBegin = proForceChunk[1];
    else if(!proForceChunk) nextChunkBegin = antiForceChunk[1];
    else if(proForceChunk[1] < antiForceChunk[1]) nextChunkBegin = proForceChunk[1];
    else nextChunkBegin = antiForceChunk[1];
    var downtimeLength = nextChunkBegin - formerChunkEnd;
    // continue here.  need to determin v at beginning of next chunk
  }
};