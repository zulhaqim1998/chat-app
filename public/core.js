var app = angular.module('myApp', []);

var socket = io();

app.controller('MainController', ['$scope', function($scope){

  $scope.sendMsg = function(){
    socket.emit('chat message', $scope.input);
    $scope.input = '';
  };
  socket.on('chat message', function(msg){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    document.getElementById("messages").appendChild(li);
    console.log('message sent');
  });

}]);
