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
    var result = $scope.result;

    $scope.cashableHours = function() {
      return result.cashable;
    }

    $scope.cashableAmount = function() {
      return numberFilter($scope.cashableHours() * result.member.payRate, 2);
    }
  }
})();