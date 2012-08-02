var fishList = {};
var locationArray = [];

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
  return this.fishList;
};

GameMaster.prototype.registerCommand = function registerCommand(socketId,c){
  var fish = this.fishList[socketId];
  switch(c.dir){
    case "l":
      // check for missed packet
      if(c.act == "p" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.timestamp - 1); // missed key release on same direction
      if(c.act == "r" && fish.aLeft.length % 2 == 0) fish.aLeft.unshift(c.timestamp - 200); // missed key press on same direction
      if(c.act == "p" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.timestamp - 1); // missed key release on opposing direction
      if(c.act == "r" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.timestamp - 1); // missed key release on opposing direction      
      else fish.aLeft.unshift(c.timestamp);
      break;
    case "r":
      if(c.act == "p" && fish.aRight.length % 2 == 1) fish.aRight.unshift(c.timestamp - 1); // missed key release on same direction
      if(c.act == "r" && fish.aRight.length % 2 == 0) fish.aRight.unshift(c.timestamp - 200); // missed key press on same direction
      if(c.act == "p" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.timestamp - 1); // missed key release on opposing direction
      if(c.act == "r" && fish.aLeft.length % 2 == 1) fish.aLeft.unshift(c.timestamp - 1); // missed key release on opposing direction          
      else this.fishList[socketId].aRight.unshift(c.timestamp);
      break;
    case "u":
    // repeat above patterns here (actually, cut those into a separate method to keep DRY)
      this.fishList[socketId].aUp.unshift(c.timestamp);
      break;
    case "d":
      this.fishList[socketId].aDown.unshift(c.timestamp);
      break;
  }
};