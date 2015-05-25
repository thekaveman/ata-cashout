(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("cashable", cashable)
      .controller("cashableController", ["$scope", "numberFilter", cashableController]);

  function cashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "cashableController",
      templateUrl: "results/cashable.html"
    };
  }

  function cashableController($scope, numberFilter) {

    $scope.cashableHours = function() {
      return $scope.result.cashable;
    }

    $scope.cashableAmount = function() {
      return numberFilter($scope.cashableHours() * $scope.result.member.payRate, 2);
    }
  }
})();