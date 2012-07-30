var fishList = {};
var locationArray = [];

var GameMaster = module.exports = function GameMaster(){
  this.fishList = {};
  this.locationArray = [];
};

GameMaster.prototype.addFish = function addFish(newFish,callback){
  this.fishList[newFish.socketId] = newFish.fishDetails;
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