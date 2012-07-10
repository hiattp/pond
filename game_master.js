var fishList = {};
var locationArray = [];

var GameMaster = function(){
  
  this.addFish = function addFish(newFish,callback){
    fishList[newFish.socketId] = newFish.fishDetails;
    callback();
  };

  this.locationUpdate = function locationUpdate(){
    return locationArray;
  };
  
};

module.exports = new GameMaster();