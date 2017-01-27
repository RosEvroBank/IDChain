(function() {
  'use strict';

  angular
    .module('App')
    .directive('add', add);

  function add(){
    var directive = {
      restrict:'E',
      scope:{
      },
      templateUrl: '/templates/add.html',
      controller: Add,
      bindToController: true
    };

    return directive;
  };
  
  
  Add.$inject = ['$scope', 'dataAssistant', 'cryptoUtils'];

  function Add($scope, dataAssistant, cryptoUtils){

    $scope.add = function(){        
        var hash1 = $scope.hash1;
        var token1 = $scope.hash4;
        //var hash1 = cryptoUtils.SHA256($scope.firstname + $scope.lastname + $scope.bday.toString());
        var path = `/eth/AddHash/${hash1}&${token1}`;
        dataAssistant.get(path).then(function(data){
            $scope.add_result = data;
        },function(error){
            $scope.add_error = error;
        });
    };
    
    $scope.calcHash1 = function(){
      //$scope.hash1 = cryptoUtils.SHA256($scope.firstname);
      $scope.calcHash4();
    } 
    
    $scope.calcHash2 = function(){
      //$scope.hash2 = cryptoUtils.SHA256($scope.lastname);
      $scope.calcHash4();
    }
    
    $scope.calcHash3 = function(){
      //$scope.hash3 = cryptoUtils.SHA256($scope.bday.toString());
      $scope.calcHash4();
    }
    
    $scope.calcHash4 = function(){
      //$scope.hash4 = cryptoUtils.SHA256($scope.token);
	  $scope.token = 'REB_' + $scope.firstname + '_' + $scope.lastname + '_' + $scope.bday.toString().substr(4,11);
      $scope.hash4 = '0x' + cryptoUtils.SHA256($scope.token);
	  $scope.hash1 = '0x' + cryptoUtils.SHA256($scope.firstname + '_' + $scope.lastname + '_' + $scope.bday.toString().substr(4,11));
    }
    
  }

  
  
})();	
