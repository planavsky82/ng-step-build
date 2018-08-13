'use strict';

(function() {

  angular.module('demo', [
    'planavsky.directive.ngStep'
  ])

  .controller('demoCtrl', demoCtrl);

  demoCtrl.$inject = ['$http'];

  function demoCtrl($http) {

    var vm = this;

    $http.get('/mock-data/sample-data.json').then(function(response) {
      console.log(response);
    }, function(error) {
      console.log(error);
    });

    vm.demoObj = [
      {
        icon : 'fa-html5',
        shortDesc : 'desc1',
        url : 'demo/pages/page-1.html'
      },
      {
        icon : 'fa-moon-o',
        shortDesc : 'desc2',
        url : 'demo/pages/page-2.html'
      },
      {
        icon : 'fa-group',
        shortDesc : 'desc3',
        url : 'demo/pages/page-3.html'
      },
      {
        icon : 'fa-flash',
        shortDesc : 'desc4',
        url : 'demo/pages/page-4.html'
      },
      {
        icon : 'fa-leaf',
        shortDesc : 'desc5',
        url : 'demo/pages/page-5.html'
      }
    ];

  }

})();