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
    , proForce = axis == "x" ? self.aRight : self.aUp
    , antiForce = axis == "x" ? self.aLeft : self.aDown
    , currentVelocity = axis == "x" ? self.velX : self.velY
    , universalKeypressAcceleration = 10.0
    , universalFriction = 8.0
    , universalMaxSpeed = 10.0
    , displacement = 0
    , startTime = self.lastUpdate
    , interCommandCorrectionPro = false
    , interCommandCorrectionAnti = false
    , deadtimeAtEnd = deadtimeAtBeginning = stopTime - startTime;
  
  // account for situation where measurement is between key press and key release
  if(proForce.length % 2 == 1){
    proForce.unshift(stopTime);
    interCommandCorrectionPro = true;
  }
  if(antiForce.length % 2 == 1){
    antiForce.unshift(stopTime);
    interCommandCorrectionAnti = true;
  }

  // create 'chunks' for acceleration, which is an array of the start and end times of acceleration for one command
  var proForceChunk = [];
  var antiForceChunk = [];
  if(proForce.length > 0){
    // find any deadtime after acceleration chunk
    deadtimeAtEnd = stopTime - proForce[0];
    // find any deadtime before acceleration chunk
    deadtimeAtBeginning = proForce[proForce.length-1] - startTime;
    // grab first acceleration chunk
    proForceChunk = proForce.splice(proForce.length-2,2);
  }
  
  if(antiForce.length > 0){
    if(antiForce[antiForce.length-1] - startTime < deadtimeAtBeginning) deadtimeAtBeginning = antiForce[antiForce.length-1] - startTime;
    if(stopTime - antiForce[0] < deadtimeAtEnd) deadtimeAtEnd = stopTime - antiForce[0];
    antiForceChunk = antiForce.splice(antiForce.length-2,2);
  } else if(deadtimeAtEnd == stopTime - startTime) deadtimeAtEnd = 0; // there were no chunks, all deadtime is captured in deadtime@beg
  
  // calculate velocity and displacement before any chunk
  if(currentVelocity != 0) downtimePhysics(deadtimeAtBeginning);
  // while command chunks exist, calculate the resulting velcity and distance for each, as well as downtime between
  while(proForceChunk.length > 0 || antiForceChunk.length > 0){
    if(proForceChunk.length > 0 && (antiForceChunk.length == 0 || proForceChunk[1] < antiForceChunk[1])){
      var duration = proForceChunk[0] - proForceChunk[1];
      console.log("acc: " + universalKeypressAcceleration);
      console.log("duration: " + duration);
      console.log("curVel: " + currentVelocity);
      console.log("cur dis: " + displacement);
      movementPhysics(duration, 'pro');
      console.log("res dis: " + displacement);
      var chunkEnd = proForceChunk[0];
      proForceChunk = proForce.length > 0 ? proForce.splice(proForce.length-2,2) : [];
      if(proForceChunk.length > 0 || antiForceChunk.length > 0) interChunkDowntime(chunkEnd);
    } else {
      var duration = antiForceChunk[0] - antiForceChunk[1];
      movementPhysics(duration, 'anti');
      var chunkEnd = antiForceChunk[0];
      antiForceChunk = antiForce.length > 0 ? antiForce.splice(antiForce.length-2,2) : [];
      if(proForceChunk.length > 0 || antiForceChunk.length > 0) interChunkDowntime(chunkEnd);
    }
  }
  
  function movementPhysics(moveDur, accelerationDirection){
    var directionMultiplier = accelerationDirection == 'pro' ? 1 : -1;
    var resultingVel = (moveDur / 1000)*(directionMultiplier * universalKeypressAcceleration) + currentVelocity;
    // if max speed exceeded, find displacement during acceleration then displacement at max for the rest
    if(Math.abs(resultingVel) > universalMaxSpeed) {
      var max = universalMaxSpeed * directionMultiplier;
      var timeAccelerating = (max - currentVelocity) / (directionMultiplier * universalKeypressAcceleration);
      displacement += (directionMultiplier*universalKeypressAcceleration)*(timeAccelerating*timeAccelerating / 1000000) / 2 + currentVelocity*timeAccelerating;
      displacement += universalMaxSpeed * (moveDur - timeAccelerating) / 1000;
      currentVelocity = universalMaxSpeed;
    } else {
      displacement += (directionMultiplier*universalKeypressAcceleration)*(moveDur*moveDur / 1000000) / 2 + currentVelocity*moveDur;
      currentVelocity = resultingVel;
    }
  }
  
  function interChunkDowntime(formerChunkEnd){
    var nextChunkBegin;
    if(antiForceChunk.length == 0) nextChunkBegin = proForceChunk[1];
    else if(proForceChunk.length == 0) nextChunkBegin = antiForceChunk[1];
    else if(proForceChunk[1] < antiForceChunk[1]) nextChunkBegin = proForceChunk[1];
    else nextChunkBegin = antiForceChunk[1];
    downtimePhysics(nextChunkBegin - formerChunkEnd);
  }

  function downtimePhysics(downtimeLength){
    if(currentVelocity > 0){
      var resultingVel = (-1*universalFriction)*downtimeLength/1000 + currentVelocity;
      if(resultingVel < 0){
        var downtimeMovementDuration = (-1 * currentVelocity) / (-1*universalFriction);
        downtimeDisplacement(downtimeMovementDuration, 'anti');
        currentVelocity = 0;
      } else {
        downtimeDisplacement(downtimeLength, 'anti');
        currentVelocity = resultingVel;
      }
    } else if(currentVelocity < 0){
      var resultingVel = universalFriction*downtimeLength + currentVelocity;
      if(resultingVel > 0){
        var downtimeMovementDuration = (-1 * currentVelocity) / universalFriction;
        downtimeDisplacement(downtimeMovementDuration, 'pro');
        currentVelocity = 0;
      } else {
        downtimeDisplacement(downtimeLength, 'pro');
        currentVelocity = resultingVel;
      }
    } else currentVelocity = 0;
  }
  
  function downtimeDisplacement(moveDur, accelerationDirection){
    var directionMultiplier = accelerationDirection == 'pro' ? 1 : -1;
    console.log("in downtimeDisp and dis is: "+displacement);
    displacement += (directionMultiplier*universalFriction)*(moveDur*moveDur / 1000000) / 2 + currentVelocity*moveDur;
        console.log("in downtimeDisp and after dis is: "+displacement);
  }
  
  // calculate velocity after any chunk
  console.log("disp before end dt: "+ displacement);
  console.log("deadtime: "+ deadtimeAtEnd);
  if(currentVelocity != 0) downtimePhysics(deadtimeAtEnd);
  console.log("disp after end dt: "+ displacement);
  // set final velocity and displacement
  if(axis == "x"){
    self.velX = currentVelocity;
    self.locX += displacement;
  } else {
    self.velY = currentVelocity;
    self.locY += displacement;
  }
  
  // add back continued keypress if segment was between keypress and keyup
  if(interCommandCorrectionPro) proForce.unshift(stopTime);
  if(interCommandCorrectionAnti) antiForce.unshift(stopTime);
  
  return self;
};