(function() {
  'use strict';

  angular
    .module('App')
    .directive('profile', giveTokenPerm);

  function giveTokenPerm(){
    var directive = {
      restrict:'E',
      scope:{
      },
      templateUrl: '/templates/profile.html',
      controller: GiveTokenPerm,
      bindToController: true
    };

    return directive;
  }; 
  
  GiveTokenPerm.$inject = ['$scope', 'dataAssistant'];

  function GiveTokenPerm($scope, dataAssistant){
    $scope.GiveTokenPerm = function(){        
        var address = $scope.address;
        var token = '0x' + $scope.token;
        var path = `/eth/GiveTokenPerm/${address}&${token}`;
        dataAssistant.get(path).then(function(data){
            $scope.GiveTokenPerm_result = data;
        },function(error){
            $scope.GiveTokenPerm_error = error;
        });
    }
  }
})();	