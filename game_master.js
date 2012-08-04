var Fish = require('./fish')
  , fishList = {};

var GameMaster = module.exports = function GameMaster(){
  this.fishList = {};
  this.locationArray = [];
};

GameMaster.prototype.addFish = function addFish(newFish,callback){
  this.fishList[newFish.socketId] = new Fish(newFish.name);
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
      , timeNow = Date.now();
    fish.updateLocationAndVelocity('x', timeNow).updateLocationAndVelocity('y', timeNow).setLastUpdate(timeNow);
  }
  return this.fishList;
};

GameMaster.prototype.registerCommand = function registerCommand(socketId,c){
  // NEED TO USE NEW FISH NOTATION HERE?
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