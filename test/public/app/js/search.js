(function() {
  'use strict';

  angular
    .module('App')
    .directive('search', search);

  function search(){
    var directive = {
      restrict:'E',
      scope:{
      },
      templateUrl: '/templates/search.html',
      controller: Search,
      bindToController: true
    };

    return directive;
  };
  
  
  Search.$inject = ['$scope', 'dataAssistant', 'cryptoUtils'];

  function Search($scope, dataAssistant, cryptoUtils){
    
      $scope.RequestPC = function(){
        var hash1 = $scope.hash1;
		var token = '0x' + $scope.token;
        var path = `/eth/RequestPC/${hash1}&${token}`;
        dataAssistant.get(path).then(function(data){            
            $scope.search_result = data.data;
        },function(error){
            $scope.search_error = error.data;
        });
      };
      
      $scope.Request = function(){
        var hash1 = $scope.hash1;
        var token = '0x' + $scope.token;
        var path = `/eth/Request/${hash1}&${token}`;
        dataAssistant.get(path).then(function(data){            
            $scope.search_result = data.data;
        },function(error){
            $scope.search_error = error.data;
        });
      };
      
      $scope.calcHash1 = function(){
        //$scope.hash1 = cryptoUtils.SHA256($scope.firstname);
      }
      
      $scope.calcHash2 = function(){
        //$scope.hash2 = cryptoUtils.SHA256($scope.lastname);
      }
      
      $scope.calcHash3 = function(){
        //$scope.hash3 = cryptoUtils.SHA256($scope.bday.toString());
      }
      
      $scope.calcToken = function(){
        //$scope.hash4 = cryptoUtils.SHA256($scope.token);		
        $scope.hash1 = '0x' + cryptoUtils.SHA256($scope.firstname + '_' + $scope.lastname + '_' + $scope.bday.toString().substr(4,11));
      }
    
  }  
  
})();	