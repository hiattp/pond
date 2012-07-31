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
    dir : 0
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