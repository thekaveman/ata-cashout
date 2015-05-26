(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("noncashable", noncashable)
      .controller("NonCashableController", ["$scope", "numberFilter", "NonCashableMaps", NonCashableController])
      .factory("NonCashableMaps", NonCashableMaps);

  function noncashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "NonCashableController",
      templateUrl: "results/noncashable.html"
    };
  }

  function NonCashableController($scope, numberFilter, maps) {
    $scope.description = function(type) {
      type = type || $scope.result.config.noncashable.type;
      return maps.descriptions.hasOwnProperty(type)
             ? maps.descriptions[type]
             : null;
    };

    $scope.icon = function(type) {
      type = type || $scope.result.config.noncashable.type;
      return maps.icons.hasOwnProperty(type)
             ? ["glyphicon", "glyphicon-" + maps.icons[type]]
             : null;
    };

    $scope.hours = {
      loss: function() {
        return $scope.result.loss || 0;
      },
      maxCarryover: function() {
        return $scope.hours.noncashable();
      },
      noncashable: function() {
        return $scope.result.noncashable;
      }
    };

    $scope.amounts = {
      noncashable: function() {
        return numberFilter($scope.hours.noncashable() * $scope.result.member.payRate, 2);
      },
      loss: function() {
        return numberFilter($scope.hours.loss() * $scope.result.member.payRate, 2);
      }
    };

    $scope.show = {
      any: function() {
        return $scope.hours.noncashable() > 0;
      },
      description: function() {
        return !!$scope.description();
      },
      loss: function() {
        return $scope.hours.loss() > 0;
      }
    };
  }

  function NonCashableMaps() {
    return {
      descriptions: {
        bank: "banked at end of fiscal year",
        loss: "lost at end of fiscal year"
      },
      icons: {
        bank: "piggy-bank",
        loss: "exclamation-sign"
      }
    };
  }
})();