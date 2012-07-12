var fishList = {};
var locationArray = [];

var GameMaster = function(){
  
  this.addFish = function addFish(newFish,callback){
    fishList[newFish.socketId] = newFish.fishDetails;
    callback();
  };
  
  this.removeFish = function removeFish(socketId){
    delete fishList[socketId];
  };
  
  this.allFish = function allFish(){
    return fishList;
  }

  this.locationUpdate = function locationUpdate(){
    return fishList;
  };
  
};

module.exports = new GameMaster();