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
      if(result.accrued < result.cashable)
        return result.accrued;
      else
        return result.cashable;
    }

    $scope.cashableValue = function() {
      return numberFilter($scope.cashableHours() * result.member.payRate, 2);
    }
  }
})();