(function() {
  'use strict';

  angular
    .module('App')
    .factory('dataAssistant', dataAssistant);

  dataAssistant.$inject = ['$http'];

  function dataAssistant($http) {
    return {
      get:  get,
      put:  put,
      post: post
    };

    function get(url, options){
      return $http.get(url, options);
    }

    function put(url, data, options){
      return $http.put(url, data, options);
    }

    function post(url, data, options){
      return $http.post(url, data, options);
    }
  }

})();
