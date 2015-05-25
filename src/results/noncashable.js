(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("noncashable", noncashable)
      .controller("noncashableController", ["$scope", "numberFilter", "noncashableMaps", noncashableController])
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

  function noncashableController($scope, numberFilter, maps) {
    var result = $scope.result,
        member = result.member;

    $scope.icon = function(type) {
      type = type || result.config.noncashable.type;
      return maps.icons.hasOwnProperty(type)
             ? ["glyphicon", "glyphicon-" + maps.icons[type]]
             : null;
    };

    $scope.description = function(type) {
      type = type || result.config.noncashable.type;
      return maps.descriptions.hasOwnProperty(type)
             ? maps.descriptions[type]
             : null;
    };

    $scope.hours = {
      maxCarryover: function() {
        return $scope.hours.noncashable();
      },
      noncashable: function() {
        return result.noncashable;
      },
      loss: function() {
        return result.loss || 0;
      }
    };

    $scope.amounts = {
      noncashable: function() {
        return numberFilter($scope.hours.noncashable() * member.payRate, 2);
      },
      loss: function() {
        return numberFilter($scope.hours.loss() * member.payRate, 2);
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