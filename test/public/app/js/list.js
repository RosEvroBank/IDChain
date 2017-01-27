(function() {
  'use strict';

  angular
    .module('App')
    .directive('list', list);

  function list(){
    var directive = {
      restrict:'E',
      scope:{
      },
      templateUrl: '/templates/list.html',
      controller: List,
      bindToController: true
    };

    return directive;
  };
  
  
  List.$inject = ['$scope', 'dataAssistant'];

  function List($scope, dataAssistant){
    $scope.list = [];

    $scope.listInit = function(){
      dataAssistant.get('/api/list').then(function(data){
        
        $scope.list = data;
      },function(error){
        $scope.list_error = error;
      });
    };
  }  
  
})();