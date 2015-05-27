(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("cashable", cashable)
      .controller("CashableController", ["$scope", "numberFilter", CashableController]);

  function cashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "CashableController",
      templateUrl: "results/cashable.html"
    };
  }

  function CashableController($scope, numberFilter) {

    $scope.cashableHours = function() {
      return $scope.result.cashable;
    }

    $scope.cashableAmount = function() {
      return numberFilter($scope.cashableHours() * $scope.result.member.payRate, 2);
    }

    $scope.show = {
      hours: function() {
        return $scope.cashableHours() > 0;
      },
      message: function() {
        var config = $scope.result.config;
        return config.cashable ? config.cashable.show : false;
      }
    };

    $scope.message = function() {
      var config = $scope.result.config;
      return config.cashable ? config.cashable.message : null;
    };
  }
})();