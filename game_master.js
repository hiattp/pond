var Fish = require('./fish')
  , fishList = {};

var GameMaster = module.exports = function GameMaster(){
  this.fishList = {};
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
  var self = this
    , fishUpdate = []
    , timeNow = Date.now();
  // is it possible to have commands issued after this stopTime?
  for(fishId in self.fishList){
    var fish = self.fishList[fishId];
    fish.updateLocationAndVelocity('x', timeNow).updateLocationAndVelocity('y', timeNow).setLastUpdate(timeNow);
    fishUpdate.push({
      name : fish.name,
      locX : fish.locX,
      locY : fish.locY
    });
    console.log(fish.locX);
  }
  console.log("update physics runtime for "+ Object.keys(self.fishList).length +" fish: "+(Date.now() - timeNow)+" ms.");
  return fishUpdate;
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