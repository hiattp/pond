var Fish = module.exports = function Fish(name){
  this.name = name;
  this.locX = 500;
  this.locY = 300;
  this.dir = 0
  this.velX = 0;
  this.velY = 0;
  this.aLeft = [];
  this.aRight = [];
  this.aUp = [];
  this.aDown = [];
  this.lastUpdate = Date.now();
};

Fish.prototype.setLastUpdate = function setLastUpdate(t){
  this.lastUpdate = t;
}

Fish.prototype.updateLocationAndVelocity = function updateLocationAndVelocity(axis, stopTime){
  // This function takes arrays of timestamps representing starts and stops 
  // of acceleration being applied to the fish to get the resulting distance traveled.
  var self = this
    , proForce = axis == "x" ? self.aLeft : self.aUp
    , antiForce = axis == "x" ? self.aRight : self.aDown
    , currentVelocity = axis == "x" ? self.velX : self.velY
    , universalKeypressAcceleration = 10
    , universalFriction = 5
    , displacement = 0
    , beginTime = self.lastUpdate
    , deadtimeAtEnd;
  
  // account for situation where measurement is between key press and key release
  // what if it was at beginning ?  shouldn't if you add parter key press at end of this method.
  if(proForce.length % 2 == 1) proForce.unshift(stopTime);
  if(antiForce.length % 2 == 1) antiForce.unshift(stopTime);
  
  var proForceChunk, antiForceChunk;
  if(proForce.length > 0){
    // find any deadtime after acceleration chunk
    deadtimeAtEnd = stopTime - proForce[0];
    // grab first acceleration chunk
    proForceChunk = proForce.splice(proForce.length-2,2);
  } else deadtimeAtEnd = topTime - beginTime;
  
  if(antiForce.length > 0){
    if(stopTime - antiForce[0] < deadtimeAtEnd) deadtimeAtEnd = stopTime - antiForce[0];
    antiForceChunk = antiForce.splice(antiForce.length-2,2);
  }
  
  // calculate vel before any chunk or after duration without acceleration
  if(proForceChunk && currentVelocity != 0){
    if(currentVelocity) // this is going to be same from duration, reuse that.
  } // CONTINUE HERE

  // account for current vel going into it
  // assuming for now we are starting from rest
  while(proForceChunk.length > 0 || antiForceChunk.length > 0){
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
    if(currentVelocity > 0){
      currentVelocity += (-1*universalFriction)*(downtimeLength*downtimeLength) / 2 + currentVelocity*downtimeLength;
      if(currentVelocity < 0) currentVelocity = 0;
    } else if(currentVelocity < 0){
      currentVelocity += universalFriction*(downtimeLength*downtimeLength) / 2 + currentVelocity*downtimeLength;
      if(currentVelocity > 0) currentVelocity = 0;      
    } else currentVelocity= 0;
  }
  
  if(axis == "x") self.velX = currentVelocity;
  else self.velY = currentVelocity;
  
  return self;
};