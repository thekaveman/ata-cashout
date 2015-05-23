(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("noncashable", noncashable)
      .controller("noncashableController", ["$scope", "noncashableMaps", noncashableController])
      .factory("noncashableMaps", noncashableMaps);

  function noncashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "noncashableController",
      templateUrl: "results/noncashable.html"
    };
  }

  function noncashableController($scope, maps) {
    $scope.icon = function() {
      return maps.icons.hasOwnProperty($scope.result.config.nonCashable.type)
             ? ["glyphicon", "glyphicon-" + maps.icons[$scope.result.config.nonCashable.type]]
             : null;
    };

    $scope.description = function() {
      return maps.descriptions.hasOwnProperty($scope.result.config.nonCashable.type)
             ? maps.descriptions[$scope.result.config.nonCashable.type]
             : null;
    };

    $scope.showDescription = function() {
      return !!$scope.description;
    }
  }

  function noncashableMaps() {
    return {
      icons: {
        bank: "piggy-bank",
        loss: "exclamation-sign"
      },
      descriptions: {
        bank: "banked at end of fiscal year",
        loss: "lost at end of fiscal year"
      },
      
    };
  }
})();