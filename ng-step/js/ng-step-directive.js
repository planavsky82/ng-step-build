'use strict';

angular.module('planavsky.directive.ngStep',[])
  .directive('ngStep', ngStep);

ngStep.$inject = ['$http', '$compile', '$timeout', '$location', '$anchorScroll', '$q'];

// TODO: get rid of jquery references and figure out why angular.element cant be used as a selector. Use anular.element($document[0].querySelectorAll('#element'));?

function ngStep($http, $compile, $timeout, $location, $anchorScroll, $q) {

  var directive = {
    templateUrl: 'ng-step/views/index.html',
    restrict: 'E',
    scope: {
      items: '='
    },
    compile: compile,
    controller: controller,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function compile (element, attrs) {

    if (!attrs.displayProgressBar) {
      attrs.displayProgressBar = true;
    }

    if (!attrs.displayToken) {
      attrs.displayToken = true;
    }

    if (!attrs.displayButtons) {
      attrs.displayButtons = true;
    }

    return {
      post: link
    };

  }

  function controller ($scope, $element, $attrs) {

    var vm = this;

    vm.displayProgressBar = $attrs.displayProgressBar;
    vm.displayToken = $attrs.displayToken;
    vm.displayButtons = $attrs.displayButtons;
    vm.activeId = 0;
    vm.lastId = vm.items.length - 1;
    vm.lastActiveId = 0;
    vm.icon1 = vm.items[0].icon;
    vm.icon2 = vm.items[1].icon;
    vm.desc1 = vm.items[0].shortDesc;
    vm.desc2 = vm.items[1].shortDesc;
    vm.tokenDisplay = 'front';

    var init = function () {

      angular.forEach(vm.items, function (item, key) {

        if (item.active) {
          vm.lastActiveId = key;
        }

        item.id = key;

        if (!item.templateLoaded) {
          item.templateLoaded = true;
        }

        item.uiView = 'planavsky.ng.step.ui.view-' + key;

        if (key === vm.activeId) {
          item.active = true;
        }
        else
        {
          item.active = false;
        }

        // find previous id
        if (key > 0) {
          item.previousId = key - 1;
        }
        else
        {
          item.previousId = 'none';
        }

        // find next id
        if (key < vm.items.length - 1) {
          item.nextId = key + 1;
        }
        else
        {
          item.nextId = 'none';
        }

        loadUrl(item.url, item.uiView);

      });

    };

    vm.navigate = function (action) {

      if (action === 'previous') {
        vm.activeId--;
      }

      if (action === 'next') {
        vm.activeId++;
      }

      init();

      $scope.flip('token').then(function() {

        $scope.fadeInIcon();
        $scope.changeView(vm.activeId);
        $scope.updateStatusBar();

      });

    };

    var loadUrl = function (url, uiView) {

      // adding $timeout so that the container divs can be referenced after the dom is loaded
      $timeout(function () {

        var content = $('[ui-view="' + uiView + '"]');

        // Manually load content into ui-view
        $http.get(url).success(function(html) {
          content.html(html);
          $compile(content)($scope);
        });

      }, 1);

    };

    init();

  }

  function link (scope, element, attrs) {

    /*

     sample data model:

     items:

     [{
      icon : 'icon',
      shortDesc : 'shortDesc' (optional),
      url : '{ view path }' (optional)
     }]

    */

    scope.flip = function(cardId){

      scope.vm.icon1 = '';
      scope.vm.icon2 = '';
      scope.vm.desc1 = '';
      scope.vm.desc2 = '';

      $('.ng-step-token .front').removeClass('loaded');
      $('.ng-step-token .back').removeClass('loaded');

      var deferred = $q.defer();

      if (Modernizr.csstransitions) {
        document.querySelector('#flip-toggle-' + cardId).classList.toggle('hover');
      }else{
        if ($('#flip-toggle-' + cardId + ' .front').css('display') === 'block'){
          $('#flip-toggle-' + cardId + ' .front').hide();
          $('#flip-toggle-' + cardId + ' .back').show();
        }else{
          $('#flip-toggle-' + cardId + ' .front').show();
          $('#flip-toggle-' + cardId + ' .back').hide();
        }
      }

      if (scope.vm.tokenDisplay === 'front') {
        scope.vm.tokenDisplay = 'back'
      }
      else
      {
        scope.vm.tokenDisplay = 'front'
      }

      deferred.resolve();

      return deferred.promise;

    };

    scope.changeView = function (activeId) {

      if (!scope.position) {
        scope.position = 0;
      }

      scope.paneWidth = $('.ng-step-content-pane')[0].offsetWidth;

      $location.hash('ng-step-top');
      $anchorScroll();

      angular.forEach(scope.vm.items, function (item, key) {

        if (item.id === activeId) {

          if (item.previousId === scope.vm.lastActiveId) {
            scope.position -= scope.paneWidth;
            transition(scope.position, key);
          }

          if (item.nextId === scope.vm.lastActiveId) {
            scope.position += scope.paneWidth;
            transition(scope.position, key);
          }
        }

      });

    };

    scope.fadeInIcon = function () {

      $timeout(function () {

        if (scope.vm.tokenDisplay === 'front') {

          scope.vm.icon1 = scope.vm.items[scope.vm.activeId].icon;
          scope.vm.desc1 = scope.vm.items[scope.vm.activeId].shortDesc;

          $('.ng-step-token .front').addClass('loaded');

        }
        else
        {

          scope.vm.icon2 = scope.vm.items[scope.vm.activeId].icon;
          scope.vm.desc2 = scope.vm.items[scope.vm.activeId].shortDesc;

          $('.ng-step-token .back').addClass('loaded');

        }

      }, 1000);

    };

    scope.updateStatusBar = function () {

      var step = scope.vm.activeId + 1;
      var total = scope.vm.items.length;
      var percentage = (step/total) * 100;

      $('.ng-step-status-bar-fill').css('width', percentage + '%');

    };

    var transition = function (position, newIndex) {

      angular.forEach(scope.vm.items, function (item, key) {

        $('#ng-step-content-pane-' + key).css('left', position + 'px');

      });

    };

    scope.updateStatusBar();

  }

}