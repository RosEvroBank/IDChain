(function() {
  'use strict';

  angular
    .module('App')
    .directive('login', addRights);
  
  function addRights(){
    var directive = {
      restrict:'E',
      scope:{
      },
      templateUrl: '/templates/login.html',
      controller: AddRights,
      bindToController: true
    };

    return directive;
  };
    
  AddRights.$inject = ['$scope', 'dataAssistant'];

  function AddRights($scope, dataAssistant){
    $scope.AddRights = function(){        
        var address = $scope.address;
        var perm = $scope.permission;
        //var path = '/eth/AddRights/'+address+'&'+perm;
        var path = `/eth/AddRights/${address}&${perm}`;
        dataAssistant.get(path).then(function(data){
            $scope.addRights_result = data;
        },function(error){
            $scope.addRights_error = error;
        });
    };
  }  
  
})();	